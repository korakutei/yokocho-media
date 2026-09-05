import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import type { Venue, VenuesData } from "@/lib/types";

function VenueCard({ venue }: { venue: Venue }) {
  const inner = (
    <>
      <div className="venue-photo">
        {venue.photo ? (
          <Image
            src={venue.photo}
            alt={`${venue.name}の店内・通りの様子`}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="venue-photo-empty">取材中</div>
        )}
        {venue.logo && (
          <span className="venue-mark">
            <Image
              src={venue.logo}
              alt={`${venue.name} 公式ロゴ`}
              width={600}
              height={135}
              loading="lazy"
            />
          </span>
        )}
      </div>
      <div className="venue-body">
        <p className="venue-name">{venue.name}</p>
        <span className="venue-area">{venue.area}</span>
        {venue.slug && <span className="venue-link">詳しく見る →</span>}
      </div>
    </>
  );

  if (venue.slug) {
    return (
      <Link className="venue" href={`/venues/${venue.slug}`}>
        {inner}
      </Link>
    );
  }

  return <div className="venue venue-disabled">{inner}</div>;
}

export default function Venues({ data }: { data: VenuesData }) {
  return (
    <Reveal as="section" id="venues">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">03 / Venues</p>
            <h2>プロトタイプ掲載対象の横丁</h2>
          </div>
          <p className="lede">
            まずは浜倉的商店製作所グループの横丁群から掲載を開始する方針です。カードから各横丁の詳細ページへ移動できます。
          </p>
        </div>
        <div className="venue-meta">
          <span>運営：{data.operator}</span>
          <span>掲載横丁数：{data.venues.length}（プロトタイプ時点）</span>
        </div>
        <div className="venue-grid">
          {data.venues.map((venue) => (
            <VenueCard venue={venue} key={venue.name} />
          ))}
        </div>
        <p className="venue-note">
          写真・ロゴは浜倉的商店製作所グループ公式サイトより掲載許諾済み。ピット・インのみ運営元サイト上で確認が取れていないため、確認が取れ次第反映します。
        </p>
      </div>
    </Reveal>
  );
}
