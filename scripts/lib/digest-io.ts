/**
 * data/digest.json の読み書き・バリデーションの共通ロジック。
 * scripts/update-digest.ts(手動更新)と scripts/collect-digest.ts(自動収集)の両方から使う。
 */

import { readFileSync, writeFileSync } from "node:fs";
import type { DigestData, DigestItem } from "../../lib/types";

export function isValidItem(x: unknown): x is DigestItem {
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

/**
 * JST(UTC+9)の「今日」を返す。GitHub Actionsランナー(UTC)上で実行しても
 * 日本時間の日付にならないと updatedLabel がズレるため、サーバーのタイムゾーンに
 * 依存せずUTC+9を明示的に加算する。
 */
export function todayJst(): { iso: string; label: string } {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = jst.getUTCMonth() + 1;
  const d = jst.getUTCDate();
  const iso = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const label = `${y}年${m}月${d}日 更新`;
  return { iso, label };
}

export function readDigest(path: string): DigestData {
  return JSON.parse(readFileSync(path, "utf-8"));
}

/**
 * 項目のソート用タイムスタンプを求める。
 * date が "MM.DD" 形式ならその日付(今年扱い)、"開催中"等の自由記述なら
 * startDate、どちらもなければ最下位に沈むよう0を返す。
 */
function sortTimestamp(item: DigestItem, yearIso: string): number {
  const md = item.date.match(/^(\d{2})\.(\d{2})$/);
  if (md) {
    return new Date(
      `${yearIso}-${md[1]}-${md[2]}T00:00:00+09:00`
    ).getTime();
  }
  // startDateはDigestItem型に未定義のバージョンとも共存できるよう、
  // 存在チェックのみで安全に読み取る。
  const startDate = (item as { startDate?: unknown }).startDate;
  if (typeof startDate === "string") {
    return new Date(`${startDate}T00:00:00+09:00`).getTime();
  }
  return 0;
}

/**
 * 常に日付の新しい項目が一番上に来るよう並び替える(サイトの基本仕様)。
 * date("MM.DD")の降順。同日はstartDateがあればさらにそれで補正し、
 * 完全に同値の場合は入力順を維持する(Array#sortは安定ソート)。
 */
function sortItemsNewestFirst(items: DigestItem[]): DigestItem[] {
  const { iso } = todayJst();
  const year = iso.slice(0, 4);
  return [...items].sort(
    (a, b) => sortTimestamp(b, year) - sortTimestamp(a, year)
  );
}

export function writeDigest(path: string, items: DigestItem[]): void {
  const { iso, label } = todayJst();
  const data: DigestData = {
    updatedAt: iso,
    updatedLabel: label,
    items: sortItemsNewestFirst(items),
  };
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
