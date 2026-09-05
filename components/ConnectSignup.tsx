"use client";

import { useState } from "react";

/**
 * 「つながる」の登録UIだけを先に用意したもの。
 * 実際の配信基盤(メール配信サービス/LINE公式アカウント)は未選定のため、
 * 送信しても保存・配信は行わない。準備中である旨だけを正直に表示する。
 */
export default function ConnectSignup() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="pillar-signup-done">
        ありがとうございます。配信の準備が整い次第、こちらでご案内します。
      </p>
    );
  }

  return (
    <form
      className="pillar-signup"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="メールアドレス"
        aria-label="メールアドレス"
        className="pillar-signup-input"
      />
      <button type="submit" className="pillar-signup-button">
        登録する(準備中)
      </button>
    </form>
  );
}
