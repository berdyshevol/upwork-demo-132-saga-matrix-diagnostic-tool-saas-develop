"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Question } from "@/lib/scoring";

const LIKERT = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data: Question[]) => setQuestions(data))
      .catch(() => setError("Could not load questions."))
      .finally(() => setLoading(false));
  }, []);

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  async function submit() {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const result = await res.json();
      // Persist locally so /results/[id] is robust across serverless cold starts.
      try {
        localStorage.setItem(`saga-result-${result.id}`, JSON.stringify(result));
      } catch {
        /* ignore storage failures */
      }
      router.push(`/results/${result.id}`);
    } catch {
      setError("Something went wrong submitting your assessment. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <span className="pill">Step 1 · Assessment</span>
        <h1 className="text-3xl font-bold tracking-tight">Leadership &amp; Culture Pulse</h1>
        <p className="text-white/65">
          Rate each statement from <strong>Strongly disagree</strong> to{" "}
          <strong>Strongly agree</strong>. Six questions, about a minute.
        </p>
      </div>

      {loading && <p className="text-white/60">Loading questions…</p>}
      {error && <p className="rounded-xl bg-red-500/15 px-4 py-3 text-red-200">{error}</p>}

      <div className="space-y-5">
        {questions.map((q, i) => (
          <fieldset key={q.id} data-testid={`question-${q.id}`} className="card">
            <legend className="mb-3 flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-semibold">
                {i + 1}
              </span>
              <span className="text-base font-medium">{q.text}</span>
            </legend>
            <span className="mb-2 block text-xs uppercase tracking-wide text-white/40">
              {q.dimension}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LIKERT.map((opt) => {
                const selected = answers[q.id] === opt.value;
                return (
                  <label
                    key={opt.value}
                    data-testid={`answer-${q.id}-${opt.value}`}
                    className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center text-xs transition ${
                      selected
                        ? "border-indigo-400 bg-indigo-500/20 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt.value}
                      checked={selected}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.value }))}
                      className="sr-only"
                    />
                    <span className="text-base font-semibold">{opt.value}</span>
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {!loading && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            {Object.keys(answers).length}/{questions.length} answered
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered || submitting}
            className="btn-primary"
          >
            {submitting ? "Scoring…" : "Submit Assessment"}
          </button>
        </div>
      )}
    </div>
  );
}
