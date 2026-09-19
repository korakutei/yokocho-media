import { withBase } from "./basePath";

/** 公開サイトのオリジン(GitHub Pages)。og:image は絶対URLで書く必要があるため。 */
export const SITE_ORIGIN = "https://korakutei.github.io";

/**
 * 共有用画像(og:image)。PCのファビコン(app/icon.png)と同じ、アイボリー地の提灯アイコン。
 * 未指定だと、iPhoneの共有シートなどがページ内の画像(日本地図イラスト)を勝手に代わりに使ってしまう。
 */
export const SHARE_IMAGE = {
  url: `${SITE_ORIGIN}${withBase("/images/brand/share-icon.png")}`,
  width: 600,
  height: 600,
  alt: "ヨコチョナビ",
};
