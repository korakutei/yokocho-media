import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ヨコチョナビ",
  description:
    "今夜行ける横丁を探す入口。全国の横丁の「今」を毎朝更新して届けるメディア・プロトタイプ（Next.js版）。",
  // 公開前のプロトタイプのため検索エンジンには乗せない。公開判断が出たら外すこと。
  robots: { index: false, follow: false },
  openGraph: {
    title: "ヨコチョナビ",
    description:
      "今夜行ける横丁を探す入口。全国の横丁の「今」を毎朝更新して届けるメディア・プロトタイプ。",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17130f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Big+Shoulders+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
