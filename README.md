# ヨコチョナビ（Next.js MVP）

「横丁メディア構想」プロトタイプのNext.js実装。Cowork上のArtifact版
（黒×白×金・和と新のデザイン）を、そのままNext.js（App Router / TypeScript）に
移植したものです。デザイン・構成・コピーはArtifact版から意図的に変更していません。

**2026年9月5日、サービス名を「横丁メディア」から「ヨコチョナビ」に変更しました**
（コピーライター3名によるネーミング検討の結果。「メディア」という語尾が
記事配信に閉じた印象を与え、目指す「各横丁への入口」という立ち位置と
ズレていたため）。リポジトリ名・npmパッケージ名(`yokocho-media`)は
変更コストを避けるため据え置いています。

## セットアップ

```bash
npm install
npm run dev
# http://localhost:3000
```

本番ビルド：

```bash
npm run build
npm run start
```

Vercel等にそのままデプロイ可能な構成です（next.config.jsは最小限）。

**注意:** `app/layout.tsx` の `metadata.robots` を `{ index: false, follow: false }` に
設定し、検索エンジンにインデックスされないようにしています（クローズド運用中のため）。
一般公開の判断が出たら、この設定を外すこと。

## ディレクトリ構成

```
app/
  layout.tsx      … 全体レイアウト、フォント読み込み、メタ情報
  page.tsx         … トップページ（各セクションを組み立てるだけ）
  globals.css      … Artifact版から移植したデザインシステム一式
components/
  Hero.tsx         … ファーストビュー（タイトル・件数・最終更新日）
  Pillars.tsx      … 「読む・探す・つながる」3本柱
  Digest.tsx       … 「本日の横丁ニュース」一覧（data/digest.jsonを描画）
  Venues.tsx       … プロトタイプ掲載対象の横丁一覧（data/venues.jsonを描画）
  SiteFooter.tsx   … フッター
  Reveal.tsx       … スクロール時のフェードイン演出（クライアントコンポーネント）
lib/
  types.ts         … DigestItem / Venue などの型定義
  data.ts          … data/*.json の読み込み関数
data/
  digest.json      … 当日の横丁ニュース一覧（運用で書き換える対象）
  venues.json      … 掲載対象の横丁一覧（浜倉的商店製作所グループ11横丁）
scripts/
  lib/digest-io.ts   … digest.json のバリデーション・読み書き共通ロジック（JST日付計算を含む）
  update-digest.ts   … digest.json の手動更新スクリプト（下記参照）
  collect-digest.ts  … Claude API（web_search）による日次自動収集スクリプト（下記参照）
.github/workflows/
  digest-daily.yml … 毎朝7時（JST）に collect-digest.ts を実行するGitHub Actions
public/images/
  hero-shibuya.jpg     … Hero背景（浜倉的商店製作所グループ公式サイトより掲載許諾済み）
  pillar-*.jpg         … 3本柱カードのイメージカット（下記参照、未許諾の汎用素材）
  venues/*.jpg         … 各横丁の公式ロゴ（浜倉的商店製作所グループ公式サイトより掲載許諾済み）
```

## 写真について

写真の由来が2系統ある点に注意。

**1. 浜倉的商店製作所グループから掲載許諾済みの素材**（`hero-shibuya.jpg`, `venues/*.jpg`）

企業から掲載許諾を得た上で、公式サイト（https://www.hamakura-style.com/ ）の
各横丁ページから取得した素材。

- Hero背景：渋谷横丁の公式サイト掲載画像（オープン時の完成イメージ／CGパース。
  実写真ではない点に留意）
- Venuesセクションの各カード：`photo`（実店舗写真、`venue-photo`）+ `logo`
  （毛筆ロゴ、`.venue-mark` として写真に重ねて表示）+ `url`（運営元公式サイトの
  当該横丁ページへの外部リンク）の3点を各横丁ページから取得して掲載。
  カード全体がリンクになっており、ヨコチョナビを経由して各横丁の公式サイトへ
  遷移できる（「入口」としての導線）
- 各横丁ページの写真は `<img>` タグではなくCSS `background-image` の
  カルーセルで実装されていることが多く、単純なHTML取得では見つからない
  （実際に取得する際はレンダリングして`computedStyle`を確認する必要があった）
- **ピット・インのみ、公式サイト上に該当ページ・ロゴ・写真が見当たらず未確認。**
  浜倉的商店製作所グループの現行ブランドかどうか含め要確認（掲載対象から
  外すか、別途確認が必要）。`photo`/`logo`/`url` すべて `null` にしている
- **立ち寿司横丁は都内に複数店舗を展開するブランドであり、単一の「横丁」施設
  ではない点にも留意**（venues.jsonの `area` が未確定なのはこのため）

**2. 未許諾の汎用イメージカット**（`pillar-*.jpg`）

Pillars（読む・探す・つながる）カードの3枚は、実在の横丁を指すものではない
雰囲気カットで、掲載許諾は取得していない。各カードに小さく「イメージ」ラベルを
表示している（`Pillars.tsx` / `globals.css` の `.pillar-photo-tag`）。実店舗写真に
差し替える際は、`public/images/` の該当ファイルを置き換え、`Pillars.tsx` の
`alt` テキストも実際の状況に合わせて更新すること。

## 日次ニュース更新の運用について

`data/digest.json` の更新には2つの経路がある。

### 1. 自動収集（本運用）

`.github/workflows/digest-daily.yml` が毎朝7時（JST）に起動し、
`npm run digest:collect`（`scripts/collect-digest.ts`）を実行する。このスクリプトは
Claude（`claude-sonnet-5`）にサーバーサイドの `web_search` ツールを渡して直近の
横丁関連ニュースを収集・要約・確信度判定させ、構造化ツール呼び出し
（`submit_digest`）として結果を受け取って `data/digest.json` を書き換える。
掲載基準を満たす新着が0件のときは既存内容を維持する（Artifact版と同じルール）。

**セットアップに必要な作業（このリポジトリのコードでは自動化していない部分）**

1. GitHubリポジトリを作成し、このリポジトリをpushする。
2. リポジトリの Secrets に `ANTHROPIC_API_KEY` を登録する。
   Claude側にAPIキーを渡さないため、必ず自分のターミナルで実行すること：
   ```bash
   gh secret set ANTHROPIC_API_KEY
   ```
3. Vercel等のデプロイ先とGitHubリポジトリを連携する（push契機で自動デプロイされる）。

**ローカルでの試し方**

```bash
# .env.example を参考に、シェルでAPIキーをセットしてから実行する
ANTHROPIC_API_KEY=sk-ant-... npm run digest:collect
```

`scripts/collect-digest.ts` 内の `SYSTEM_PROMPT` は、既存の `data/digest.json` の
実例とサイトコピーから逆算した**初稿**。実際の掲載基準（何を「横丁」とみなすか等）は
Cowork側のmemoryが正のため、運用しながら文面を調整すること。

### 2. 手動更新（補助的な経路）

人手で内容を確定させたい場合のために、以下の経路も残している。

```bash
# 当日の新着記事一覧（DigestItem[]形式）をJSONファイルとして用意し、
npm run digest:update -- ./new-items.json
```

`DigestItem` の形式は `lib/types.ts` を参照してください。新着0件の日は
既存内容を維持する（Artifact版と同じルール）ようスクリプト側で担保しています。

### コンテンツ戦略の見直し（2026-09-05）

コピーライター3名・マーケティング戦略家・Webデザイナー・横丁コンサルタントに
よるレビューを経て、以下を実施済み：

- サービス名を「横丁メディア」→「ヨコチョナビ」に変更（上記参照）
- Heroコピーを「メディアの説明」から「読者の今夜の行動」を主語にした文へ変更し、
  Venuesセクションへ飛ぶCTAボタン（`.hero-cta`）を追加
- `collect-digest.ts` の `SYSTEM_PROMPT` から「〜動向を注視したい」等の内部メモ
  口調の指示を削除し、読者の検索意図に応える見出し・要約を書くよう変更
- SiteFooterに「特定の運営会社の広報物ではない」中立性の一文を追加

### 今後の検討事項（未実装・要設計判断）

- `collect-digest.ts` の `SYSTEM_PROMPT`（掲載基準の初稿）を、Cowork側のmemoryにある
  実際の掲載基準と突き合わせて精緻化する
- MAP検索・店舗ページなど、まだArtifact版にもない機能の設計
- 浜倉的商店製作所グループとの掲載許諾・データ提供の実務フロー

## 背景（企画メモ）

企画の背景・収益モデル・KPI等は、この場では管理していません（Cowork側のmemoryで
浦野雄次さんと継続管理しています）。実装上の意思決定で企画意図の確認が必要な場合は、
Cowork側に立ち戻って確認してください。
