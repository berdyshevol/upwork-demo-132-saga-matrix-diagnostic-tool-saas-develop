import { NextRequest, NextResponse } from "next/server";
import { getQuestions, insertSubmission, getAllSubmissions } from "@/lib/db";
import { scoreAssessment, type Answers } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/assessments — submit answers, score them, persist, return the scored result.
export async function POST(req: NextRequest) {
  let body: { answers?: Answers };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const answers = body.answers ?? {};
  const questions = getQuestions();
  const answered = questions.filter((q) => typeof answers[q.id] === "number").length;
  if (answered < questions.length) {
    return NextResponse.json(
      { error: `All ${questions.length} questions must be answered.` },
      { status: 400 }
    );
  }

  const result = scoreAssessment(answers, questions);
  const id = insertSubmission(result.scores, result.archetype);
  return NextResponse.json({ id, ...result }, { status: 201 });
}

// GET /api/assessments — all submissions (seeded + live) for the dashboard.
export async function GET() {
  return NextResponse.json(getAllSubmissions());
}
