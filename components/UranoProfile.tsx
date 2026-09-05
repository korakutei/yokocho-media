import Image from "next/image";
import Reveal from "./Reveal";

export default function UranoProfile() {
  return (
    <Reveal as="section" id="urano" className="raised">
      <div className="wrap urano-grid">
        <div className="urano-photo">
          <Image
            src="/images/urano-yuji.jpg"
            alt="交流師・浦野雄次"
            width={700}
            height={1052}
            sizes="(max-width: 760px) 60vw, 260px"
          />
        </div>
        <div className="urano-body">
          <p className="section-num">04 / Person</p>
          <p className="urano-role">
            横丁交流師
            <span className="urano-role-en">YOKOCHO CONNECTOR</span>
          </p>
          <h2 className="urano-name">浦野雄次</h2>
          <p className="urano-comment">
            私が横丁に惹かれるのは、店そのものより、そこで生まれる関係です。
            <br />
            知らない人同士が乾杯して、地域の話を聞いて、また来たくなる。
            <br />
            そんな小さな交流の積み重ねが、街のにぎわいをつくっていく。
            <br />
            ヨコチョナビで、その入口を全国につくりたいと思っています。
          </p>
        </div>
      </div>
    </Reveal>
  );
}
