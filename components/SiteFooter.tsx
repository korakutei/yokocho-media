export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-mark">横丁メディア</p>
          <p className="footer-note">
            これはCoworkのArtifactプロトタイプから移行したNext.js版MVPです。掲載情報は公開情報の集約であり、出典を明示しています。デザイン方向性：黒×白×金、和と新。
          </p>
        </div>
        <div className="footer-status">
          Prototype Build — Next.js MVP
          <br />
          Next: 掲載可否レビュー導線 / 実写真差し替え / MAP検索 / 日次収集の自動化
        </div>
      </div>
    </footer>
  );
}
