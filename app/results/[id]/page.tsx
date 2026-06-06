"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ARCHETYPE_BLURB, DIMENSIONS, type Scores } from "@/lib/scoring";
import { downloadReport } from "@/lib/pdf";

interface Result {
  id: number;
  archetype: string;
  scores: Scores;
}

const ARCHETYPE_COLOR: Record<string, string> = {
  Builder: "text-saga-builder",
  Stabilizer: "text-saga-stabilizer",
  Catalyst: "text-saga-catalyst",
};

export default function ResultsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/assessments/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setResult({ id: data.id, archetype: data.archetype, scores: data.scores });
            setStatus("ready");
          }
          return;
        }
      } catch {
        /* fall through to localStorage */
      }
      // Fallback: the result we stored right after submitting.
      try {
        const cached = localStorage.getItem(`saga-result-${id}`);
        if (cached && active) {
          const data = JSON.parse(cached);
          setResult({ id: data.id, archetype: data.archetype, scores: data.scores });
          setStatus("ready");
          return;
        }
      } catch {
        /* ignore */
      }
      if (active) setStatus("missing");
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return <p className="text-white/60">Scoring your assessment…</p>;
  }

  if (status === "missing" || !result) {
    return (
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <h1 className="text-2xl font-bold">Result not found</h1>
        <p className="text-white/60">We couldn&apos;t find submission #{id}.</p>
        <Link href="/assessment" className="btn-primary">
          Take the assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <span className="pill">Step 2 · Result</span>
        <h1 className="text-3xl font-bold tracking-tight">Your Leadership Archetype</h1>
      </div>

      <div className="card text-center">
        <p className="text-sm uppercase tracking-wide text-white/40">Classified archetype</p>
        <p
          data-testid="archetype-name"
          className={`my-2 text-5xl font-extrabold ${ARCHETYPE_COLOR[result.archetype] ?? "text-white"}`}
        >
          {result.archetype}
        </p>
        <p className="mx-auto max-w-xl text-white/70">{ARCHETYPE_BLURB[result.archetype]}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {DIMENSIONS.map((dim) => (
          <div key={dim} className="card">
            <p className="text-sm text-white/50">{dim}</p>
            <p data-testid={`score-${dim}`} className="mt-1 text-3xl font-bold">
              {result.scores[dim]}
              <span className="text-base font-normal text-white/40"> / 100</span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                style={{ width: `${result.scores[dim]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => downloadReport(result)} className="btn-primary">
          Download PDF
        </button>
        <Link href="/dashboard" className="btn-ghost">
          View Executive Dashboard
        </Link>
        <Link href="/assessment" className="btn-ghost">
          Retake
        </Link>
      </div>
    </div>
  );
}
