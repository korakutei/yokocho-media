import type { Metadata } from "next";
import SavedVenues from "@/components/SavedVenues";
import SiteFooter from "@/components/SiteFooter";
import { getVenues } from "@/lib/data";

export const metadata: Metadata = {
  title: "保存した横丁 — ヨコチョナビ",
  description: "「保存する」を押した横丁の一覧。保存内容はお使いの端末にだけ残ります。",
};

export default function SavedPage() {
  const venues = getVenues().venues;

  return (
    <>
      <section>
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="section-num">Saved</p>
              <h2>保存した横丁</h2>
            </div>
            <p className="lede">
              会員登録なしで使える保存リストです。保存内容はこの端末・このブラウザにだけ残ります。
            </p>
          </div>
          <SavedVenues venues={venues} />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
