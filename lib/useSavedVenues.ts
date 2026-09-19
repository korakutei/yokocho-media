"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "yokocho-navi:saved";
const listeners = new Set<() => void>();

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    // プライベートブラウズ等でlocalStorageが使えない場合は、保存機能なしとして動作継続する
    return [];
  }
}

function writeSaved(names: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch {
    // 書き込み失敗時も静かに諦める(保存されないだけで、他の機能は使える)
  }
  listeners.forEach((fn) => fn());
}

/**
 * 会員登録なしの保存機能。venue.name をキーに同一端末・同一ブラウザ内(localStorage)へ保存する。
 * モジュールレベルの簡易pub/subで、同じタブ内の複数コンポーネント(カード・詳細・保存一覧)の
 * 表示を即座に同期させる。
 */
export function useSavedVenues() {
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readSaved());
    setReady(true);
    const listener = () => setSaved(readSaved());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const isSaved = useCallback((name: string) => saved.includes(name), [saved]);

  const toggle = useCallback((name: string) => {
    const current = readSaved();
    const next = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];
    writeSaved(next);
  }, []);

  return { saved, isSaved, toggle, ready };
}
