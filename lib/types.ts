export type DigestItem = {
  id: string;
  /** 表示用の短い日付ラベル（例: "09.01"）。開催中イベント等は "開催中" のような文字列も許容。 */
  date: string;
  /** タグ表示テキスト。例: イベント／新施設／新規開業／運営元 など。自由記述だが既存タグとの表記ゆれに注意。 */
  tag: string;
  /** true の場合、タグを「朱色（ember）」の強調表示にする。 */
  isNew: boolean;
  title: string;
  desc: string;
  /** 確信度の注記（高い場合は null にして非表示でよい）。例: "中（〜という留保点がある）" */
  confidence: string | null;
  sourceUrl: string;
  sourceName: string;
};

export type DigestData = {
  updatedAt: string;
  updatedLabel: string;
  items: DigestItem[];
};

export type Venue = {
  name: string;
  area: string;
};

export type VenuesData = {
  operator: string;
  venues: Venue[];
};
