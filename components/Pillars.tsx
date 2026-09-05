import Image from "next/image";
import Reveal from "./Reveal";

const pillars = [
  {
    jp: "読む",
    en: "Read — Articles & Features",
    body: "新規開店、店主の想い、その日の賑わい。横丁ごとの記事・特集で背景まで届ける。",
    photo: "/images/pillar-read.jpg",
    alt: "取材ノートを片手に店主へ話を聞くライターとカメラマンの様子を伝えるイメージカット",
  },
  {
    jp: "探す・行く",
    en: "Find — Map Search",
    body: "今夜行ける横丁を地図から探す。エリア・時間帯・雰囲気で絞り込める案内板に育てる。",
    photo: "/images/pillar-find.jpg",
    alt: "店先のメニューを覗き込み今夜行く店を選ぶ旅行者たちの様子を伝えるイメージカット",
  },
  {
    jp: "つながる",
    en: "Connect — Community",
    body: "常連、店主、旅行者。横丁で生まれる縁をSNS・コミュニティ機能でゆるくつなぎ続ける。",
    photo: "/images/pillar-connect.jpg",
    alt: "常連客と店主がグラスを掲げて乾杯する様子を伝えるイメージカット",
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
            横丁の情報は今も「知っている人だけが知っている」。集めて、伝えて、つなげることで、横丁の賑わいを外へひらく。
          </p>
        </div>
        <div className="pillars">
          {pillars.map((p) => (
            <div className="pillar" key={p.jp}>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
