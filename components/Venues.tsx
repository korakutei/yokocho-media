import Link from "next/link";
import { getYokochoDirectory } from "@/lib/data";
import Reveal from "./Reveal";
import VenueExplorer from "./VenueExplorer";
import type { VenuesData } from "@/lib/types";

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
            浜倉的商店製作所グループの横丁群に加え、全国各地の横丁も順次リサーチして掲載しています。目的やタグ、現在地から絞り込んで、行き先を決めてみてください。
          </p>
        </div>
        <div className="venue-meta">
          <span>掲載横丁数：{data.venues.length}（プロトタイプ時点）</span>
          <span>うち掲載許諾済み：{licensedVenues.length} / 試験掲載：{researchVenues.length}</span>
        </div>
        <Link className="venue-directory-link" href="/travel">
          旅先の横丁を探すなら——全国{directoryCount}横丁のディレクトリを見る →
        </Link>

        <VenueExplorer venues={data.venues} />

        <p className="venue-note">
          {data.operator}の横丁群は、写真・ロゴを含め公式サイトより掲載許諾済みです（ピット・インのみ運営元サイト上で確認が取れていないため、確認が取れ次第反映します）。「試験掲載」表記の横丁は、運営者への掲載許諾取得前に公開情報をもとに試験的に掲載しているものです。写真は未掲載、内容の正確性は今後の確認・許諾取得に伴い更新されます。掲載を望まれない場合はお申し出ください。タグ・交流度等の評価は編集部による現地取材前の目安であり、確定情報ではありません。
        </p>
      </div>
    </Reveal>
  );
}
