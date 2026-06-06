import Database from "better-sqlite3";
import os from "os";
import path from "path";
import { QUESTIONS, SAMPLE_SUBMISSIONS } from "./seed";
import type { Question, Scores } from "./scoring";

export interface SubmissionRow {
  id: number;
  createdAt: string;
  scores: Scores;
  archetype: string;
}

let _db: Database.Database | null = null;

// Use the OS temp dir so this works on Vercel's read-only filesystem (/tmp is writable)
// as well as locally. The DB is re-seeded from code on a cold start, so questions and the
// sample-org history are always available.
function init(): Database.Database {
  const file = path.join(os.tmpdir(), "saga-matrix.db");
  const db = new Database(file);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      dimension TEXT NOT NULL,
      ord INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      createdAt TEXT NOT NULL,
      scores TEXT NOT NULL,
      archetype TEXT NOT NULL,
      seeded INTEGER NOT NULL DEFAULT 0
    );
  `);

  const qCount = (db.prepare("SELECT COUNT(*) AS c FROM questions").get() as { c: number }).c;
  if (qCount === 0) {
    const ins = db.prepare("INSERT INTO questions (id, text, dimension, ord) VALUES (?, ?, ?, ?)");
    QUESTIONS.forEach((q, i) => ins.run(q.id, q.text, q.dimension, i));
  }

  const sCount = (db.prepare("SELECT COUNT(*) AS c FROM submissions").get() as { c: number }).c;
  if (sCount === 0) {
    const ins = db.prepare(
      "INSERT INTO submissions (createdAt, scores, archetype, seeded) VALUES (?, ?, ?, 1)"
    );
    SAMPLE_SUBMISSIONS.forEach((s) => ins.run(s.createdAt, JSON.stringify(s.scores), s.archetype));
  }

  return db;
}

function getDb(): Database.Database {
  if (!_db) _db = init();
  return _db;
}

export function getQuestions(): Question[] {
  const rows = getDb()
    .prepare("SELECT id, text, dimension FROM questions ORDER BY ord ASC")
    .all() as Question[];
  return rows;
}

export function insertSubmission(scores: Scores, archetype: string): number {
  const createdAt = new Date().toISOString();
  const info = getDb()
    .prepare("INSERT INTO submissions (createdAt, scores, archetype, seeded) VALUES (?, ?, ?, 0)")
    .run(createdAt, JSON.stringify(scores), archetype);
  return Number(info.lastInsertRowid);
}

function rowToSubmission(row: {
  id: number;
  createdAt: string;
  scores: string;
  archetype: string;
}): SubmissionRow {
  return {
    id: row.id,
    createdAt: row.createdAt,
    scores: JSON.parse(row.scores) as Scores,
    archetype: row.archetype,
  };
}

export function getSubmission(id: number): SubmissionRow | null {
  const row = getDb()
    .prepare("SELECT id, createdAt, scores, archetype FROM submissions WHERE id = ?")
    .get(id) as { id: number; createdAt: string; scores: string; archetype: string } | undefined;
  return row ? rowToSubmission(row) : null;
}

export function getAllSubmissions(): SubmissionRow[] {
  const rows = getDb()
    .prepare("SELECT id, createdAt, scores, archetype FROM submissions ORDER BY createdAt ASC, id ASC")
    .all() as { id: number; createdAt: string; scores: string; archetype: string }[];
  return rows.map(rowToSubmission);
}
