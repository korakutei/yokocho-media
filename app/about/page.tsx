import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "ヨコチョナビとは — ヨコチョナビ",
  description:
    "ヨコチョナビの想い・運営方針・掲載情報について。安心してご利用いただくためのご案内です。",
};

export default function AboutPage() {
  return (
    <>
      <section>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-num">About</p>
              <h2>ヨコチョナビとは</h2>
            </div>
          </div>
          <div className="article-prose">
            <p>
              横丁は、路地の奥に暖簾をくぐった人だけが出会える、小さな縁と物語の宝庫です。けれど日々どこで何が起きているかは、なかなか外に届きません。ヨコチョナビは、そんな横丁の「今日のにぎわい」と「積み重ねてきた物語」を丁寧にすくい上げ、迷わず・安心して横丁に飛び込めるようにするための案内所です。公になっている情報をもとに要約・出典明記でお届けし、掲載店・横丁の想いを損なわない形でご紹介することを大切にしています。
            </p>
          </div>
        </div>
      </section>
      <section className="raised">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-num">Policy</p>
              <h2>運営方針・掲載について</h2>
            </div>
          </div>
          <div className="article-prose">
            <p>
              ヨコチョナビは特定の運営会社の広報物ではなく、独立して横丁文化を紹介し、各横丁への入口となることを目指すメディアです。現在は浜倉的商店製作所グループの許諾を得て先行掲載していますが、今後は他の横丁運営者への掲載も広げていく方針です。
            </p>
            <p>掲載情報は公開情報の集約であり、出典を明示しています。</p>
            <p>デザイン方向性：黒×白×金、和と新。</p>
            <p>
              掲載横丁一覧の写真とロゴは浜倉的商店製作所グループから掲載許諾済みの公式素材です。Hero・「読む・探す・つながる」・日本地図イラストの写真は、実在の横丁や正確な店舗所在地を示すものではない汎用イメージカットです。
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
