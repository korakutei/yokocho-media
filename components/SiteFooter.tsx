export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <p className="footer-mark">ヨコチョナビ</p>
          <p className="footer-note">
            ヨコチョナビは特定の運営会社の広報物ではなく、独立して横丁文化を紹介し、各横丁への入口となることを目指すメディアです。現在は浜倉的商店製作所グループの許諾を得て先行掲載していますが、今後は他の横丁運営者への掲載も広げていく方針です。掲載情報は公開情報の集約であり、出典を明示しています。デザイン方向性：黒×白×金、和と新。掲載横丁一覧の写真とロゴは浜倉的商店製作所グループから掲載許諾済みの公式素材です。Hero・「読む・探す・つながる」の写真は、実在の横丁を指すものではない汎用イメージカットです。Hero内の日本地図イラストは
            <a
              href="https://commons.wikimedia.org/wiki/File:Blank_map_of_Japan_new.svg"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons(作成:Lincun、修正:Erida539, YasutoTakenaka、CC BY-SA 3.0)
            </a>
            の地図データを元に作成した雰囲気演出であり、正確な店舗所在地を示すものではありません。
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
