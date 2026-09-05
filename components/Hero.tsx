import Image from "next/image";
import JapanMap from "./JapanMap";

type HeroProps = {
  digestCount: number;
  venueCount: number;
  updatedAt: string; // "2026.09.04" 形式で渡す
};

export default function Hero({ digestCount, venueCount, updatedAt }: HeroProps) {
  return (
    <header className="hero">
      <div className="hero-photo">
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
        </div>

        <div className="wrap hero-photo-copy">
          <p className="hero-copy">
            今夜、どの横丁の灯りをくぐろう。<strong>全国の横丁の「今」</strong>
            を毎朝更新——迷ったら、ここから探せばいい。
          </p>
        </div>
      </div>

      <div className="hero-map-band">
        <p className="hero-map-caption">
          <strong>全国各地に、</strong>横丁の灯りがある。
        </p>
        <p className="hero-map-lede">
          路地の先に、人がいて、味があって、物語がある。日本のどこかで、きっとまた。
        </p>

        <div className="hero-map-scene">
          <div className="hero-map-panel hero-map-panel-left" aria-hidden="true">
            <Image
              src="/images/connect/panel-left.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 30vw, 220px"
            />
            <span className="hero-map-panel-caption">
              あの街の、あの横丁で。
              <br />
              また、乾杯しよう。
            </span>
          </div>

          <JapanMap />

          <div className="hero-map-panel hero-map-panel-right" aria-hidden="true">
            <Image
              src="/images/connect/panel-right.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 30vw, 220px"
            />
            <span className="hero-map-panel-caption">
              知らない街で、
              <br />
              好きな横丁ができる。
            </span>
          </div>
        </div>

        <div className="hero-map-banner" aria-hidden="true">
          <Image
            src="/images/connect/panel-bottom.jpg"
            alt=""
            fill
            sizes="100vw"
          />
          <span className="hero-map-banner-caption">
            横丁は、いつも旅のそばにある。
          </span>
        </div>

        <div className="wrap hero-bottom">
          <a className="hero-cta" href="#venues">
            今夜行ける横丁を探す →
          </a>
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
      </div>

      <p className="scroll-cue">SCROLL — 横丁へ</p>
    </header>
  );
}
