import Link from "next/link";
import Reveal from "./Reveal";
import { withBase } from "@/lib/basePath";
import type { VenuesData } from "@/lib/types";

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
            <Link
              key={tag}
              className="mood-tag"
              href={`${withBase("/")}?tag=${encodeURIComponent(tag)}#venues`}
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className="mood-actions">
          <Link className="mood-action" href={`${withBase("/")}?geo=1#venues`}>
            📍 現在地から探す →
          </Link>
          <Link className="mood-action" href="#venues">
            すべての横丁を見る →
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
