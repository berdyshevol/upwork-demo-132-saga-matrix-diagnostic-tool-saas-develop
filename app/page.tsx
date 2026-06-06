import Link from "next/link";

const dimensions = [
  {
    name: "Leadership",
    color: "from-indigo-500/30 to-indigo-500/5",
    blurb: "Vision, accountability, and decisive ownership of outcomes.",
  },
  {
    name: "Collaboration",
    color: "from-emerald-500/30 to-emerald-500/5",
    blurb: "Surfacing dissent, building trust, and cross-functional investment.",
  },
  {
    name: "Adaptability",
    color: "from-amber-500/30 to-amber-500/5",
    blurb: "Re-planning on new evidence and treating ambiguity as a lab.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <span className="pill">Culture &amp; Leadership Diagnostics</span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Turn a six-question pulse into an{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-300 bg-clip-text text-transparent">
              executive archetype
            </span>
            .
          </h1>
          <p className="max-w-xl text-lg text-white/70">
            The Saga Matrix Diagnostic scores you across Leadership, Collaboration, and
            Adaptability, classifies a leadership archetype, and renders an executive
            dashboard — the full assessment → scoring → reporting loop, live.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/assessment" className="btn-primary">
              Start Assessment →
            </Link>
            <Link href="/dashboard" className="btn-ghost">
              View Executive Dashboard
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/50">
            The three archetypes
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <span className="font-semibold text-saga-builder">Builder</span>
              <span className="text-sm text-white/60">Leadership-dominant</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <span className="font-semibold text-saga-stabilizer">Stabilizer</span>
              <span className="text-sm text-white/60">Collaboration-dominant</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
              <span className="font-semibold text-saga-catalyst">Catalyst</span>
              <span className="text-sm text-white/60">Adaptability-dominant</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {dimensions.map((d) => (
          <div key={d.name} className={`card bg-gradient-to-b ${d.color}`}>
            <h3 className="text-lg font-semibold">{d.name}</h3>
            <p className="mt-2 text-sm text-white/65">{d.blurb}</p>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">How the demo works</h2>
        <ol className="mt-4 grid gap-4 text-sm text-white/70 md:grid-cols-4">
          <li><span className="font-semibold text-white">1. Assess</span><br />Answer six database-driven Likert questions.</li>
          <li><span className="font-semibold text-white">2. Score</span><br />Auto-scored across three dimensions, 0–100.</li>
          <li><span className="font-semibold text-white">3. Classify</span><br />Dominant dimension maps to your archetype.</li>
          <li><span className="font-semibold text-white">4. Report</span><br />Executive dashboard + downloadable PDF.</li>
        </ol>
      </section>
    </div>
  );
}
