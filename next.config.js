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
};

module.exports = nextConfig;
