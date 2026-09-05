import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles, getVenueBySlug } from "@/lib/data";
import { withBase } from "@/lib/basePath";
import SiteFooter from "@/components/SiteFooter";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} — ヨコチョナビ`,
    description: article.excerpt,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const relatedVenue = article.relatedVenueSlug
    ? getVenueBySlug(article.relatedVenueSlug)
    : undefined;

  return (
    <>
      <article>
        <header className="venue-detail-hero">
          <Image
            src={withBase(article.heroImage)}
            alt={article.title}
            fill
            sizes="100vw"
            priority
          />
          <div className="wrap venue-detail-hero-content">
            <Link href="/articles" className="venue-detail-back">
              ← 記事一覧に戻る
            </Link>
            <span className="article-date">{article.publishedLabel}</span>
            <h1 className="venue-detail-name article-title">
              {article.title}
            </h1>
          </div>
        </header>

        <div className="wrap venue-detail-body">
          <div className="article-prose">
            {article.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {relatedVenue && relatedVenue.slug && (
            <Link
              href={`/venues/${relatedVenue.slug}`}
              className="article-related"
            >
              <span className="article-related-label">
                この記事に登場する横丁
              </span>
              <span className="article-related-name">
                {relatedVenue.name} →
              </span>
            </Link>
          )}
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
