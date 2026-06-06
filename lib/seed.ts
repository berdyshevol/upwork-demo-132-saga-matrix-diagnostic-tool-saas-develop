import type { Dimension, Scores } from "./scoring";

export interface SeedQuestion {
  id: number;
  text: string;
  dimension: Dimension;
}

// 6-question Likert assessment (1-5), two questions per dimension.
// Ordered so ids 1-2 = Leadership, 3-4 = Collaboration, 5-6 = Adaptability.
export const QUESTIONS: SeedQuestion[] = [
  {
    id: 1,
    text: "I set a clear vision and hold the team accountable to measurable outcomes.",
    dimension: "Leadership",
  },
  {
    id: 2,
    text: "When priorities conflict, I make decisive calls and own the results.",
    dimension: "Leadership",
  },
  {
    id: 3,
    text: "I actively surface dissenting views before a decision is locked.",
    dimension: "Collaboration",
  },
  {
    id: 4,
    text: "I invest in cross-functional relationships even with no immediate payoff.",
    dimension: "Collaboration",
  },
  {
    id: 5,
    text: "I change course quickly when new evidence contradicts the current plan.",
    dimension: "Adaptability",
  },
  {
    id: 6,
    text: "I treat ambiguity as a chance to experiment rather than a risk to avoid.",
    dimension: "Adaptability",
  },
];

export interface SeedSubmission {
  createdAt: string;
  scores: Scores;
  archetype: string;
}

// Seeded sample-org history so /dashboard has real trend data on first load.
export const SAMPLE_SUBMISSIONS: SeedSubmission[] = [
  { createdAt: "2026-01-14T09:00:00.000Z", scores: { Leadership: 62, Collaboration: 70, Adaptability: 58 }, archetype: "Stabilizer" },
  { createdAt: "2026-02-11T09:00:00.000Z", scores: { Leadership: 68, Collaboration: 66, Adaptability: 64 }, archetype: "Builder" },
  { createdAt: "2026-03-10T09:00:00.000Z", scores: { Leadership: 64, Collaboration: 72, Adaptability: 70 }, archetype: "Stabilizer" },
  { createdAt: "2026-04-08T09:00:00.000Z", scores: { Leadership: 72, Collaboration: 68, Adaptability: 76 }, archetype: "Catalyst" },
  { createdAt: "2026-05-06T09:00:00.000Z", scores: { Leadership: 78, Collaboration: 74, Adaptability: 80 }, archetype: "Catalyst" },
  { createdAt: "2026-06-03T09:00:00.000Z", scores: { Leadership: 82, Collaboration: 79, Adaptability: 77 }, archetype: "Builder" },
];
