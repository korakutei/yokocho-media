"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { withBase } from "@/lib/basePath";

const CONTACT_URL = "https://korakutei.github.io/korakutei-site/#contact";

// 「楽しみ方」(特集記事)は対応する記事が実質無いため、記事が揃うまで非表示にする
// (指示書の指示通り)。復活する際はこの配列に追加するだけでよい。
// ニュースは専用ページを作るまで、トップページのニュース欄(#digest)へ案内する。
const NAV_ITEMS: { label: string; href: string; isActive: (pathname: string) => boolean }[] = [
  {
    label: "横丁を探す",
    href: "/#venues",
    isActive: (p) => p === "/",
  },
  {
    label: "ニュース",
    href: "/#digest",
    isActive: () => false,
  },
  {
    label: "ヨコチョナビについて",
    href: "/about",
    isActive: (p) => p === "/about",
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusable && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <Link href="/" className="site-header-logo">
          {/* ロゴ(Pattern C:シンボル+和文ロゴのコンパクト版)。アイボリーの看板地に載せる */}
          <Image
            src={withBase("/images/brand/logo-compact.png")}
            alt="ヨコチョナビ"
            width={600}
            height={177}
            priority
          />
        </Link>

        <nav className="site-header-nav" aria-label="メインメニュー">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.isActive(pathname)
                  ? "site-header-link site-header-link-active"
                  : "site-header-link"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="site-header-menu-button"
          aria-expanded={open}
          aria-controls="site-header-mobile-menu"
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true">☰</span> メニュー
        </button>
      </div>

      {open && (
        <div
          className="site-header-overlay"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        id="site-header-mobile-menu"
        className={open ? "site-header-mobile-menu site-header-mobile-menu-open" : "site-header-mobile-menu"}
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        ref={panelRef}
      >
        <button
          type="button"
          className="site-header-mobile-close"
          onClick={close}
        >
          閉じる ×
        </button>
        <nav aria-label="メインメニュー(モバイル)">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.isActive(pathname)
                  ? "site-header-mobile-link site-header-mobile-link-active"
                  : "site-header-mobile-link"
              }
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-header-mobile-link"
            onClick={close}
          >
            掲載・協業の相談
          </a>
        </nav>
      </div>
    </header>
  );
}
