import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/basePath";
import { GUIDE_NAME, GUIDE_POSES } from "@/lib/guide";
import "./shindan.css";

/** トップページ「今夜どんな気分?」内に置く、ヨコチョ診断への入口。案内人ヨコチョが手を振って呼び込む。 */
export default function ShindanCta() {
  const guide = GUIDE_POSES.wave;

  return (
    <Link href="/shindan" className="shindan-cta">
      <Image
        className="shindan-cta-guide"
        src={withBase(guide.src)}
        width={guide.width}
        height={guide.height}
        alt=""
      />
      <span className="shindan-cta-body">
        <span className="shindan-cta-label">Yokocho Shindan</span>
        <span className="shindan-cta-title">
          {/* 狭い画面で「診/断」のように語の途中で折り返さないよう、句読点の位置でだけ改行させる */}
          <span className="shindan-cta-title-part">迷ったら、</span>
          <span className="shindan-cta-title-part">ヨコチョ診断。</span>
        </span>
        <span className="shindan-cta-text">
          案内人{GUIDE_NAME}が、7つの質問からあなたの横丁タイプと相性のいい横丁へごあんない（約1分）。
        </span>
      </span>
      <span className="shindan-cta-arrow">診断する →</span>
    </Link>
  );
}
