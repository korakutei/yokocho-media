/**
 * 横丁ニュース・ダイジェスト手動更新スクリプト
 * ---------------------------------------------------------
 *   npm run digest:update -- ./new-items.json
 *
 * new-items.json は DigestItem[] 形式(lib/types.ts参照)の配列で、当日分の
 * 記事一覧をそのまま渡す。日次の自動収集(scripts/collect-digest.ts)を使わず、
 * 人手で内容を確定させたいときのための経路として残している。
 *
 * 新着0件(空配列)を渡した場合は、既存のdigest内容を維持する(自動収集側と同じルール)。
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isValidItem, writeDigest } from "./lib/digest-io";
import type { DigestItem } from "../lib/types";

const DIGEST_PATH = resolve(__dirname, "../data/digest.json");

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

  if (parsed.length === 0) {
    console.log(
      "新着0件のため、既存のdigest内容を維持します(Artifact運用と同じルール)。"
    );
    return;
  }

  writeDigest(DIGEST_PATH, parsed as DigestItem[]);
  console.log(`data/digest.json を更新しました(${parsed.length}件)。`);
}

main();
