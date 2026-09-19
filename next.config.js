/** @type {import('next').NextConfig} */
// GitHub Pages(https://<user>.github.io/yokocho-media/)はサブパス配信のため、
// GITHUB_PAGES=true のときだけ basePath を付与する(ローカル開発・Vercel配信には影響しない)。
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/yokocho-media" : "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // lib/basePath.ts の withBase() は process.env.GITHUB_PAGES を参照するが、
  // NEXT_PUBLIC_ 以外の環境変数はブラウザ側のバンドルに埋め込まれない。そのままだと
  // クライアントコンポーネントで描画し直した画像パス等からbasePathが抜けて404になるため、
  // ビルド時の値をクライアント側にも明示的に埋め込む。
  env: { GITHUB_PAGES: isGithubPages ? "true" : "" },
};

module.exports = nextConfig;
