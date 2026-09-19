import type { Venue } from "./types";

/**
 * ヨコチョ診断(2026-09-19追加)。
 * 7つの質問から「横丁タイプ」(全6種)を判定し、venues.json の編集部スペック・タグと
 * 照らし合わせて相性のいい横丁を提案する。
 *
 * - タイプ判定: 各選択肢が持つ typePoints を合計し、最大のタイプを採用。
 *   同点の場合は TIE_BREAK_QUESTIONS の順に、その質問で選んだ選択肢の得点が高いタイプを優先する。
 * - 横丁の提案: タイプごとの好み(スペックの重み・タグ・価格帯)に、回答で選んだタグ(boostTag)を
 *   加点して並べる。スペック・タグは編集部の目安値なので、結果画面でもその旨を明記する。
 * - 横丁固有の事実(営業時間・名物等)はここに書かない。venues.json にある情報だけを表示に使う。
 */

export type ShindanTypeId =
  | "tomarigi"
  | "hashigo"
  | "showa"
  | "koraku"
  | "neon"
  | "hajimete";

type SpecKey = "solo" | "beginner" | "social" | "lively" | "local";

export const SPEC_LABELS: Record<SpecKey, string> = {
  solo: "一人飲み適性",
  beginner: "初心者向け",
  social: "交流度",
  lively: "にぎやかさ",
  local: "ローカル感",
};

export type ShindanType = {
  id: ShindanTypeId;
  name: string;
  /** 欧文ラベル(Big Shoulders Displayで表示)。 */
  en: string;
  /** 紋(円の中に入れる一文字)。 */
  mon: string;
  catch: string;
  description: string;
  /** このタイプ向けの横丁の歩き方。特定の横丁についての事実は書かない。 */
  tips: string[];
  /** 一緒に横丁へ行くと楽しいタイプ。 */
  partner: { id: ShindanTypeId; reason: string };
  /** 横丁の提案に使う好み。スペック(1〜5)は3を基準に重み付けする。 */
  prefs: {
    weights: Partial<Record<SpecKey, number>>;
    tags: string[];
    prices: string[];
  };
};

export const SHINDAN_TYPES: ShindanType[] = [
  {
    id: "tomarigi",
    name: "止まり木のひとり呑み",
    en: "Tomarigi — Solo Counter",
    mon: "止",
    catch: "カウンターの端が、今夜の指定席。",
    description:
      "誰に気をつかうでもなく、ひとりで暖簾をくぐり、自分のペースで杯を重ねる。店主とぽつりぽつり言葉を交わすくらいの距離感が心地いい人。横丁の“素顔”がいちばんよく見えるのは、実はひとり客の席かもしれません。",
    tips: [
      "混み合う前の早い時間に入ると、カウンターの一席が見つかりやすい。",
      "まずは一杯と一品から。長居せず、気に入ったらまた来るのが止まり木流。",
      "店主におすすめを一つ聞いてみると、ほどよい会話のきっかけになる。",
    ],
    partner: {
      id: "showa",
      reason: "静かに飲みたい夜と、レトロな路地の相性は抜群。",
    },
    prefs: {
      weights: { solo: 2, local: 1, lively: -1 },
      tags: ["一人飲み", "地元民御用達"],
      prices: ["¥", "¥¥"],
    },
  },
  {
    id: "hashigo",
    name: "はしご酒の冒険家",
    en: "Hashigo — Bar Hopper",
    mon: "梯",
    catch: "一軒じゃ、今夜は終われない。",
    description:
      "一杯飲んだら次の店へ。焼き鳥の次は餃子、その次は地酒——横丁を端から端まで味わい尽くしたい好奇心のかたまり。小さな店がひしめく横丁は、あなたにとって最高の遊び場です。",
    tips: [
      "一軒目は軽めに一杯・一品で。胃袋に余白を残すのが完走のコツ。",
      "外から覗いて、にぎわっている店を次の目印にしてみよう。",
      "仲間と来たら、店ごとに「おすすめを一品ずつ」頼んでシェアすると楽しい。",
    ],
    partner: {
      id: "koraku",
      reason: "はしごの行く先々で、知り合いを増やしてくれる頼もしい相棒。",
    },
    prefs: {
      weights: { lively: 1.5, social: 1, beginner: 0.5 },
      tags: ["友人", "観光"],
      prices: ["¥¥", "¥¥¥"],
    },
  },
  {
    id: "showa",
    name: "昭和レトロの探訪者",
    en: "Showa Retro Explorer",
    mon: "昭",
    catch: "赤ちょうちんとガード下に、心が躍る。",
    description:
      "煤けた看板、頭上を走る電車の音、気取らない一杯と一皿。時代が積み重ねてきた空気ごと味わいたい人。お財布にやさしく、昼からでも飲める——そんな横丁の“原風景”にこそ、あなたの今夜があります。",
    tips: [
      "昼飲みできる横丁なら、明るいうちに行くと路地の表情がよく見える。",
      "支払い方法は店ごとに違うことも。現金も少し用意しておくと安心。",
      "常連さんの席や流儀には一歩ゆずって。それが長く愛される横丁への礼儀。",
    ],
    partner: {
      id: "tomarigi",
      reason: "言葉少なに、同じ路地の空気を楽しめる飲み仲間。",
    },
    prefs: {
      weights: { local: 2, solo: 0.5, lively: -0.5 },
      tags: ["昭和レトロ", "せんべろ", "昼飲み", "地元民御用達"],
      prices: ["¥"],
    },
  },
  {
    id: "koraku",
    name: "交樂の申し子",
    en: "Koraku — Social Spirit",
    mon: "交",
    catch: "横丁へは、“人”に会いに行く。",
    description:
      "隣の席の人とグラスを合わせ、気づけば知らない誰かと笑い合っている——そんな偶然の出会いこそが横丁の醍醐味だと知っている人。「楽しい」が交わる場所を、誰よりも楽しめるタイプです。",
    tips: [
      "「それ、おいしそうですね」の一言から、会話が始まることも。",
      "相手のペースも大切に。盛り上がるほど、周りへの気配りを忘れずに。",
      "店主や常連さんに、この横丁でのおすすめの一軒を聞いてみよう。",
    ],
    partner: {
      id: "hashigo",
      reason: "次の店へ連れ出してくれる冒険家となら、出会いも倍になる。",
    },
    prefs: {
      weights: { social: 2.5, lively: 0.5, local: 0.5 },
      tags: ["友人", "地元民御用達"],
      prices: ["¥", "¥¥"],
    },
  },
  {
    id: "neon",
    name: "ネオン横丁の夜遊び人",
    en: "Neon Night Player",
    mon: "灯",
    catch: "音と光に包まれて、夜はこれから。",
    description:
      "懐かしさより、新しさにワクワクする。音楽や演出、フロアごとに変わる景色——エンタメとしての横丁を全力で楽しみたい人。夜が深まるほど、あなたのテンションも上がっていきます。",
    tips: [
      "大型の横丁はエリアごとに雰囲気が違う。まずは一周して、今夜の一軒を決めよう。",
      "盛り上がる時間帯は混みやすい。グループなら早めの集合が安心。",
      "終電の時間だけは最初に確認を。心おきなく楽しむための準備。",
    ],
    partner: {
      id: "hajimete",
      reason: "入りやすくにぎやかな横丁は、横丁デビューの案内役にぴったり。",
    },
    prefs: {
      weights: { lively: 2, beginner: 0.5, local: -0.5, solo: -0.5 },
      tags: ["NEO横丁"],
      prices: ["¥¥¥"],
    },
  },
  {
    id: "hajimete",
    name: "はじめての暖簾",
    en: "First Noren",
    mon: "初",
    catch: "今夜が、あなたの横丁デビュー。",
    description:
      "横丁は気になるけれど、ちょっと入りにくそう——そんな人こそ、横丁をいちばん新鮮に楽しめます。明るく入りやすい横丁から始めれば、暖簾の向こうは思っていたよりずっと温かい場所です。",
    tips: [
      "外から中の様子が見える店を選ぶと、ぐっと入りやすい。",
      "注文に迷ったら「おすすめは何ですか？」でOK。",
      "まずは1〜2時間の軽い気持ちで。気に入ったら、次は“はしご”に挑戦。",
    ],
    partner: {
      id: "koraku",
      reason: "隣の席と話すきっかけをつくってくれる、頼れる先輩。",
    },
    prefs: {
      weights: { beginner: 2.5, social: 0.5, local: -0.5 },
      tags: ["初心者歓迎", "デート"],
      prices: ["¥¥", "¥¥¥"],
    },
  },
];

export type ShindanOption = {
  label: string;
  typePoints: Partial<Record<ShindanTypeId, number>>;
  /** 横丁の提案時に加点するタグ(venues.jsonのtagsと同じ表記)。 */
  boostTag?: string;
};

export type ShindanQuestion = {
  text: string;
  options: ShindanOption[];
};

export const SHINDAN_QUESTIONS: ShindanQuestion[] = [
  {
    text: "今夜、誰と横丁へ行く？",
    options: [
      { label: "ひとりで、ふらっと", typePoints: { tomarigi: 3, showa: 1 }, boostTag: "一人飲み" },
      { label: "気心の知れた友人と", typePoints: { hashigo: 2, koraku: 2 }, boostTag: "友人" },
      { label: "恋人・気になる人と", typePoints: { hajimete: 2, neon: 2 }, boostTag: "デート" },
      { label: "旅先で、観光がてら", typePoints: { hashigo: 1, showa: 1, hajimete: 1 }, boostTag: "観光" },
    ],
  },
  {
    text: "横丁でいちばん楽しみなのは？",
    options: [
      { label: "旨い酒と肴を、じっくり", typePoints: { tomarigi: 2, showa: 1 }, boostTag: "地酒" },
      { label: "隣の席の人との会話", typePoints: { koraku: 3 } },
      { label: "いろんな店の食べ歩き・飲み歩き", typePoints: { hashigo: 3, hajimete: 1 } },
      { label: "音楽や演出、非日常の空間", typePoints: { neon: 3 } },
    ],
  },
  {
    text: "思わず惹かれる景色は？",
    options: [
      { label: "煤けた赤ちょうちんとガード下", typePoints: { showa: 3, tomarigi: 1 }, boostTag: "昭和レトロ" },
      { label: "ネオンがきらめく、新しい横丁", typePoints: { neon: 2, hajimete: 1 }, boostTag: "NEO横丁" },
      { label: "常連と店主が笑い合う、いつもの一軒", typePoints: { koraku: 2, tomarigi: 1 }, boostTag: "地元民御用達" },
      { label: "提灯がずらりと並ぶ、にぎやかな路地", typePoints: { hashigo: 2 } },
    ],
  },
  {
    text: "今夜の予算は？",
    options: [
      { label: "千円でほろ酔い（せんべろ）", typePoints: { showa: 3 }, boostTag: "せんべろ" },
      { label: "ほどほどに、3〜4千円くらい", typePoints: { tomarigi: 1, koraku: 1, hajimete: 1 } },
      { label: "今夜はちょっと奮発", typePoints: { neon: 2, hashigo: 1 } },
    ],
  },
  {
    text: "飲み始めたい時間は？",
    options: [
      { label: "明るいうちから（昼飲み）", typePoints: { showa: 2, tomarigi: 1 }, boostTag: "昼飲み" },
      { label: "仕事帰りに、さくっと", typePoints: { tomarigi: 2, showa: 1 } },
      { label: "夕飯どきから、ゆっくり", typePoints: { hajimete: 2, koraku: 1 } },
      { label: "夜が更けるまで、とことん", typePoints: { neon: 2, hashigo: 2 } },
    ],
  },
  {
    text: "隣の知らない人に話しかけられたら？",
    options: [
      { label: "大歓迎。そのまま乾杯！", typePoints: { koraku: 3, hashigo: 1 } },
      { label: "様子を見つつ、少しなら", typePoints: { hajimete: 2, hashigo: 1, showa: 1 } },
      { label: "そっと自分の時間を楽しみたい", typePoints: { tomarigi: 2, neon: 1 } },
    ],
  },
  {
    text: "これまでの横丁経験は？",
    options: [
      { label: "ほとんど初めて", typePoints: { hajimete: 3 }, boostTag: "初心者歓迎" },
      { label: "何度か行ったことがある", typePoints: { hashigo: 1, neon: 1, koraku: 1 } },
      { label: "行きつけの横丁がある", typePoints: { tomarigi: 1, showa: 1, koraku: 1 } },
    ],
  },
];

/** 同点時に参照する質問の順(「いちばん楽しみなのは？」→「誰と？」→「話しかけられたら？」)。 */
const TIE_BREAK_QUESTIONS = [1, 0, 5];

export function getShindanType(id: string): ShindanType | undefined {
  return SHINDAN_TYPES.find((t) => t.id === id);
}

/** answers[i] = i問目で選んだ選択肢のindex。 */
export function judgeType(answers: number[]): ShindanTypeId {
  const totals = new Map<ShindanTypeId, number>(
    SHINDAN_TYPES.map((t) => [t.id, 0])
  );
  answers.forEach((optionIndex, q) => {
    const points = SHINDAN_QUESTIONS[q]?.options[optionIndex]?.typePoints ?? {};
    for (const [id, pt] of Object.entries(points)) {
      totals.set(id as ShindanTypeId, (totals.get(id as ShindanTypeId) ?? 0) + pt);
    }
  });

  const max = Math.max(...Array.from(totals.values()));
  let candidates = SHINDAN_TYPES.map((t) => t.id).filter(
    (id) => totals.get(id) === max
  );
  for (const q of TIE_BREAK_QUESTIONS) {
    if (candidates.length <= 1) break;
    const points = SHINDAN_QUESTIONS[q]?.options[answers[q]]?.typePoints ?? {};
    const best = Math.max(...candidates.map((id) => points[id] ?? 0));
    candidates = candidates.filter((id) => (points[id] ?? 0) === best);
  }
  return candidates[0];
}

/** 回答で選んだタグ(横丁提案の加点用)。重複は除く。 */
export function boostTagsFromAnswers(answers: number[]): string[] {
  const tags = answers
    .map((optionIndex, q) => SHINDAN_QUESTIONS[q]?.options[optionIndex]?.boostTag)
    .filter((tag): tag is string => Boolean(tag));
  return Array.from(new Set(tags));
}

export type ShindanVenue = Venue & {
  slug: string;
  photo: string;
  specs: NonNullable<Venue["specs"]>;
};

export type ShindanMatch = {
  venue: ShindanVenue;
  /** 表示用: このタイプ・回答と一致したタグ。 */
  matchedTags: string[];
  /** 表示用: このタイプが重視するスペックのうち、横丁側の評価が高いもの。 */
  highlight: { label: string; value: number } | null;
};

/** 診断の提案対象になる横丁(詳細ページ・写真・編集部スペックがそろっているもの)。 */
export function shindanCandidates(venues: Venue[]): ShindanVenue[] {
  return venues.filter(
    (v): v is ShindanVenue => v.slug !== null && v.photo !== null && v.specs !== undefined
  );
}

export function matchVenues(
  type: ShindanType,
  venues: ShindanVenue[],
  boostTags: string[] = [],
  limit = 3
): ShindanMatch[] {
  const { weights, tags, prices } = type.prefs;

  const scored = venues.map((venue) => {
    const venueTags = venue.tags ?? [];
    let score = 0;
    for (const [key, w] of Object.entries(weights) as [SpecKey, number][]) {
      score += w * (venue.specs[key] - 3);
    }
    const typeTagHits = tags.filter((t) => venueTags.includes(t));
    const boostHits = boostTags.filter((t) => venueTags.includes(t));
    score += typeTagHits.length * 2;
    score += boostHits.length * 1.5;
    if (prices.includes(venue.specs.price)) score += 1.5;

    const matchedTags = Array.from(new Set([...typeTagHits, ...boostHits]));

    // 重みが最大のスペックで、横丁側が4以上ならハイライトとして見せる
    const topKey = (Object.entries(weights) as [SpecKey, number][])
      .filter(([, w]) => w > 0)
      .sort((a, b) => b[1] - a[1])[0]?.[0];
    const highlight =
      topKey && venue.specs[topKey] >= 4
        ? { label: SPEC_LABELS[topKey], value: venue.specs[topKey] }
        : null;

    return { venue, score, matchedTags, highlight };
  });

  return scored
    .sort(
      (a, b) =>
        b.score - a.score || b.matchedTags.length - a.matchedTags.length
    )
    .slice(0, limit)
    .map(({ venue, matchedTags, highlight }) => ({ venue, matchedTags, highlight }));
}
