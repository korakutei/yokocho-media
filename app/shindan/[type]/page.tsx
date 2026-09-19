import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import ShindanResult from "@/components/shindan/ShindanResult";
import { getVenues } from "@/lib/data";
import {
  SHINDAN_TYPES,
  getShindanType,
  matchVenues,
  shindanCandidates,
} from "@/lib/shindan";
import { SHARE_IMAGE } from "@/lib/share";

// 診断結果のシェア先。タイプごとに静的ページを書き出す(output: "export")。
export function generateStaticParams() {
  return SHINDAN_TYPES.map((t) => ({ type: t.id }));
}

export function generateMetadata({
  params,
}: {
  params: { type: string };
}): Metadata {
  const type = getShindanType(params.type);
  if (!type) return {};
  const title = `${type.name} — ヨコチョ診断｜ヨコチョナビ`;
  return {
    title,
    description: `${type.catch}${type.description}`,
    // openGraphは親(layout)と丸ごと差し替わるため、共有用画像もここで指定し直す
    openGraph: {
      title,
      description: type.catch,
      locale: "ja_JP",
      type: "website",
      images: [SHARE_IMAGE],
    },
  };
}

export default function ShindanTypePage({ params }: { params: { type: string } }) {
  const type = getShindanType(params.type);
  if (!type) notFound();

  const matches = matchVenues(type, shindanCandidates(getVenues().venues));

  return (
    <>
      <section className="shindan">
        <div className="wrap">
          <ShindanResult
            type={type}
            matches={matches}
            kicker="ヨコチョ診断 — 横丁タイプ"
            actions={
              <Link href="/shindan" className="hero-cta">
                あなたも診断してみる →
              </Link>
            }
          />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
