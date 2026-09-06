"use client";

import { createElement, useEffect, useRef, useState } from "react";

/**
 * Artifact版の scroll-reveal 演出（IntersectionObserverでフェードイン）を
 * Next.jsのクライアントコンポーネントとして移植したもの。
 * `as` でレンダリングするタグ（section など）を切り替えられる。
 */
export default function Reveal({
  children,
  className = "",
  as = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      // threshold は「要素の面積の何%が画面内に入ったか」で判定されるため、
      // Venuesのように縦に非常に長いセクション(モバイルでは1万px近い)では、
      // 画面の高さより必要な可視量の方が大きくなり、閾値を割合(例: 0.12)に
      // していると理論上ずっと発火しないケースがあった(実機で発生した不具合)。
      // 1pxでも画面内に入れば発火する 0 に固定し、要素の大きさに依存しないようにする。
      { threshold: 0 }
    );
    io.observe(el);
    // 画像読み込み中のレイアウトシフト等でIntersectionObserverの初回判定を
    // 取りこぼした場合の保険。要素が既に画面内(またはすぐ下)にあれば
    // 少し待って強制的に表示する(コンテンツが永久に非表示のままになるのを防ぐ)。
    const fallback = window.setTimeout(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 400) {
        setVisible(true);
      }
    }, 1000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return createElement(
    as,
    { ref, id, className: `reveal ${visible ? "in" : ""} ${className}`.trim() },
    children
  );
}
