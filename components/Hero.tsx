type HeroProps = {
  digestCount: number;
  venueCount: number;
  updatedAt: string; // "2026.09.04" 形式で渡す
};

export default function Hero({ digestCount, venueCount, updatedAt }: HeroProps) {
  return (
    <header className="hero">
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
      <div className="wrap">
        <p className="eyebrow">Yokocho Navi Prototype</p>
        <h1 className="wordmark">
          ヨコチョナビ
          <span className="wordmark-en">YOKOCHO NAVI</span>
        </h1>
        <p className="hero-copy">
          今夜、どの横丁の灯りをくぐろう。<strong>全国の横丁の「今」</strong>
          を毎朝更新——迷ったら、ここから探せばいい。
        </p>
        <a className="hero-cta" href="#venues">
          今夜行ける横丁を探す →
        </a>
        <div className="hero-meta">
          <div>
            <b>{digestCount}</b>本日の収集記事
          </div>
          <div>
            <b>{venueCount}</b>プロトタイプ対象横丁
          </div>
          <div>
            <b>{updatedAt}</b>最終更新
          </div>
        </div>
      </div>
      <p className="scroll-cue">SCROLL — 横丁へ</p>
    </header>
  );
}
