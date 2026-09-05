import Reveal from "./Reveal";

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
          <div className="pillar">
            <p className="pillar-jp">読む</p>
            <span className="pillar-en">Read — Articles &amp; Features</span>
            <p>新規開店、店主の想い、その日の賑わい。横丁ごとの記事・特集で背景まで届ける。</p>
          </div>
          <div className="pillar">
            <p className="pillar-jp">探す・行く</p>
            <span className="pillar-en">Find — Map Search</span>
            <p>今夜行ける横丁を地図から探す。エリア・時間帯・雰囲気で絞り込める案内板に育てる。</p>
          </div>
          <div className="pillar">
            <p className="pillar-jp">つながる</p>
            <span className="pillar-en">Connect — Community</span>
            <p>常連、店主、旅行者。横丁で生まれる縁をSNS・コミュニティ機能でゆるくつなぎ続ける。</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
