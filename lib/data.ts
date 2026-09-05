import digestJson from "@/data/digest.json";
import venuesJson from "@/data/venues.json";
import articlesJson from "@/data/articles.json";
import type { Article, ArticlesData, DigestData, Venue, VenuesData } from "./types";

// 現状はビルド時にバンドルされる静的JSONを読み込むだけのシンプルな実装。
// 将来、日次の自動収集ジョブ（scripts/update-digest.ts、または外部CMS/DB）から
// data/digest.json を書き換える運用に差し替えることを想定している。
export function getDigest(): DigestData {
  return digestJson as DigestData;
}

export function getVenues(): VenuesData {
  return venuesJson as VenuesData;
}

/** slugを持つ(=詳細ページが存在する)横丁のみを返す。 */
export function getLinkableVenues(): Venue[] {
  return getVenues().venues.filter(
    (v): v is Venue & { slug: string } => v.slug !== null
  );
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return getVenues().venues.find((v) => v.slug === slug);
}

export function getArticles(): Article[] {
  return (articlesJson as ArticlesData).articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}
