"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { DIMENSIONS, type Dimension, type Scores } from "@/lib/scoring";

interface Submission {
  id: number;
  createdAt: string;
  scores: Scores;
  archetype: string;
}

function average(submissions: Submission[]): Scores {
  const base: Scores = { Leadership: 0, Collaboration: 0, Adaptability: 0 };
  if (submissions.length === 0) return base;
  for (const s of submissions) {
    for (const dim of DIMENSIONS) base[dim] += s.scores[dim];
  }
  for (const dim of DIMENSIONS) base[dim] = Math.round(base[dim] / submissions.length);
  return base;
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assessments")
      .then((r) => r.json())
      .then((data: Submission[]) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  const avg = average(submissions);
  const radarData = DIMENSIONS.map((dim: Dimension) => ({ dimension: dim, score: avg[dim] }));
  const barData = radarData;
  const trendData = submissions.map((s) => ({
    date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short" }),
    Leadership: s.scores.Leadership,
    Collaboration: s.scores.Collaboration,
    Adaptability: s.scores.Adaptability,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <span className="pill">Sample Org · Northwind Labs</span>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-white/65">
            Aggregated culture &amp; leadership signal across{" "}
            <span data-testid="sample-count" className="font-semibold text-white">
              {submissions.length}
            </span>{" "}
            assessments.
          </p>
        </div>
        <Link href="/assessment" className="btn-primary">
          Add an assessment
        </Link>
      </div>

      {loading ? (
        <p className="text-white/60">Loading dashboard…</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card" data-testid="chart-radar">
              <h2 className="mb-4 text-lg font-semibold">Dimension Balance (avg)</h2>
              <RadarChart width={460} height={320} data={radarData} className="mx-auto">
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                <Tooltip />
              </RadarChart>
            </div>

            <div className="card" data-testid="chart-bar">
              <h2 className="mb-4 text-lg font-semibold">Average Scores by Dimension</h2>
              <BarChart width={460} height={320} data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                <XAxis dataKey="dimension" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </div>
          </div>

          <div className="card" data-testid="chart-trend">
            <h2 className="mb-4 text-lg font-semibold">Trend Over Time</h2>
            <LineChart width={960} height={320} data={trendData} className="max-w-full">
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
              <XAxis dataKey="date" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Leadership" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="Collaboration" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Adaptability" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </div>
        </>
      )}
    </div>
  );
}
