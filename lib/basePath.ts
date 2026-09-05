/**
 * GitHub Pages (https://<user>.github.io/yokocho-media/) はサブパス配信のため、
 * next.config.js の basePath 設定と合わせて、静的な画像パス文字列にも
 * 手動でプレフィックスを付ける必要がある(next/imageのunoptimizedローダーや
 * CSSのurl()はbasePathを自動付与しないため)。
 * GITHUB_PAGES=true のビルド時のみプレフィックスを付与し、
 * ローカル開発・Vercel配信では何もしない。
 */
export const BASE_PATH = process.env.GITHUB_PAGES === "true" ? "/yokocho-media" : "";

export function withBase(path: string): string {
  return `${BASE_PATH}${path}`;
}
