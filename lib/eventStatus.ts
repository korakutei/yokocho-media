import type { DigestItem } from "./types";

export type EventStatus = "開催中" | "今週末" | "近日" | null;

/** JST(UTC+9)の「今日」をYYYY-MM-DD形式で返す。 */
export function todayJstIso(): string {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const y = jst.getUTCFullYear();
  const m = jst.getUTCMonth() + 1;
  const d = jst.getUTCDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * startDate/endDateが確認できている項目のみ、JST基準で開催状況ラベルを判定する。
 * 未確認(どちらか欠けている)場合は必ずnullを返す(断定表示を避けるため)。
 */
export function computeEventStatus(
  item: DigestItem,
  todayIso: string = todayJstIso()
): EventStatus {
  if (!item.startDate || !item.endDate) return null;

  const today = new Date(`${todayIso}T00:00:00+09:00`).getTime();
  const start = new Date(`${item.startDate}T00:00:00+09:00`).getTime();
  const end = new Date(`${item.endDate}T23:59:59+09:00`).getTime();

  if (today >= start && today <= end) return "開催中";

  const daysUntilStart = Math.round((start - today) / 86400000);
  if (daysUntilStart > 0 && daysUntilStart <= 7) {
    // 直近の週末(土日)を含むかどうかで「今週末」/「近日」を分ける簡易判定
    const startDay = new Date(`${item.startDate}T00:00:00+09:00`).getUTCDay();
    if (daysUntilStart <= 7 && (startDay === 0 || startDay === 6)) {
      return "今週末";
    }
    return "近日";
  }

  return null;
}

/** endDateが過去(=終了済み)の項目かどうかを判定する。startDate/endDate未確認の項目は終了扱いにしない。 */
export function isEventEnded(
  item: DigestItem,
  todayIso: string = todayJstIso()
): boolean {
  if (!item.endDate) return false;
  const today = new Date(`${todayIso}T00:00:00+09:00`).getTime();
  const end = new Date(`${item.endDate}T23:59:59+09:00`).getTime();
  return end < today;
}
