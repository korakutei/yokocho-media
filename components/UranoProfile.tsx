import Image from "next/image";
import Reveal from "./Reveal";
import { withBase } from "@/lib/basePath";

const TAGS = ["想いをカタチに、喜びを未来に。", "縁的資本", "横丁ファン"];

export default function UranoProfile() {
  return (
    <Reveal as="section" id="urano" className="raised">
      <div className="wrap urano-grid">
        <div className="urano-photo">
          <Image
            src={withBase("/images/urano-yuji.jpg")}
            alt="横丁交樂師・浦野雄次"
            width={700}
            height={1052}
            sizes="(max-width: 760px) 60vw, 260px"
          />
        </div>
        <div className="urano-body">
          <p className="section-num">06 / Person</p>
          <p className="urano-role">
            横丁交樂師
            <span className="urano-role-en">
              合同会社交樂庭 代表社員 ／ ヨコチョナビ発起人
            </span>
          </p>
          <h2 className="urano-name">浦野雄次</h2>
          <p className="urano-comment">
            1600年頃から世田谷区喜多見に居住する浦野家の15代目。実家の庭で家族・友人・地域の人・民泊ゲストが交わってきた原体験が、「交樂庭」という名称と思想の由来です。日々の本業では、全国の自治体・企業と手を組み、地域に眠る資源を掘り起こして賑わいと関係人口を生み出す仕事に携わっており、そこで磨いてきた&quot;想いを言葉にし、事業として形にする&quot;編集力を、ヨコチョナビでも横丁に注いでいます。
          </p>
          <p className="urano-comment">
            自身も根っからの横丁ファンで、暖簾をくぐった先で見知らぬ人と肩を並べ、思いがけない会話が生まれる——あの偶然の出会いに何度も魅了されてきた一人です。「楽しいが交わる機会を提供したい」という想いのもと、横丁という日常に眠る店主の語り・常連の記憶・路地の空気を丁寧にすくい上げ、物語や体験へと編集しています。本取り組みでは、横丁と人をつなぐ&quot;交樂師&quot;として、様々な物語を掲載していけたらと思い、サイトを徐々に育てていきます。
          </p>
          <div className="urano-tags">
            {TAGS.map((tag) => (
              <span className="urano-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="urano-links">
            <a
              className="urano-link"
              href="https://note.com/korakutei29/n/n279bd3577152"
              target="_blank"
              rel="noopener noreferrer"
            >
              note：渋谷横丁の魅力 →
            </a>
            <a
              className="urano-link"
              href="https://korakutei.github.io/korakutei-site/#capital"
              target="_blank"
              rel="noopener noreferrer"
            >
              「縁的資本」とは（交樂庭サイト）→
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
