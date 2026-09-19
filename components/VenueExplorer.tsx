"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { withBase } from "@/lib/basePath";
import SaveButton from "./SaveButton";
import type { Venue } from "@/lib/types";

const COMPANION_TAGS = ["一人飲み", "友人", "デート"];
const STYLE_TAGS = ["昼飲み", "地酒", "昭和レトロ", "NEO横丁"];

const SESSION_KEY = "yokocho-navi:venues-search-state";

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

export function VenueCard({
  venue,
  distanceKm,
  hidden,
  order,
}: {
  venue: Venue;
  distanceKm?: number;
  hidden?: boolean;
  order?: number;
}) {
  const hasFullProfile = Boolean(venue.photo && venue.status === "licensed");

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
        <span className="venue-profile-badge">
          {hasFullProfile ? "詳しい紹介あり" : "基本情報のみ"}
        </span>

        <p className="venue-budget">
          {venue.specs?.price ? (
            <>
              予算目安：{venue.specs.price}
              {venue.specs.duration && <>・滞在目安{venue.specs.duration}</>}
            </>
          ) : (
            "予算目安：確認中"
          )}
        </p>

        {venue.tags && venue.tags.length > 0 && (
          <div className="venue-tags">
            {venue.tags.slice(0, 3).map((tag) => (
              <span className="venue-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {venue.waysToEnjoy && venue.waysToEnjoy.length > 0 && (
          <ul className="venue-ways">
            {venue.waysToEnjoy.slice(0, 2).map((way) => (
              <li key={way.label}>{way.label}</li>
            ))}
          </ul>
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

  const style: React.CSSProperties = { order, display: hidden ? "none" : undefined };

  let card: React.ReactNode;
  if (venue.slug) {
    card = (
      <Link className="venue" href={`/venues/${venue.slug}`}>
        {inner}
      </Link>
    );
  } else if (venue.url) {
    card = (
      <a className="venue" href={venue.url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  } else {
    card = <div className="venue venue-disabled">{inner}</div>;
  }

  return (
    <div className="venue-card-wrap" style={style} aria-hidden={hidden}>
      {card}
      <SaveButton venueName={venue.name} className="venue-save-button" />
    </div>
  );
}

type GeoState = "idle" | "loading" | "done" | "error";

type SearchState = {
  activeTag: string | null;
  activePref: string | null;
  searchText: string;
  scrollY: number;
};

export default function VenueExplorer({ venues }: { venues: Venue[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activePref, setActivePref] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [restored, setRestored] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => v.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [venues]);

  const otherTags = useMemo(
    () => allTags.filter((t) => !COMPANION_TAGS.includes(t) && !STYLE_TAGS.includes(t)),
    [allTags]
  );

  const allPrefs = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => v.pref && set.add(v.pref));
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

  // Hero/MoodSearch の「現在地から探す」「気分タグ」からの遷移(?geo=1 / ?tag=)、
  // および検索状態のsessionStorage復元(詳細ページから戻った場合)をマウント時に行う。
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    if (params.get("geo") === "1") {
      handleLocate();
    }
    const tagParam = params.get("tag");
    if (tagParam && allTags.includes(tagParam)) {
      setActiveTag(tagParam);
    } else {
      try {
        const raw = window.sessionStorage.getItem(SESSION_KEY);
        if (raw) {
          const state = JSON.parse(raw) as SearchState;
          if (state.activeTag) setActiveTag(state.activeTag);
          if (state.activePref) setActivePref(state.activePref);
          if (state.searchText) setSearchText(state.searchText);
          window.requestAnimationFrame(() => {
            window.scrollTo(0, state.scrollY || 0);
          });
        }
      } catch {
        // 復元できなくても検索自体は使えるので無視する
      }
    }
    setRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 検索条件・スクロール位置をsessionStorageへ保存(戻る操作での復元用)。
  useEffect(() => {
    if (!restored || typeof window === "undefined") return;
    function save() {
      try {
        const state: SearchState = {
          activeTag,
          activePref,
          searchText,
          scrollY: window.scrollY,
        };
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
      } catch {
        // 保存できなくても致命的ではない
      }
    }
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
      save();
    };
  }, [activeTag, activePref, searchText, restored]);

  const normalizedSearch = searchText.trim();
  const visible = useMemo(() => {
    const set = new Set<string>();
    venues.forEach((v) => {
      const matchesTag = !activeTag || v.tags?.includes(activeTag);
      const matchesPref = !activePref || v.pref === activePref;
      const matchesSearch =
        !normalizedSearch ||
        v.name.includes(normalizedSearch) ||
        v.area.includes(normalizedSearch);
      if (matchesTag && matchesPref && matchesSearch) set.add(v.name);
    });
    return set;
  }, [venues, activeTag, activePref, normalizedSearch]);

  const orderOf = useMemo(() => {
    const map = new Map<string, number>();
    if (geoState === "done") {
      const sorted = [...venues].sort((a, b) => {
        const da = distances[a.name] ?? Infinity;
        const db = distances[b.name] ?? Infinity;
        return da - db;
      });
      sorted.forEach((v, i) => map.set(v.name, i));
    } else {
      venues.forEach((v, i) => map.set(v.name, i));
    }
    return map;
  }, [venues, geoState, distances]);

  const hasActiveFilter = Boolean(activeTag || activePref || normalizedSearch);
  const resultCount = visible.size;

  function clearAll() {
    setActiveTag(null);
    setActivePref(null);
    setSearchText("");
  }

  return (
    <div>
      <div className="venue-search-row">
        <input
          type="search"
          className="venue-search-input"
          placeholder="横丁名・エリアで検索"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          aria-label="横丁名・エリアで検索"
        />
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
          現在地を取得できませんでした。ブラウザの位置情報の利用を許可しているか、駅名・エリアでの検索をお試しください（一部の横丁はエリア未確定のため、現在地検索の対象外です）。
        </p>
      )}

      {allPrefs.length > 0 && (
        <div className="venue-tagfilter-group">
          <p className="venue-tagfilter-label">場所</p>
          <div className="venue-tagfilter">
            <button
              type="button"
              className={!activePref ? "tag-chip tag-chip-active" : "tag-chip"}
              onClick={() => setActivePref(null)}
            >
              すべて
            </button>
            {allPrefs.map((pref) => (
              <button
                type="button"
                key={pref}
                className={activePref === pref ? "tag-chip tag-chip-active" : "tag-chip"}
                onClick={() => setActivePref(pref)}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="venue-tagfilter-group">
        <p className="venue-tagfilter-label">同行者</p>
        <div className="venue-tagfilter">
          {COMPANION_TAGS.filter((t) => allTags.includes(t)).map((tag) => (
            <button
              type="button"
              key={tag}
              className={activeTag === tag ? "tag-chip tag-chip-active" : "tag-chip"}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="venue-tagfilter-group">
        <p className="venue-tagfilter-label">楽しみ方</p>
        <div className="venue-tagfilter">
          {STYLE_TAGS.filter((t) => allTags.includes(t)).map((tag) => (
            <button
              type="button"
              key={tag}
              className={activeTag === tag ? "tag-chip tag-chip-active" : "tag-chip"}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {otherTags.length > 0 && (
        <div className="venue-tagfilter-group">
          <p className="venue-tagfilter-label">その他の特徴</p>
          <div className="venue-tagfilter">
            {otherTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={activeTag === tag ? "tag-chip tag-chip-active" : "tag-chip"}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="venue-result-row">
        <span className="venue-result-count">
          {hasActiveFilter ? `該当${resultCount}件` : `全${venues.length}件`}
        </span>
        {hasActiveFilter && (
          <button type="button" className="venue-clear-button" onClick={clearAll}>
            条件をクリア
          </button>
        )}
      </div>

      {resultCount === 0 && (
        <p className="venue-empty-message">
          条件に一致する横丁が見つかりませんでした。<button type="button" onClick={clearAll}>条件を減らして探し直す →</button>
        </p>
      )}

      <div className="venue-grid">
        {venues.map((venue) => (
          <VenueCard
            venue={venue}
            key={venue.name}
            distanceKm={distances[venue.name]}
            hidden={!visible.has(venue.name)}
            order={orderOf.get(venue.name) ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
