export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-mark">横丁メディア</p>
          <p className="footer-note">
            これはCoworkのArtifactプロトタイプから移行したNext.js版MVPです。掲載情報は公開情報の集約であり、出典を明示しています。デザイン方向性：黒×白×金、和と新。Hero・掲載横丁一覧の写真とロゴは浜倉的商店製作所グループから掲載許諾済みの公式素材です。「読む・探す・つながる」の3枚のみ、許諾前の汎用イメージカットです。
          </p>
        </div>
        <div className="footer-status">
          Prototype Build — Next.js MVP（非公開）
          <br />
          Next: 掲載可否レビュー導線 / Pillars写真の実写化 / MAP検索
        </div>
      </div>
    </footer>
  );
}
