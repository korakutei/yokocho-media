import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-mark">ヨコチョナビ</p>
          <p className="footer-note">
            横丁文化を紹介し、各横丁への入口となることを目指す独立系メディアです。
            <br />
            <Link href="/about">ヨコチョナビとは・運営方針について →</Link>
          </p>
        </div>
        <div className="footer-status">
          Prototype Build — Next.js MVP（非公開）
          <br />
          Next: 全国横丁ディレクトリの許諾・情報更新フロー整備 / 試験掲載中の横丁への許諾取得 / Pillars写真の実写化
        </div>
      </div>
    </footer>
  );
}
