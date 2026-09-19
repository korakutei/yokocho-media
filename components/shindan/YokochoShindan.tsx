"use client";

import { useEffect, useRef, useState } from "react";
import {
  SHINDAN_QUESTIONS,
  boostTagsFromAnswers,
  getShindanType,
  judgeType,
  matchVenues,
  type ShindanVenue,
} from "@/lib/shindan";
import GuideMovie from "@/components/guide/GuideMovie";
import GuideSays from "@/components/guide/GuideSays";
import { GUIDE_NAME } from "@/lib/guide";
import ShindanResult, { ShindanTypeList } from "./ShindanResult";
import "./shindan.css";

type Step = "intro" | "judging" | "result" | number;

const OPTION_KEYS = ["A", "B", "C", "D"];
/** 選択肢を押してから次の質問へ進むまでの間(選んだ状態を一瞬見せる)。 */
const ADVANCE_DELAY_MS = 220;
/** 最後の回答から結果を出すまで、案内人が横丁を探して歩く間。 */
const JUDGE_DELAY_MS = 1400;

function Lanterns({ answered, current }: { answered: number; current: number | null }) {
  return (
    <ol className="shindan-progress" aria-hidden="true">
      {SHINDAN_QUESTIONS.map((_, i) => (
        <li
          key={i}
          className={
            i === current ? "chochin chochin-current" : i < answered ? "chochin chochin-lit" : "chochin"
          }
        />
      ))}
    </ol>
  );
}

export default function YokochoShindan({ venues }: { venues: ShindanVenue[] }) {
  const [step, setStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<number[]>([]);
  const [pending, setPending] = useState<number | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number>();

  // 画面が切り替わったら先頭へスクロールし、見出しにフォーカスを移す(スクリーンリーダーにも変化を伝える)
  useEffect(() => {
    if (step === "intro") return;
    const root = rootRef.current;
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY - 72;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    root.querySelector<HTMLElement>(".shindan-heading")?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (step !== "judging") return;
    timerRef.current = window.setTimeout(() => setStep("result"), JUDGE_DELAY_MS);
    return () => window.clearTimeout(timerRef.current);
  }, [step]);

  function start() {
    window.clearTimeout(timerRef.current);
    setAnswers([]);
    setPending(null);
    setStep(0);
  }

  function choose(q: number, optionIndex: number) {
    if (pending !== null) return;
    setPending(optionIndex);
    timerRef.current = window.setTimeout(() => {
      const next = [...answers.slice(0, q), optionIndex];
      setAnswers(next);
      setPending(null);
      setStep(q + 1 < SHINDAN_QUESTIONS.length ? q + 1 : "judging");
    }, ADVANCE_DELAY_MS);
  }

  function back(q: number) {
    if (pending !== null) return;
    setStep(q === 0 ? "intro" : q - 1);
  }

  if (step === "result") {
    const type = getShindanType(judgeType(answers))!;
    const matches = matchVenues(type, venues, boostTagsFromAnswers(answers));
    return (
      <section className="shindan" ref={rootRef}>
        <div className="wrap">
          <ShindanResult
            type={type}
            matches={matches}
            kicker="ヨコチョ診断 — 結果"
            actions={
              <button type="button" className="hero-cta hero-cta-secondary" onClick={start}>
                もう一度診断する
              </button>
            }
          />
        </div>
      </section>
    );
  }

  if (step === "judging") {
    return (
      <section className="shindan" ref={rootRef}>
        <div className="wrap">
          <div className="shindan-inner shindan-center shindan-judging">
            <Lanterns answered={SHINDAN_QUESTIONS.length} current={null} />
            <h1 className="shindan-question shindan-heading" tabIndex={-1}>
              あなたの横丁タイプを判定中…
            </h1>
            <GuideSays pose="walk" className="guide-center guide-toko">
              こっちこっち！ きみにぴったりの横丁を探してるよ。
            </GuideSays>
          </div>
        </div>
      </section>
    );
  }

  if (step === "intro") {
    return (
      <section className="shindan" ref={rootRef}>
        <div className="wrap">
          <div className="shindan-inner shindan-center">
            <Lanterns answered={SHINDAN_QUESTIONS.length} current={null} />
            <p className="shindan-eyebrow">Yokocho Shindan</p>
            <h1 className="shindan-title shindan-heading" tabIndex={-1}>
              ヨコチョ診断
            </h1>
            <GuideSays pose="wave" size="lg" className="guide-center shindan-intro-guide">
              こんばんは、案内人の{GUIDE_NAME}だよ。今夜のきみにぴったりの横丁まで、ぼくがごあんないするね！
            </GuideSays>
            <p className="shindan-lede">
              ひとりで止まり木か、仲間とはしご酒か。{SHINDAN_QUESTIONS.length}
              つの質問に答えるだけで、あなたの「横丁タイプ」と、今夜くぐりたい相性のいい横丁がわかります。
            </p>
            <p className="shindan-meta">
              全{SHINDAN_QUESTIONS.length}問 ／ 約1分 ／ 全6タイプ
            </p>
            <button type="button" className="hero-cta shindan-start" onClick={start}>
              診断をはじめる →
            </button>
          </div>
          <div className="shindan-inner shindan-block">
            <h2 className="shindan-block-title">
              案内人と、横丁へ。 <small>Guide Movie</small>
            </h2>
            <GuideMovie />
          </div>
          <div className="shindan-inner shindan-block">
            <h2 className="shindan-block-title">
              6つの横丁タイプ <small>All Types</small>
            </h2>
            <ShindanTypeList />
          </div>
        </div>
      </section>
    );
  }

  const q = step;
  const question = SHINDAN_QUESTIONS[q];
  const selected = pending ?? (answers.length > q ? answers[q] : null);

  return (
    <section className="shindan" ref={rootRef}>
      <div className="wrap">
        <div className="shindan-inner">
          <Lanterns answered={q} current={q} />
          <GuideSays pose="walk" size="sm" className="shindan-question-guide">
            {question.guide}
          </GuideSays>
          <div className="shindan-center">
            <p className="shindan-qnum">
              Q{q + 1} / {SHINDAN_QUESTIONS.length}
            </p>
            <h1 className="shindan-question shindan-heading" tabIndex={-1}>
              {question.text}
            </h1>
          </div>
          <div className="shindan-options" role="group" aria-label={question.text}>
            {question.options.map((option, i) => (
              <button
                type="button"
                key={option.label}
                className={
                  selected === i ? "shindan-option shindan-option-selected" : "shindan-option"
                }
                aria-pressed={selected === i}
                onClick={() => choose(q, i)}
              >
                <span className="shindan-option-key" aria-hidden="true">
                  {OPTION_KEYS[i]}
                </span>
                {option.label}
              </button>
            ))}
          </div>
          <div className="shindan-nav">
            <button type="button" className="shindan-textbutton" onClick={() => back(q)}>
              ← {q === 0 ? "はじめに戻る" : "ひとつ前の質問へ"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
