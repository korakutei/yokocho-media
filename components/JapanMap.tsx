import Image from "next/image";
import { withBase } from "@/lib/basePath";

/**
 * 日本地図イラスト(Heroの雰囲気演出用)。
 *
 * 2026-09-06、SVGでの自作トレース+ピン座標較正から、デザイン提供の
 * イラスト画像(`public/images/japan-map-illustration.png`)に差し替えた。
 * 座標計算によるピン位置のズレ(実際の陸地形状との不一致)を根本的に
 * 解消するため、あらかじめ正しい位置に光の点が配置された画像をそのまま
 * 採用する方針に変更している。元画像の見出しテキスト部分は除去済み。
 * 背景色は元画像の時点でサイトの --bg (#17130f) とほぼ同一のため、
 * 追加のマスク処理なしで自然に馴染む。
 *
 * ピンはイメージ演出であり、正確な店舗所在地を示す機能地図ではない
 * (実際の掲載横丁一覧は #venues セクション参照)。
 */
export default function JapanMap() {
  return (
    <Image
      className="japan-map"
      src={withBase("/images/japan-map-illustration.png")}
      alt="日本地図に、札幌から沖縄まで全国各地の横丁の賑わいを示す光の点が散らばっているイラスト"
      width={1122}
      height={1152}
      sizes="(max-width: 760px) 90vw, 400px"
    />
  );
}
