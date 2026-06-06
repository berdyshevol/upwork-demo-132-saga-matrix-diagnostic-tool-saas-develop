// Pure scoring + archetype classification for the Saga Matrix assessment.
// Kept dependency-free so it runs identically in route handlers, the client, and tests.

export type Dimension = "Leadership" | "Collaboration" | "Adaptability";

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
}

export type Scores = Record<Dimension, number>;

export type Answers = Record<number, number>; // questionId -> Likert value (1-5)

export interface ScoredResult {
  scores: Scores;
  dominant: Dimension;
  archetype: string;
}

export const DIMENSIONS: Dimension[] = ["Leadership", "Collaboration", "Adaptability"];

// Documented classification rule: the dominant (highest-scoring) dimension maps to an archetype.
// Ties are broken in the fixed DIMENSIONS order above (Leadership > Collaboration > Adaptability).
export const ARCHETYPE_BY_DIMENSION: Record<Dimension, string> = {
  Leadership: "Builder",
  Collaboration: "Stabilizer",
  Adaptability: "Catalyst",
};

export const ARCHETYPE_BLURB: Record<string, string> = {
  Builder:
    "Builders lead from the front — vision-driven, decisive, and outcome-obsessed. They turn ambiguity into roadmaps and hold the bar high.",
  Stabilizer:
    "Stabilizers are the connective tissue of a team — they surface dissent early, invest in trust, and keep collaboration healthy under pressure.",
  Catalyst:
    "Catalysts thrive in motion — they re-plan fast on new evidence and treat ambiguity as a lab. They keep the organization adaptive and curious.",
};

// Convert a 1-5 Likert value to a 0-100 dimension scale.
function toScale(value: number): number {
  return Math.round((value / 5) * 100);
}

export function scoreAssessment(answers: Answers, questions: Question[]): ScoredResult {
  const buckets: Record<Dimension, number[]> = {
    Leadership: [],
    Collaboration: [],
    Adaptability: [],
  };

  for (const q of questions) {
    const raw = answers[q.id];
    if (typeof raw === "number" && raw >= 1 && raw <= 5) {
      buckets[q.dimension].push(raw);
    }
  }

  const scores = {} as Scores;
  for (const dim of DIMENSIONS) {
    const vals = buckets[dim];
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    scores[dim] = toScale(avg);
  }

  let dominant: Dimension = DIMENSIONS[0];
  for (const dim of DIMENSIONS) {
    if (scores[dim] > scores[dominant]) dominant = dim;
  }

  return { scores, dominant, archetype: ARCHETYPE_BY_DIMENSION[dominant] };
}
