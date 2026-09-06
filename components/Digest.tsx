import Reveal from "./Reveal";
import type { DigestData } from "@/lib/types";

export default function Digest({ data }: { data: DigestData }) {
  const { items, updatedLabel } = data;

  return (
    <Reveal as="section" className="raised">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="section-num">01 / Digest</p>
            <h2>本日の横丁ニュース</h2>
          </div>
          <p className="digest-updated">
            <span className="dot"></span>
            <span>{updatedLabel}</span>
          </p>
        </div>

        {/* この一覧は data/digest.json から生成される。
            日次の自動収集ジョブ（scripts/collect-digest.ts、GitHub Actionsで実行）が
            このJSONを書き換えることで、Artifact版と同じ運用フローを再現する。 */}
        {items.length > 0 ? (
          <div className="digest-list">
            {items.map((item) => (
              <a
                key={item.id}
                className="digest-item"
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="digest-date">{item.date}</span>
                <span className="digest-body">
                  <span className={`digest-tag${item.isNew ? " new" : ""}`}>
                    {item.tag}
                  </span>
                  <h3 className="digest-title">{item.title}</h3>
                  <p className="digest-desc">{item.desc}</p>
                  {item.confidence && (
                    <p className="digest-conf">確信度：{item.confidence}</p>
                  )}
                </span>
                <span className="digest-src">{item.sourceName} ↗</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="digest-empty">
            本日、掲載基準を満たす新着情報は確認できませんでした。無理に項目を作らず、既存の内容を維持しています。
          </p>
        )}

        <p className="digest-note">
          この一覧は公開情報の要約と出典リンクの集約のみを行っています（本文の転載は行いません）。毎朝7時（JST）に自動収集システムが更新します。
        </p>
      </div>
    </Reveal>
  );
}
