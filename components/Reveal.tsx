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
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    as,
    { ref, id, className: `reveal ${visible ? "in" : ""} ${className}`.trim() },
    children
  );
}
