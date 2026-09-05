import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticles } from "@/lib/data";
import { withBase } from "@/lib/basePath";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "記事一覧 — ヨコチョナビ",
  description: "横丁の成り立ちや歩き方を伝える、ヨコチョナビの特集記事一覧。",
};

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <>
      <section className="article-index">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-num">Read / Articles</p>
              <h2>横丁を読む</h2>
            </div>
            <p className="lede">
              横丁の成り立ちや歩き方を、記事でじっくり伝える。
            </p>
          </div>
          <div className="article-grid">
            {articles.map((article) => (
              <Link
                className="article-card"
                href={`/articles/${article.slug}`}
                key={article.slug}
              >
                <div className="article-card-photo">
                  <Image
                    src={withBase(article.heroImage)}
                    alt={article.title}
                    fill
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                </div>
                <div className="article-card-body">
                  <span className="article-card-date">
                    {article.publishedLabel}
                  </span>
                  <h3 className="article-card-title">{article.title}</h3>
                  <p className="article-card-excerpt">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
