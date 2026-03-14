"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [seed, setSeed] = useState(0);
  const question = useQuery(api.questions.getRandomQuestion, { seed });

  function nextQuestion() {
    setSeed((s) => s + 1);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-xl p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Te Reo Duo
        </h1>

        {question === undefined && <p className="text-zinc-500">Loading…</p>}

        {question === null && (
          <p className="text-zinc-500">
            No questions yet. Add some via the Convex dashboard.
          </p>
        )}

        {question && question.type === "multiple_choice" && (
          <div className="space-y-4">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
              {question.prompt}
            </p>
            <ul className="space-y-2">
              {question.options.map((opt, i) => (
                <li key={i}>
                  <button className="w-full text-left px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {question && question.type === "arrange_words" && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 uppercase tracking-wide">
              Arrange the words
            </p>
            <div className="flex flex-wrap gap-2">
              {question.words.map((word, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-800 dark:text-zinc-200 cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-400">
              Answer: {question.correctSentence}
            </p>
          </div>
        )}

        {question && question.type === "match_pairs" && (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500 uppercase tracking-wide">
              Match the pairs
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {question.pairs.map((p, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-900 dark:text-green-200"
                  >
                    {p.teReo}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {question.pairs.map((p, i) => (
                  <Button
                    key={i}
                    className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-200"
                  >
                    {p.english}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={nextQuestion}
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
        >
          Next Question
        </button>
      </main>
    </div>
  );
}
