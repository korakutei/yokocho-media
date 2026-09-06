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
  /** 詳細ページ(/venues/[slug])用のURLスラッグ。未確認の横丁・詳細ページ未作成の横丁は null。 */
  slug: string | null;
  name: string;
  area: string;
  /** 公式サイト掲載の看板ロゴ画像パス。未確認・未許諾の横丁は null。 */
  logo: string | null;
  /** 公式サイト掲載の実店舗写真パス(代表カット)。未確認・未許諾の横丁は null。 */
  photo: string | null;
  /** 詳細ページのギャラリー用追加写真パス。0件のこともある。 */
  gallery: string[];
  /** 運営元公式サイトの当該横丁ページURL(licensedは浜倉的商店製作所グループ、researchは各運営者の公式サイト)。 */
  url: string | null;
  /**
   * licensed = 浜倉的商店製作所グループから掲載許諾済み。
   * research = 全国リサーチによる試験掲載(運営者への掲載許諾は未取得。公開情報の要約+出典リンクのみ)。
   */
  status: "licensed" | "research";
  /** research時の運営者名(表示用)。licensedはVenuesData.operatorを一括表示するためnullでよい。 */
  operatorName?: string | null;

  /**
   * 以下、2026-09-06追加。「探す・比較する・決める」強化のための項目。
   * 現地取材前の編集部による目安評価のため、licensed横丁のうちエリアが
   * 確定しているもの(=写真・エリアとも確認済み)にのみ付与している。
   * research横丁(未許諾・未確認)には現時点では付与しない。
   */

  /** 目的別タグ(利用シーン)。例: "一人飲み" "デート" "友人" "観光" "昭和レトロ" "地酒" "昼飲み"。 */
  tags?: string[];

  /** 編集部による定性評価(1〜5の目安値)。「交流度」はヨコチョナビ独自の差別化指標。 */
  specs?: {
    /** 一人飲み適性 */
    solo: number;
    /** 初心者向け度(入りやすさ) */
    beginner: number;
    /** 交流度(店主・他の客との交流のしやすさ、独自指標) */
    social: number;
    /** にぎやかさ */
    lively: number;
    /** ローカル感(地元客の多さ) */
    local: number;
    /** 価格帯目安("¥"〜"¥¥¥") */
    price: string;
    /** 滞在目安(例: "1〜2時間") */
    duration: string;
  };

  /** 編集部おすすめコメント(一言紹介)。 */
  editorComment?: string | null;

  /**
   * 営業時間(公式サイト等で確認できた場合のみ記載)。未確認はnullとし、
   * UI側は「公式サイトでご確認ください」という誠実な表示にフォールバックする
   * (裏取りできていない時間を表示して来店機会を損なわせないため)。
   */
  hours?: string | null;

  /** 現在地からの距離順ソート用の概算緯度・経度(エリア中心程度の精度)。未確認のエリアはnull。 */
  lat?: number | null;
  lng?: number | null;
};

export type VenuesData = {
  operator: string;
  venues: Venue[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  heroImage: string;
  /** 関連する横丁のslug(venues.jsonのslugと対応)。関連横丁がない場合はnull。 */
  relatedVenueSlug: string | null;
  publishedLabel: string;
  /** 段落ごとの本文。 */
  body: string[];
};

export type ArticlesData = {
  articles: Article[];
};

/** 全国横丁ディレクトリ(旅×横丁)の1件。写真なし・出典リンクのみの一覧用。 */
export type YokochoDirectoryEntry = {
  name: string;
  pref: string;
  area: string;
  genre: string;
  feature: string;
  /** 一次情報での信頼性区分(自由記述。例: "A・公式" "C・要再確認" 等)。 */
  rank: string;
  url: string | null;
};

export type YokochoDirectoryRegion = {
  region: string;
  items: YokochoDirectoryEntry[];
};

export type YokochoDirectoryData = {
  updatedLabel: string;
  regions: YokochoDirectoryRegion[];
};
