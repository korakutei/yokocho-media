import Link from "next/link";
import Reveal from "./Reveal";
import JapanMap from "./JapanMap";
import { withBase } from "@/lib/basePath";
import { REGION_ANCHOR_IDS } from "@/lib/regions";

/**
 * 5つの地方ブロックのクリック領域。ピン単位の正確な緯度経度ではなく、
 * 地図イラスト上の大まかな地方エリア(パーセンテージ座標の矩形)を示す。
 * ピン単位の座標較正で繰り返しズレが生じた経緯(README参照)を踏まえ、
 * 多少の誤差を許容できる粒度に留めている。
 *
 * 掲載許諾済みの横丁(venues.json)は現状すべて関東のため、関東ブロックは
 * サイト内の横丁カード(#venues)へ、それ以外の地方は全国横丁ディレクトリ
 * (/travel)の該当地域アンカーへ遷移する。
 */
const REGION_HOTSPOTS: {
  label: string;
  href: string;
  style: { top: string; left: string; width: string; height: string };
}[] = [
  {
    label: "北海道・東北",
    href: `/travel#${REGION_ANCHOR_IDS["北海道・東北"]}`,
    style: { top: "2%", left: "50%", width: "47%", height: "46%" },
  },
  {
    label: "関東",
    href: "#venues",
    style: { top: "45%", left: "48%", width: "24%", height: "20%" },
  },
  {
    label: "中部",
    href: `/travel#${REGION_ANCHOR_IDS["中部"]}`,
    style: { top: "47%", left: "34%", width: "24%", height: "20%" },
  },
  {
    label: "関西・中国・四国",
    href: `/travel#${REGION_ANCHOR_IDS["関西・中国・四国"]}`,
    style: { top: "54%", left: "9%", width: "35%", height: "22%" },
  },
  {
    label: "九州・沖縄",
    href: `/travel#${REGION_ANCHOR_IDS["九州・沖縄"]}`,
    style: { top: "64%", left: "3%", width: "20%", height: "30%" },
  },
];

export default function MapSection() {
  return (
    <Reveal as="section" className="map-section raised">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">03 / Map</p>
            <h2>今夜の横丁を、地図から探す。</h2>
          </div>
          <p className="lede">地方をタップすると、その地域の横丁へ進めます。</p>
        </div>
        <div className="map-frame">
          <JapanMap />
          {REGION_HOTSPOTS.map((region) => (
            <Link
              key={region.label}
              className="map-hotspot"
              href={
                region.href.startsWith("#")
                  ? region.href
                  : withBase(region.href)
              }
              style={region.style}
            >
              <span className="map-hotspot-label">{region.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
