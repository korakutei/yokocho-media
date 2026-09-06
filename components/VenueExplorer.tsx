"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/basePath";
import type { Venue } from "@/lib/types";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="venue-star-rating" aria-label={`交流度 5段階中${value}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "star-filled" : "star-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}

function VenueCard({
  venue,
  distanceKm,
}: {
  venue: Venue;
  distanceKm?: number;
}) {
  const inner = (
    <>
      <div className="venue-photo">
        {venue.photo ? (
          <Image
            src={withBase(venue.photo)}
            alt={`${venue.name}の店内・通りの様子`}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="venue-photo-empty">
            {venue.status === "research" ? "試験掲載" : "取材中"}
          </div>
        )}
        {venue.logo && (
          <span className="venue-mark">
            <Image
              src={withBase(venue.logo)}
              alt={`${venue.name} 公式ロゴ`}
              width={600}
              height={135}
              loading="lazy"
            />
          </span>
        )}
        {typeof distanceKm === "number" && (
          <span className="venue-distance-badge">
            現在地から約{distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`}
          </span>
        )}
      </div>
      <div className="venue-body">
        <p className="venue-name">{venue.name}</p>
        <span className="venue-area">{venue.area}</span>

        {venue.specs && (
          <div className="venue-quick-specs">
            <StarRating value={venue.specs.social} />
            <span className="venue-quick-specs-sub">{venue.specs.price}</span>
          </div>
        )}

        {venue.tags && venue.tags.length > 0 && (
          <div className="venue-tags">
            {venue.tags.map((tag) => (
              <span className="venue-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {venue.editorComment && (
          <p className="venue-editor-comment">「{venue.editorComment}」</p>
        )}

        {venue.slug && <span className="venue-link">詳しく見る →</span>}
        {!venue.slug && venue.url && (
          <span className="venue-link">公式サイトを見る →</span>
        )}
      </div>
    </>
  );

  if (venue.slug) {
    return (
      <Link className="venue" href={`/venues/${venue.slug}`}>
        {inner}
      </Link>
    );
  }

  if (venue.url) {
    return (
      <a
        className="venue"
        href={venue.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  return <div className="venue venue-disabled">{inner}</div>;
}

type GeoState = "idle" | "loading" | "done" | "error";

export default function VenueExplorer({ venues }: { venues: Venue[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [distances, setDistances] = useState<Record<string, number>>({});

  const allTags = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => v.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [venues]);

  function handleLocate() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const next: Record<string, number> = {};
        venues.forEach((v) => {
          if (typeof v.lat === "number" && typeof v.lng === "number") {
            next[v.name] = haversineKm(latitude, longitude, v.lat, v.lng);
          }
        });
        setDistances(next);
        setGeoState("done");
      },
      () => setGeoState("error"),
      { timeout: 8000 }
    );
  }

  // Hero/MoodSearch の「現在地から探す」「気分タグ」から
  // /?geo=1#venues や /?tag=<値>#venues で遷移してきた場合、
  // 自動で現在地取得・タグ絞り込みを開始する(トップから1タップで最短到達させるための導線)。
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("geo") === "1") {
      handleLocate();
    }
    const tagParam = params.get("tag");
    if (tagParam && allTags.includes(tagParam)) {
      setActiveTag(tagParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let list = activeTag ? venues.filter((v) => v.tags?.includes(activeTag)) : venues;
  if (geoState === "done") {
    list = [...list].sort((a, b) => {
      const da = distances[a.name] ?? Infinity;
      const db = distances[b.name] ?? Infinity;
      return da - db;
    });
  }

  return (
    <div>
      <div className="venue-toolbar">
        <div className="venue-tagfilter">
          <button
            type="button"
            className={!activeTag ? "tag-chip tag-chip-active" : "tag-chip"}
            onClick={() => setActiveTag(null)}
          >
            すべて
          </button>
          {allTags.map((tag) => (
            <button
              type="button"
              key={tag}
              className={activeTag === tag ? "tag-chip tag-chip-active" : "tag-chip"}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="locate-button"
          onClick={handleLocate}
          disabled={geoState === "loading"}
        >
          {geoState === "loading"
            ? "現在地を取得中…"
            : geoState === "done"
              ? "近い順に表示中 ↻ もう一度取得"
              : "📍 現在地から近い順に探す"}
        </button>
      </div>
      {geoState === "error" && (
        <p className="locate-error">
          現在地を取得できませんでした。ブラウザの位置情報の利用を許可しているかご確認ください（一部の横丁はエリア未確定のため、現在地検索の対象外です）。
        </p>
      )}

      <div className="venue-grid">
        {list.map((venue) => (
          <VenueCard venue={venue} key={venue.name} distanceKm={distances[venue.name]} />
        ))}
      </div>
    </div>
  );
}

export { StarRating };
