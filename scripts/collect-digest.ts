/**
 * 横丁ニュース・ダイジェスト自動収集スクリプト
 * ---------------------------------------------------------
 * Claude(claude-sonnet-5)にサーバーサイドの web_search ツールを渡し、
 * 直近の横丁関連ニュースを収集・要約・確信度判定させた上で、
 * 「submit_digest」ツール呼び出しとして構造化された結果を受け取る。
 *
 * GitHub Actions から `npm run digest:collect` として毎朝実行される想定
 * (.github/workflows/digest-daily.yml)。ANTHROPIC_API_KEY が環境変数に
 * 必要(ローカル実行時は .env.example を参考に用意すること)。
 *
 * 新着(掲載基準を満たす項目)が0件の場合は、既存の data/digest.json を
 * 変更しない(scripts/update-digest.ts と同じルール)。
 */

import Anthropic from "@anthropic-ai/sdk";
import { resolve } from "node:path";
import { isValidItem, writeDigest } from "./lib/digest-io";
import type { DigestItem } from "../lib/types";

const DIGEST_PATH = resolve(__dirname, "../data/digest.json");
const MODEL = "claude-sonnet-5";
const MAX_TURNS = 6;

/**
 * 掲載基準・トーンの初稿。
 *
 * 本来の掲載基準(何を「横丁」とみなすか等)はCowork側のmemoryで管理されており、
 * このリポジトリからは参照できない。ここでは data/digest.json の既存3件の実例と
 * サイトコピー(「公開情報の要約と出典リンクの集約のみ」「本文転載しない」)から
 * 逆算した初稿を置いている。運用しながら文面を調整すること。
 *
 * 見出し・要約のトーンは、マーケティング戦略家・Webデザイナー・横丁コンサルタントに
 * よるコンテンツ戦略レビュー(2026-09-05)を踏まえ、「〜動向を注視したい」等の
 * 内部メモ口調を廃止し、読者の検索意図(「○○ 横丁 いつ」「○○横丁 営業時間」等)に
 * 応える書き方に統一している。
 */
const SYSTEM_PROMPT = `あなたは「ヨコチョナビ」というWebメディアの編集アシスタントです。
日本全国の「横丁」(横丁的な小規模飲食店街・屋台街・スナック街を含む)に関する
直近(概ね14日以内)の公開ニュースを web_search ツールで収集し、その日の
ダイジェストとして submit_digest ツールで提出してください。

# 掲載基準
- 対象:横丁・横丁的施設の新規開業、既存横丁での新施設・新店舗、横丁に関する
  イベント(はしご酒企画等)、横丁を運営する企業(浜倉的商店製作所グループ等)の
  発表、横丁文化に関する注目度の高い動向。
- 「横丁」を名乗っていない商店街のイベント等でも、横丁文化の参考事例として
  価値があれば掲載してよい。ただしその場合は confidence に留保点を明記すること
  (例:「横丁を名乗る施設ではなく商店街主催のイベントである点に留意」)。
- 内容の信頼性に迷いがある場合、または「横丁」の定義から外れる可能性がある場合は
  confidence にその旨を日本語で簡潔に記載する。確信度が高く留保点がなければ
  confidence は null にする。
- 本文の転載はしない。公開情報の要約と出典リンクの集約のみを行う。
- 掲載基準を満たす項目が見つからない場合は、無理に項目を作らず items を
  空配列にして提出する。

# 出力フォーマット(各項目)
- id: 英数字とハイフンのみの一意なスラッグ(例: "shibuya-snack-yokocho")
- date: "MM.DD" 形式(例: "09.01")。開催中のイベント等は "開催中" のような
  文字列でもよい。
- tag: "新規開業" "新施設" "イベント" "運営元" など自由記述の短いタグ。
  既存の表記(新規開業・新施設・イベント・運営元)との表記ゆれに注意する。
- isNew: そのニュースが特に新しく、強調表示すべきなら true。
- title: 見出し(30〜40字程度)。読者が実際に検索しそうな語(地名+「横丁」+
  「オープン」「いつ」「何店舗」等の具体語)を含め、検索意図に応える見出しにする。
  「〜へ」で終える速報的な体言止めは可だが、社内メモのような言い回しは避ける。
- desc: 2〜3文程度の要約。読者が知りたい事実(いつ・どこで・何が・何店舗か等)を
  優先し、末尾に編集者目線の一言(「〜動向を注視したい」「〜掲載候補」等)を
  付け加えない。事実だけで完結させ、読者に語りかけるトーンにする。
- confidence: 上記の掲載基準を参照。留保点がなければ null。
- sourceUrl: 出典記事のURL。
- sourceName: 出典媒体名(例: "流通ニュース")。

1日あたり3〜8件程度を目安とする。件数はあくまで目安であり、質を優先すること。
収集が完了したら、必ず submit_digest ツールを呼び出して結果を提出すること。
テキストでの回答のみで終わらせないこと。`;

const SUBMIT_DIGEST_TOOL: Anthropic.Tool = {
  name: "submit_digest",
  description:
    "収集・要約・確信度判定を終えた、本日の横丁ニュース・ダイジェストを提出する。掲載基準を満たす項目がなければ items を空配列にする。",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            date: { type: "string" },
            tag: { type: "string" },
            isNew: { type: "boolean" },
            title: { type: "string" },
            desc: { type: "string" },
            confidence: { type: ["string", "null"] },
            sourceUrl: { type: "string" },
            sourceName: { type: "string" },
          },
          required: [
            "id",
            "date",
            "tag",
            "isNew",
            "title",
            "desc",
            "confidence",
            "sourceUrl",
            "sourceName",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["items"],
    additionalProperties: false,
  },
};

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY が設定されていません。");
    process.exit(1);
  }

  const client = new Anthropic();

  const tools: Anthropic.Messages.ToolUnion[] = [
    { type: "web_search_20260209", name: "web_search", max_uses: 8 },
    SUBMIT_DIGEST_TOOL,
  ];

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content:
        "本日分の横丁ニュース・ダイジェストを収集し、submit_digestツールで提出してください。",
    },
  ];

  let finalItems: unknown[] | null = null;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    if (response.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: response.content });
      continue;
    }

    const submitBlock = response.content.find(
      (b): b is Anthropic.ToolUseBlock =>
        b.type === "tool_use" && b.name === "submit_digest"
    );

    if (submitBlock) {
      const input = submitBlock.input as { items: unknown[] };
      finalItems = input.items;
      break;
    }

    if (response.stop_reason === "tool_use") {
      // submit_digest 以外のクライアント側ツール呼び出しは想定していないが、
      // 念のためエラーを返して継続させる。
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: toolUseBlocks.map((b) => ({
          type: "tool_result" as const,
          tool_use_id: b.id,
          content: "このツールはサポートされていません。",
          is_error: true,
        })),
      });
      continue;
    }

    // submit_digest を呼ばずに終了した場合は一度だけ促す。
    messages.push({ role: "assistant", content: response.content });
    messages.push({
      role: "user",
      content:
        "続けて submit_digest ツールを呼び出し、収集結果を提出してください。",
    });
  }

  if (finalItems === null) {
    console.error(
      `Claudeが${MAX_TURNS}ターン以内にsubmit_digestを呼び出しませんでした。収集を中止します。`
    );
    process.exit(1);
  }

  const invalid = finalItems.filter((x) => !isValidItem(x));
  if (invalid.length > 0) {
    console.error(
      `形式が不正な項目が ${invalid.length} 件あります。lib/types.ts の DigestItem を確認してください。`
    );
    console.error(JSON.stringify(finalItems, null, 2));
    process.exit(1);
  }

  if (finalItems.length === 0) {
    console.log(
      "本日、掲載基準を満たす新着情報はありませんでした。既存のdigest内容を維持します。"
    );
    return;
  }

  writeDigest(DIGEST_PATH, finalItems as DigestItem[]);
  console.log(`data/digest.json を更新しました(${finalItems.length}件)。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
