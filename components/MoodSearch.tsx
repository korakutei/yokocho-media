import Reveal from "./Reveal";
import { withBase } from "@/lib/basePath";
import type { VenuesData } from "@/lib/types";

// `?tag=`/`?geo=`はこのページ自身(`/`)への遷移で、VenueExplorer側の
// マウント時useEffectで拾う設計のため、next/link(同一ルート内のソフトナビゲーション)
// ではなく通常の<a>タグで実際のページ遷移を発生させる(Hero.tsxの現在地ボタンと同じ理由)。
export default function MoodSearch({ data }: { data: VenuesData }) {
  const tags = Array.from(
    new Set(data.venues.flatMap((v) => v.tags ?? []))
  );

  return (
    <Reveal as="section" className="mood-search">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">02 / Mood</p>
            <h2>今夜どんな気分?</h2>
          </div>
          <p className="lede">
            気分やシーンから、行き先のヒントを見つける。現在地からもすぐ探せます。
          </p>
        </div>
        <div className="mood-tags">
          {tags.map((tag) => (
            <a
              key={tag}
              className="mood-tag"
              href={`${withBase("/")}?tag=${encodeURIComponent(tag)}#venues`}
            >
              {tag}
            </a>
          ))}
        </div>
        <div className="mood-actions">
          <a className="mood-action" href={`${withBase("/")}?geo=1#venues`}>
            📍 現在地から探す →
          </a>
          <a className="mood-action" href="#venues">
            すべての横丁を見る →
          </a>
        </div>
      </div>
    </Reveal>
  );
}
