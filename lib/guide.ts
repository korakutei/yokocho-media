/**
 * ヨコチョナビの案内人キャラクター(ヨコチョIP、2026-09-19追加)。
 *
 * サイトの世界観(黒×金、和と新)は崩さず、ヨコチョ診断・迷子(404)・保存リストなど
 * 「道先案内」が役立つ場面にだけ登場させる。Hero・ヘッダー・ニュース等には出さない。
 *
 * 画像は原画(`横丁メディア/ヨコチョIP/*.png`、背景透過)を元配色のまま、
 * ロゴと同じくアイボリー(--ivory)の縁取りを付けて濃色の地でも埋もれないようにしたもの。
 */

export const GUIDE_NAME = "ヨコチョ";

export type GuidePose = "wave" | "welcome" | "walk" | "back";

export const GUIDE_POSES: Record<GuidePose, { src: string; width: number; height: number }> = {
  /** 正面・片手を挙げてあいさつ */
  wave: { src: "/images/guide/guide-wave.webp", width: 426, height: 542 },
  /** 正面・両手を広げて「ようこそ」 */
  welcome: { src: "/images/guide/guide-welcome.webp", width: 486, height: 534 },
  /** 横向き・歩いて先導する */
  walk: { src: "/images/guide/guide-walk.webp", width: 438, height: 535 },
  /** 後ろ姿・路地の奥へ連れて行く */
  back: { src: "/images/guide/guide-back.webp", width: 387, height: 534 },
};

/** 案内人が横丁を歩く10秒のムービー(縦長720×1280・音声あり)。ヨコチョ診断の入口で使う。 */
export const GUIDE_MOVIE = "/videos/yokocho-guide.mp4";
