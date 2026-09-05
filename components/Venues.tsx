import Image from "next/image";
import Link from "next/link";
import { getYokochoDirectory } from "@/lib/data";
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
          <div className="venue-photo-empty">
            {venue.status === "research" ? "試験掲載" : "取材中"}
          </div>
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
        {!venue.slug && venue.url && (
          <span className="venue-link">公式サイトを見る →</span>
        )}
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

  if (venue.url) {
    return (
      <a
        className="venue"
        href={venue.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <div className="venue venue-disabled">{inner}</div>;
}

export default function Venues({ data }: { data: VenuesData }) {
  const licensedVenues = data.venues.filter((v) => v.status === "licensed");
  const researchVenues = data.venues.filter((v) => v.status === "research");
  const directoryCount = getYokochoDirectory().regions.reduce(
    (sum, r) => sum + r.items.length,
    0
  );

  return (
    <Reveal as="section" id="venues">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">03 / Venues</p>
            <h2>今夜、灯りをくぐれる横丁</h2>
          </div>
          <p className="lede">
            浜倉的商店製作所グループの横丁群に加え、全国各地の横丁も順次リサーチして掲載しています。カードから各横丁の詳細ページ、または公式サイトへ移動できます。
          </p>
        </div>
        <div className="venue-meta">
          <span>掲載横丁数：{data.venues.length}（プロトタイプ時点）</span>
          <span>うち掲載許諾済み：{licensedVenues.length} / 試験掲載：{researchVenues.length}</span>
        </div>
        <div className="venue-grid">
          {data.venues.map((venue) => (
            <VenueCard venue={venue} key={venue.name} />
          ))}
        </div>
        <p className="venue-note">
          {data.operator}の横丁群は、写真・ロゴを含め公式サイトより掲載許諾済みです（ピット・インのみ運営元サイト上で確認が取れていないため、確認が取れ次第反映します）。「試験掲載」表記の横丁は、運営者への掲載許諾取得前に公開情報をもとに試験的に掲載しているものです。写真は未掲載、内容の正確性は今後の確認・許諾取得に伴い更新されます。掲載を望まれない場合はお申し出ください。
        </p>
        <Link className="venue-directory-link" href="/travel">
          旅先の横丁を探すなら——全国{directoryCount}横丁のディレクトリを見る →
        </Link>
      </div>
    </Reveal>
  );
}
