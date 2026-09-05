import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

const pillars = [
  {
    jp: "読む",
    en: "Read — Articles & Features",
    body: "恵比寿横丁の成り立ち、渋谷横丁の今——横丁ごとの記事で背景まで届ける。",
    photo: "/images/pillar-read.jpg",
    alt: "取材ノートを片手に店主へ話を聞くライターとカメラマンの様子を伝えるイメージカット",
    href: "/articles",
    linkLabel: "記事を読む →",
  },
  {
    jp: "探す・行く",
    en: "Find — Map Search",
    body: "気になる横丁を写真とアクセス情報から探す。地図表示は今後追加予定。",
    photo: "/images/pillar-find.jpg",
    alt: "店先のメニューを覗き込み今夜行く店を選ぶ旅行者たちの様子を伝えるイメージカット",
    href: "/#venues",
    linkLabel: "横丁を探す →",
  },
  {
    jp: "つながる",
    en: "Connect — Community",
    body: "常連、店主、旅行者。横丁で生まれる縁をSNS・メール配信でゆるくつなぎ続ける——現在準備中。",
    photo: "/images/pillar-connect.jpg",
    alt: "常連客と店主がグラスを掲げて乾杯する様子を伝えるイメージカット",
    href: null,
    linkLabel: "近日公開",
  },
];

export default function Pillars() {
  return (
    <Reveal as="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">01 / Concept</p>
            <h2>読む、探す、つながる。</h2>
          </div>
          <p className="lede">
            横丁の情報は今も「知っている人だけが知っている」。この3つの入口から、実際に記事を読み、横丁を探し、横丁の賑わいを外へひらいていく。
          </p>
        </div>
        <div className="pillars">
          {pillars.map((p) => {
            const content = (
              <>
                <div className="pillar-photo">
                  <span className="pillar-photo-tag">イメージ</span>
                  <Image
                    src={p.photo}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="pillar-body">
                  <p className="pillar-jp">{p.jp}</p>
                  <span className="pillar-en">{p.en}</span>
                  <p>{p.body}</p>
                  <span
                    className={`pillar-link${p.href ? "" : " pillar-link-soon"}`}
                  >
                    {p.linkLabel}
                  </span>
                </div>
              </>
            );

            if (p.href) {
              return (
                <Link className="pillar" href={p.href} key={p.jp}>
                  {content}
                </Link>
              );
            }

            return (
              <div className="pillar pillar-disabled" key={p.jp}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
