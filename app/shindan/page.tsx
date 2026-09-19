import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import YokochoShindan from "@/components/shindan/YokochoShindan";
import { getVenues } from "@/lib/data";
import { shindanCandidates } from "@/lib/shindan";

export const metadata: Metadata = {
  title: "ヨコチョ診断 — ヨコチョナビ",
  description:
    "7つの質問で、あなたの「横丁タイプ」(全6タイプ)と相性のいい横丁がわかる。ヨコチョナビの横丁診断。",
};

export default function ShindanPage() {
  const venues = shindanCandidates(getVenues().venues);

  return (
    <>
      <YokochoShindan venues={venues} />
      <SiteFooter />
    </>
  );
}
