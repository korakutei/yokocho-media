import { withBase } from "@/lib/basePath";

type HeroProps = {
  digestCount: number;
  venueCount: number;
  updatedAt: string; // "2026.09.04" 形式で渡す
};

export default function Hero({ digestCount, venueCount, updatedAt }: HeroProps) {
  return (
    <header className="hero">
      <div
        className="hero-photo"
        style={{
          ["--hero-bg-image" as string]: `url(${withBase("/images/hero-cover.jpg")})`,
        }}
      >
        <div className="lantern-row" aria-hidden="true">
          <span className="lantern"></span>
          <span className="lantern"></span>
          <span className="lantern"></span>
          <span className="lantern"></span>
        </div>
        <div className="embers" aria-hidden="true">
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
          <span className="ember"></span>
        </div>
        <span className="hero-photo-tag">イメージ</span>

        <div className="wrap hero-top-mini">
          <p className="eyebrow">Yokocho Navi Prototype</p>
          <h1 className="wordmark">
            ヨコチョナビ
            <span className="wordmark-en">YOKOCHO NAVI</span>
          </h1>
          <p className="hero-copy">今夜、知らない横丁へ。</p>
          <p className="hero-subcopy">
            全国の横丁を、地図から、人から、気分から。あなたの「今夜」を見つける横丁ガイド。
          </p>
          <div className="hero-cta-row">
            <a className="hero-cta" href="#venues">
              横丁を探す →
            </a>
            <a
              className="hero-cta hero-cta-secondary"
              href={`${withBase("/")}?geo=1#venues`}
            >
              📍 現在地から探す
            </a>
          </div>
        </div>
      </div>

      <div className="wrap hero-bottom">
        <div className="hero-stats">
          <div className="hero-stat">
            <b>{digestCount}</b>
            <span>本日の収集記事</span>
          </div>
          <div className="hero-stat">
            <b>{venueCount}</b>
            <span>掲載横丁数</span>
          </div>
          <div className="hero-stat">
            <b>{updatedAt}</b>
            <span>最終更新</span>
          </div>
        </div>
      </div>

      <p className="scroll-cue">SCROLL — 横丁へ</p>
    </header>
  );
}
