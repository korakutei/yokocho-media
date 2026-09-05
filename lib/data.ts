import digestJson from "@/data/digest.json";
import venuesJson from "@/data/venues.json";
import type { DigestData, VenuesData } from "./types";

// 現状はビルド時にバンドルされる静的JSONを読み込むだけのシンプルな実装。
// 将来、日次の自動収集ジョブ（scripts/update-digest.ts、または外部CMS/DB）から
// data/digest.json を書き換える運用に差し替えることを想定している。
export function getDigest(): DigestData {
  return digestJson as DigestData;
}

export function getVenues(): VenuesData {
  return venuesJson as VenuesData;
}
