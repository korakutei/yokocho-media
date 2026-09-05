import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLinkableVenues, getVenueBySlug } from "@/lib/data";
import { withBase } from "@/lib/basePath";
import SiteFooter from "@/components/SiteFooter";

export function generateStaticParams() {
  return getLinkableVenues().map((venue) => ({ slug: venue.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const venue = getVenueBySlug(params.slug);
  if (!venue) return {};
  return {
    title: `${venue.name} — ヨコチョナビ`,
    description: `${venue.name}(${venue.area})の写真・アクセス情報。ヨコチョナビが伝える横丁の「今」。`,
  };
}

export default function VenuePage({ params }: { params: { slug: string } }) {
  const venue = getVenueBySlug(params.slug);
  if (!venue || !venue.photo) notFound();

  return (
    <>
      <article>
        <header className="venue-detail-hero">
          <Image
            src={withBase(venue.photo)}
            alt={`${venue.name}の様子`}
            fill
            sizes="100vw"
            priority
          />
          <div className="wrap venue-detail-hero-content">
            <Link href="/#venues" className="venue-detail-back">
              ← 横丁一覧に戻る
            </Link>
            {venue.logo && (
              <span className="venue-mark venue-detail-mark">
                <Image
                  src={withBase(venue.logo)}
                  alt={`${venue.name} 公式ロゴ`}
                  width={600}
                  height={135}
                />
              </span>
            )}
            <h1 className="venue-detail-name">{venue.name}</h1>
            <span className="venue-detail-area">{venue.area}</span>
          </div>
        </header>

        <div className="wrap venue-detail-body">
          <div className="venue-detail-meta">
            <span>運営：{`株式会社浜倉的商店製作所グループ`}</span>
          </div>

          {venue.url && (
            <a
              className="hero-cta venue-detail-cta"
              href={venue.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              公式サイトで営業時間・アクセスを見る ↗
            </a>
          )}

          {venue.gallery.length > 0 && (
            <div className="venue-detail-gallery">
              {venue.gallery.map((src) => (
                <div className="venue-detail-gallery-item" key={src}>
                  <Image
                    src={withBase(src)}
                    alt={`${venue.name}の店内・通りの様子`}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}

          <p className="venue-detail-note">
            写真・ロゴは浜倉的商店製作所グループ公式サイトより掲載許諾済みです。営業時間・料金等の最新情報は公式サイトでご確認ください。
          </p>
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
