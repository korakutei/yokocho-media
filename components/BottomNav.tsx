"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "探す", href: "/#venues", match: (p: string) => p === "/" },
  { label: "保存", href: "/saved", match: (p: string) => p === "/saved" },
  { label: "読む", href: "/articles", match: (p: string) => p.startsWith("/articles") },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="モバイル用ナビゲーション">
      {ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={
            item.match(pathname) ? "bottom-nav-item bottom-nav-item-active" : "bottom-nav-item"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
