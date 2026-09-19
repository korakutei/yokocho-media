"use client";

import { useEffect, useState } from "react";
import { withBase } from "@/lib/basePath";
import type { ShindanType } from "@/lib/shindan";

/**
 * 診断結果のシェアボタン。シェア先URLはタイプ別ページ(/shindan/[type])。
 * 絶対URLはブラウザ上でしか確定しないため、マウント後に組み立てる。
 */
export default function ShindanShare({ type }: { type: ShindanType }) {
  const path = withBase(`/shindan/${type.id}`);
  const [url, setUrl] = useState(path);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}${path}`);
  }, [path]);

  const text = `私の横丁タイプは「${type.name}」でした。${type.catch}\n#ヨコチョ診断 #ヨコチョナビ`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const lineHref = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setStatus("結果のリンクをコピーしました");
    } catch {
      setStatus("コピーできませんでした。アドレスバーのURLをご利用ください");
    }
  }

  return (
    <>
      <div className="shindan-share">
        <a className="shindan-share-button" href={xHref} target="_blank" rel="noopener noreferrer">
          Xでシェア
        </a>
        <a className="shindan-share-button" href={lineHref} target="_blank" rel="noopener noreferrer">
          LINEで送る
        </a>
        <button type="button" className="shindan-share-button" onClick={copy}>
          リンクをコピー
        </button>
      </div>
      <p className="shindan-share-status" role="status">
        {status}
      </p>
    </>
  );
}
