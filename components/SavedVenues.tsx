"use client";

import Link from "next/link";
import { VenueCard } from "@/components/VenueExplorer";
import GuideSays from "@/components/guide/GuideSays";
import { useSavedVenues } from "@/lib/useSavedVenues";
import type { Venue } from "@/lib/types";

/** 端末内(localStorage)に保存された横丁だけをカードで並べる。保存は venue.name がキー。 */
export default function SavedVenues({ venues }: { venues: Venue[] }) {
  const { saved, ready } = useSavedVenues();

  // localStorageは読み込み後にしか分からないため、読み込み前は何も出さない(空表示のちらつき防止)
  if (!ready) return null;

  // 保存した順(新しいものが後ろ)で並べる
  const savedVenues = saved
    .map((name) => venues.find((v) => v.name === name))
    .filter((v): v is Venue => Boolean(v));

  if (savedVenues.length === 0) {
    return (
      <GuideSays pose="wave" size="sm" className="guide-empty">
        まだ保存した横丁はないみたい。気になる横丁のカードで「保存する」を押すと、ここに並ぶよ。{" "}
        <Link href="/#venues">横丁を探す →</Link>
      </GuideSays>
    );
  }

  return (
    <div className="venue-grid">
      {savedVenues.map((venue) => (
        <VenueCard venue={venue} key={venue.name} />
      ))}
    </div>
  );
}
