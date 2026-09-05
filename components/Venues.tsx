import Image from "next/image";
import Reveal from "./Reveal";
import type { VenuesData } from "@/lib/types";

export default function Venues({ data }: { data: VenuesData }) {
  return (
    <Reveal as="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">03 / Venues</p>
            <h2>プロトタイプ掲載対象の横丁</h2>
          </div>
          <p className="lede">
            まずは浜倉的商店製作所グループの横丁群から掲載を開始する方針です。
          </p>
        </div>
        <div className="venue-meta">
          <span>運営：{data.operator}</span>
          <span>掲載横丁数：{data.venues.length}（プロトタイプ時点）</span>
        </div>
        <div className="venue-grid">
          {data.venues.map((venue) => (
            <div className="venue" key={venue.name}>
              {venue.logo ? (
                <div className="venue-mark">
                  <Image
                    src={venue.logo}
                    alt={`${venue.name} 公式ロゴ`}
                    width={600}
                    height={135}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="venue-mark venue-mark-empty">取材中</div>
              )}
              <p className="venue-name">{venue.name}</p>
              <span className="venue-area">{venue.area}</span>
            </div>
          ))}
        </div>
        <p className="venue-note">
          ロゴは浜倉的商店製作所グループ公式サイトより掲載許諾済み。ピット・インのみ運営元サイト上で確認が取れていないため、確認が取れ次第反映します。
        </p>
      </div>
    </Reveal>
  );
}
