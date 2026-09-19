import Link from "next/link";
import "./shindan.css";

/** トップページ「今夜どんな気分?」内に置く、ヨコチョ診断への入口。 */
export default function ShindanCta() {
  return (
    <Link href="/shindan" className="shindan-cta">
      <span className="shindan-mon" aria-hidden="true">
        診
      </span>
      <span className="shindan-cta-body">
        <span className="shindan-cta-label">Yokocho Shindan</span>
        <span className="shindan-cta-title">迷ったら、ヨコチョ診断。</span>
        <span className="shindan-cta-text">
          7つの質問で、あなたの横丁タイプと相性のいい横丁がわかります（約1分）。
        </span>
      </span>
      <span className="shindan-cta-arrow">診断する →</span>
    </Link>
  );
}
