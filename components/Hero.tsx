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
        <p className="eyebrow">Yokocho Media Prototype</p>
        <h1 className="wordmark">
          横丁メディア
          <span className="wordmark-en">YOKOCHO MEDIA</span>
        </h1>
        <p className="hero-copy">
          今夜、どこの横丁が賑わっているか。<strong>日本全国の横丁の今</strong>
          を毎日拾い集め、記録し、伝えていくためのメディア・プロトタイプです。
        </p>
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
