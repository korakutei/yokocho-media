import type { Metadata } from "next";
import { getYokochoDirectory } from "@/lib/data";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "全国横丁ディレクトリ — ヨコチョナビ",
  description:
    "旅×横丁。全国各地の横丁・屋台村・市場系飲食街を、地域ごとに一覧できるヨコチョナビの横丁ツーリズム・ディレクトリ。",
};

export default function TravelPage() {
  const directory = getYokochoDirectory();
  const totalCount = directory.regions.reduce(
    (sum, r) => sum + r.items.length,
    0
  );

  return (
    <>
      <section className="directory-index">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-num">Travel × Yokocho</p>
              <h2>全国横丁ディレクトリ</h2>
            </div>
            <p className="lede">
              横丁は「飲む場所」である前に、知らない誰かと隣り合わせで乾杯できる場所。旅先で横丁の扉を開けてみる——それ自体を、ひとつの旅のかたちにしたい。ヨコチョナビはその入口として、全国の横丁を地域ごとにまとめています。
            </p>
          </div>
          <p className="directory-meta">
            掲載横丁数：{totalCount}（{directory.updatedLabel}）／自治体・観光協会・運営公式等の一次情報を優先し、出典を明記しています。写真は未収集のため、カードから各出典・公式ページへ直接ご確認ください。
          </p>

          {directory.regions.map((region) => (
            <div className="directory-region" key={region.region}>
              <h3 className="directory-region-title">{region.region}</h3>
              <div className="directory-list">
                {region.items.map((item) => {
                  const inner = (
                    <>
                      <div className="directory-item-head">
                        <span className="directory-item-name">{item.name}</span>
                        <span className="directory-item-rank">{item.rank}</span>
                      </div>
                      <span className="directory-item-area">
                        {item.pref}・{item.area}／{item.genre}
                      </span>
                      <p className="directory-item-feature">{item.feature}</p>
                    </>
                  );
                  return item.url ? (
                    <a
                      className="directory-item"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={item.name}
                    >
                      {inner}
                      <span className="directory-item-link">出典を見る ↗</span>
                    </a>
                  ) : (
                    <div className="directory-item directory-item-disabled" key={item.name}>
                      {inner}
                      <span className="directory-item-link directory-item-link-soon">
                        出典確認中
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <p className="directory-note">
            本ディレクトリは、公開情報をもとにした一次調査の結果です。店舗数・営業状況は変動するため、実際にお出かけの際は各出典・公式サイトで最新情報をご確認ください。掲載を望まれない場合や、情報の誤りに気づかれた場合はお申し出ください。
          </p>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
