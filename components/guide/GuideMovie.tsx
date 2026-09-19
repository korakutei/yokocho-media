"use client";

import { useEffect, useRef } from "react";
import { withBase } from "@/lib/basePath";
import { GUIDE_MOVIE, GUIDE_NAME } from "@/lib/guide";
import "./guide.css";

/**
 * 案内人ヨコチョのムービー。画面に入ったら消音で自動再生し、外れたら止める。
 * 動きを減らす設定の端末では自動再生せず、再生ボタンから見てもらう。
 */
export default function GuideMovie() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // 省電力モード等で自動再生が拒否されたら、再生ボタンに任せる
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="guide-movie">
      <video
        ref={videoRef}
        className="guide-movie-video"
        // #t=0.1: 再生前でも最初のコマを表示させる(iOS Safari対策)
        src={`${withBase(GUIDE_MOVIE)}#t=0.1`}
        muted
        loop
        playsInline
        controls
        preload="metadata"
        aria-label={`案内人${GUIDE_NAME}が横丁を案内するムービー(10秒)`}
      />
      <div className="guide-movie-body">
        <p className="guide-movie-text">
          提灯を片手に、頭にはスズメの相棒。「こっちこっち！」の声についていけば、はじめての横丁でも迷いません。ヨコチョ診断では、案内人{GUIDE_NAME}が質問から結果まで、あなたの横丁探しにお供します。
        </p>
        <p className="guide-movie-note">※ 10秒のムービーです。音は再生ボタンの横のスピーカーから出せます。</p>
      </div>
    </div>
  );
}
