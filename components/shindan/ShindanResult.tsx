import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/basePath";
import {
  SHINDAN_TYPES,
  getShindanType,
  type ShindanMatch,
  type ShindanType,
} from "@/lib/shindan";
import GuideSays from "@/components/guide/GuideSays";
import ShindanShare from "./ShindanShare";
import "./shindan.css";

const TIP_NUMERALS = ["一", "二", "三", "四", "五"];

function Stars({ value }: { value: number }) {
  return (
    <span className="venue-star-rating" aria-label={`5段階中${value}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * 診断結果の表示。診断直後(/shindan)とシェア用のタイプ別ページ(/shindan/[type])の両方で使う。
 * `actions` には「もう一度診断する」「診断してみる」など、ページごとのボタンを渡す。
 */
export default function ShindanResult({
  type,
  matches,
  kicker,
  actions,
}: {
  type: ShindanType;
  matches: ShindanMatch[];
  kicker: string;
  actions: React.ReactNode;
}) {
  const partner = getShindanType(type.partner.id);

  return (
    <div className="shindan-inner">
      <p className="shindan-result-kicker">{kicker}</p>

      <div className="shindan-noren">
        <span className="shindan-mon" aria-hidden="true">
          {type.mon}
        </span>
        <span className="shindan-noren-label">あなたの横丁タイプは</span>
        <h1 className="shindan-type-name shindan-heading" tabIndex={-1}>
          {type.name}
        </h1>
        <span className="shindan-type-en">{type.en}</span>
        <p className="shindan-type-catch">{type.catch}</p>
      </div>

      <p className="shindan-description">{type.description}</p>

      {matches.length > 0 && (
        <div className="shindan-block">
          <h2 className="shindan-block-title">
            相性のいい横丁 <small>Your Yokocho</small>
          </h2>
          <GuideSays pose="welcome" className="shindan-result-guide">
            {type.guide}
          </GuideSays>
          <div className="venue-grid shindan-venues">
            {matches.map(({ venue, matchedTags, highlight }, i) => (
              <Link className="venue" href={`/venues/${venue.slug}`} key={venue.slug}>
                <div className="venue-photo">
                  <Image
                    src={withBase(venue.photo)}
                    alt={`${venue.name}の様子`}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <span className="shindan-rank">相性 No.{i + 1}</span>
                </div>
                <div className="venue-body">
                  <span className="venue-name">{venue.name}</span>
                  <span className="venue-area">
                    {venue.area}　{venue.specs.price}
                  </span>
                  {highlight && (
                    <span className="shindan-venue-spec">
                      {highlight.label}
                      <Stars value={highlight.value} />
                    </span>
                  )}
                  {matchedTags.length > 0 && (
                    <div className="venue-tags">
                      {matchedTags.map((tag) => (
                        <span className="venue-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {venue.editorComment && (
                    <p className="venue-editor-comment">「{venue.editorComment}」</p>
                  )}
                  <span className="shindan-venue-link">詳しく見る →</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="shindan-venues-note">
            ※ 編集部による現地取材前の目安評価(タグ・スペック)をもとに選んでいます。営業時間などの最新情報は各横丁の公式サイトでご確認ください。
          </p>
        </div>
      )}

      <div className="shindan-block">
        <h2 className="shindan-block-title">
          このタイプの横丁の歩き方 <small>How to Enjoy</small>
        </h2>
        <ol className="shindan-tips">
          {type.tips.map((tip, i) => (
            <li className="shindan-tip" key={tip}>
              <span className="shindan-tip-num" aria-hidden="true">
                {TIP_NUMERALS[i]}
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ol>
      </div>

      {partner && (
        <div className="shindan-block">
          <h2 className="shindan-block-title">
            一緒に行くと楽しいタイプ <small>Good Partner</small>
          </h2>
          <Link className="shindan-partner" href={`/shindan/${partner.id}`}>
            <span className="shindan-mon shindan-mon-sm" aria-hidden="true">
              {partner.mon}
            </span>
            <span>
              <span className="shindan-partner-name">{partner.name}</span>
              <span className="shindan-partner-reason">{type.partner.reason}</span>
            </span>
          </Link>
        </div>
      )}

      <div className="shindan-actions">
        <GuideSays pose="back" size="sm" className="shindan-sendoff">
          こっちこっち！ 気になる横丁が見つかったら、暖簾をくぐりに行こう。結果は仲間にもシェアしてね。
        </GuideSays>
        <p className="shindan-actions-label">結果をシェアする</p>
        <ShindanShare type={type} />
        <div className="shindan-actions-buttons">
          {actions}
          {/* next/linkだと結果画面のスクロール位置を引き継ぎ、トップの途中から表示されることがあるため、通常の<a>で先頭から開く */}
          <a href={withBase("/")} className="hero-cta hero-cta-secondary">
            トップに戻る
          </a>
        </div>
      </div>

      <div className="shindan-block">
        <h2 className="shindan-block-title">
          全6タイプ <small>All Types</small>
        </h2>
        <ShindanTypeList currentId={type.id} />
      </div>

      <p className="shindan-note">
        ヨコチョ診断は、ヨコチョナビ編集部が横丁の楽しみ方を6つのタイプに分けた遊びのコンテンツです。回答内容はお使いの端末の外には送信・保存されません。
      </p>
    </div>
  );
}

export function ShindanTypeList({ currentId }: { currentId?: string }) {
  return (
    <div className="shindan-types">
      {SHINDAN_TYPES.map((t) => {
        const inner = (
          <>
            <span className="shindan-mon shindan-mon-sm" aria-hidden="true">
              {t.mon}
            </span>
            <span>
              <span className="shindan-types-name">{t.name}</span>
              <span className="shindan-types-catch">{t.catch}</span>
            </span>
          </>
        );
        return t.id === currentId ? (
          <div
            className="shindan-types-item shindan-types-item-current"
            key={t.id}
            aria-current="true"
          >
            {inner}
          </div>
        ) : (
          <Link className="shindan-types-item" href={`/shindan/${t.id}`} key={t.id}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
