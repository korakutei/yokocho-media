import Image from "next/image";
import { withBase } from "@/lib/basePath";
import { GUIDE_NAME, GUIDE_POSES, type GuidePose } from "@/lib/guide";
import "./guide.css";

/**
 * 案内人ヨコチョ + 吹き出し。セリフは子要素で渡す。
 * キャラクター画像は装飾扱い(alt="")にし、誰の発言かは吹き出し内の名前ラベルで伝える。
 */
export default function GuideSays({
  pose,
  size = "md",
  className,
  children,
}: {
  pose: GuidePose;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const img = GUIDE_POSES[pose];

  return (
    <div className={`guide guide-${size}${className ? ` ${className}` : ""}`}>
      <Image
        className={`guide-figure guide-figure-${pose}`}
        src={withBase(img.src)}
        width={img.width}
        height={img.height}
        alt=""
      />
      <div className="guide-bubble">
        <span className="guide-name">案内人 {GUIDE_NAME}</span>
        <p className="guide-line">{children}</p>
      </div>
    </div>
  );
}
