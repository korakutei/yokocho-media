import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import GuideSays from "@/components/guide/GuideSays";
import { withBase } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "ページが見つかりません — ヨコチョナビ",
};

/** 存在しないURL(静的書き出しでは404.html)。迷子になった人を案内人ヨコチョが連れ戻す。 */
export default function NotFound() {
  return (
    <>
      <section className="notfound">
        <div className="wrap">
          <div className="notfound-inner">
            <p className="notfound-code">404 — Not Found</p>
            <h1 className="notfound-title">
              <span>路地の奥で、</span>
              <span>迷ってしまったようです。</span>
            </h1>
            <GuideSays pose="welcome" className="guide-center">
              あれれ、この先は行き止まりみたい。こっちこっち！ ぼくが横丁の入口まで連れて行くね。
            </GuideSays>
            <div className="hero-cta-row notfound-actions">
              {/* 迷子の先から先頭で開き直せるよう、トップは通常の<a>で遷移する */}
              <a href={withBase("/")} className="hero-cta">
                トップに戻る
              </a>
              <Link href="/shindan" className="hero-cta hero-cta-secondary">
                ヨコチョ診断で探す
              </Link>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
