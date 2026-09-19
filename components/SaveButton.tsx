"use client";

import { useSavedVenues } from "@/lib/useSavedVenues";

/**
 * カード全体・詳細ページの操作バーどちらでも使う独立した保存ボタン。
 * カードがLink/aでラップされていても、このボタンはカード内側に「入れ子」にせず、
 * 常にLinkの外側(兄弟要素)として配置すること(a要素の中にbuttonを入れるのは無効なHTMLで、
 * ブラウザのクリック挙動が不安定になるため)。VenueCard側でその配置になっている。
 */
export default function SaveButton({
  venueName,
  className,
}: {
  venueName: string;
  className?: string;
}) {
  const { isSaved, toggle, ready } = useSavedVenues();
  const saved = ready && isSaved(venueName);

  return (
    <button
      type="button"
      className={`${className ?? ""} save-button${saved ? " save-button-active" : ""}`.trim()}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(venueName);
      }}
    >
      {saved ? "保存済み ✓" : "保存する"}
    </button>
  );
}
