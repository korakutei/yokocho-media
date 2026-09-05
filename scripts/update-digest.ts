/**
 * 横丁ニュース・ダイジェスト更新スクリプト（雛形）
 * ---------------------------------------------------------
 * 現状のCowork運用では、毎朝「横丁ニュース毎日キャッチアップ」タスクが
 * WebSearchで新着情報を集め、Artifact（またはこのリポジトリのdata/digest.json）
 * を直接書き換えている。
 *
 * この本実装（Next.js）側では、同じ「収集結果のJSONをそのまま反映する」形に
 * 揃えるため、以下のような使い方を想定している：
 *
 *   npm run digest:update -- ./new-items.json
 *
 * new-items.json は DigestItem[] 形式（lib/types.ts参照）の配列で、
 * 当日分の記事一覧をそのまま渡す。このスクリプトが
 *   1. 最低限の形式チェック
 *   2. data/digest.json の書き換え（updatedAt / updatedLabel も当日日付に更新）
 * を行う。
 *
 * TODO（今後の開発項目・Claude Codeでの実装候補）:
 *   - WebSearch相当の情報収集ロジックをこのリポジトリ内に持たせるか、
 *     外部ジョブ（Cowork側のスケジュールタスク）から呼び出す形にするかの設計判断
 *   - 収集→要約→確信度判定を行うLLM呼び出し部分の実装
 *   - 「本日ゼロ件なら既存内容を維持する」というArtifact運用ルールの実装
 *     （このスクリプトは現状、渡された配列が空なら items を上書きしない）
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { DigestData, DigestItem } from "../lib/types";

const DIGEST_PATH = resolve(__dirname, "../data/digest.json");

function isValidItem(x: unknown): x is DigestItem {
  if (typeof x !== "object" || x === null) return false;
  const item = x as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.date === "string" &&
    typeof item.tag === "string" &&
    typeof item.isNew === "boolean" &&
    typeof item.title === "string" &&
    typeof item.desc === "string" &&
    (item.confidence === null || typeof item.confidence === "string") &&
    typeof item.sourceUrl === "string" &&
    typeof item.sourceName === "string"
  );
}

function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "使い方: npm run digest:update -- <新着記事一覧.jsonのパス>"
    );
    process.exit(1);
  }

  const raw = readFileSync(resolve(process.cwd(), inputPath), "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    console.error("入力は DigestItem の配列である必要があります。");
    process.exit(1);
  }

  const invalid = parsed.filter((x) => !isValidItem(x));
  if (invalid.length > 0) {
    console.error(
      `形式が不正な項目が ${invalid.length} 件あります。lib/types.ts の DigestItem を確認してください。`
    );
    process.exit(1);
  }

  const current: DigestData = JSON.parse(readFileSync(DIGEST_PATH, "utf-8"));

  if (parsed.length === 0) {
    console.log(
      "新着0件のため、既存のdigest内容を維持します（Artifact運用と同じルール）。"
    );
    return;
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [y, m, d] = today.split("-").map(Number);
  const updated: DigestData = {
    updatedAt: today,
    updatedLabel: `${y}年${m}月${d}日 更新`,
    items: parsed as DigestItem[],
  };

  writeFileSync(DIGEST_PATH, JSON.stringify(updated, null, 2) + "\n", "utf-8");
  console.log(`data/digest.json を更新しました（${parsed.length}件）。`);
}

main();
