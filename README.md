# Saga Matrix — Assessment & Archetype Demo

A focused slice of the **Saga Matrix Diagnostic Tool**: take a culture & leadership
assessment, auto-score it across three dimensions, classify a leadership archetype, and
explore an executive dashboard — the full **assessment → scoring → archetype → reporting**
loop, end to end.

## What this demonstrates

- **Database-driven assessment** — six Likert (1–5) questions served from SQLite
  (`better-sqlite3`), not hardcoded in the page.
- **Automated scoring** — answers are scored 0–100 across **Leadership**, **Collaboration**,
  and **Adaptability** in `lib/scoring.ts`.
- **Archetype classification** — the dominant dimension maps to an archetype:
  - Leadership → **Builder**
  - Collaboration → **Stabilizer**
  - Adaptability → **Catalyst**
  - (ties break in that order)
- **Executive dashboard** — radar, bar, and trend charts (Recharts) populated from a seeded
  sample-org history.
- **PDF export** — a downloadable executive report generated client-side with
  `@react-pdf/renderer`.

## Key routes

| Route | What it does |
| --- | --- |
| `/` | Landing + "Start Assessment" |
| `/assessment` | Dynamic, DB-driven question form |
| `/results/[id]` | Archetype + dimension scores + "Download PDF" |
| `/dashboard` | Executive radar / bar / trend charts for the sample org |
| `/api/questions` | `GET` — questions from the database |
| `/api/assessments` | `POST` — submit & score; `GET` — all submissions |
| `/api/assessments/[id]` | `GET` — a single scored submission |

## Tech stack

Next.js (App Router) + TypeScript · Tailwind CSS · Recharts · better-sqlite3 (seeded,
in route handlers with the Node.js runtime) · @react-pdf/renderer.

## Run locally

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

## Tests

Behavioral Playwright tests cover every acceptance criterion (assessment → result,
archetype classification, dashboard charts, PDF export, DB-driven questions).

```bash
pnpm exec playwright install chromium   # once
pnpm test
```

## Build

```bash
pnpm build
```
