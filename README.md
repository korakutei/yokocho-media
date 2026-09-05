# 横丁メディア（Next.js MVP）

「横丁メディア構想」プロトタイプのNext.js実装。Cowork上のArtifact版
（黒×白×金・和と新のデザイン）を、そのままNext.js（App Router / TypeScript）に
移植したものです。デザイン・構成・コピーはArtifact版から意図的に変更していません。

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
  update-digest.ts … digest.json 更新用スクリプトの雛形（下記参照）
```

## 日次ニュース更新の運用について

Cowork側では「横丁ニュース毎日キャッチアップ」スケジュールタスクが、
毎朝7時（JST）にWebSearchで横丁関連の新着情報を集め、Artifactのダイジェスト欄を
直接書き換えています。

この Next.js 版では、同じ内容を `data/digest.json` に反映する運用を想定しています。

```bash
# 当日の新着記事一覧（DigestItem[]形式）をJSONファイルとして用意し、
npm run digest:update -- ./new-items.json
```

`DigestItem` の形式は `lib/types.ts` を参照してください。新着0件の日は
既存内容を維持する（Artifact版と同じルール）ようスクリプト側で担保しています。

### 今後の検討事項（未実装・要設計判断）

- WebSearchによる収集〜要約〜確信度判定のロジックをこのリポジトリに持たせるか、
  Cowork側のスケジュールタスクから `digest:update` を呼び出す形にするか
- 収集結果を自動でこのリポジトリにコミット・デプロイする仕組み（GitHub Actions等）
- MAP検索・店舗ページなど、まだArtifact版にもない機能の設計
- 浜倉的商店製作所グループとの掲載許諾・データ提供の実務フロー

## 背景（企画メモ）

企画の背景・収益モデル・KPI等は、この場では管理していません（Cowork側のmemoryで
浦野雄次さんと継続管理しています）。実装上の意思決定で企画意図の確認が必要な場合は、
Cowork側に立ち戻って確認してください。
