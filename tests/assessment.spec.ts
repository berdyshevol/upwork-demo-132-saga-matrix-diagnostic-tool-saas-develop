import { test, expect, Page } from "@playwright/test";

const ARCHETYPES = ["Builder", "Stabilizer", "Catalyst"];

// Answer every question on /assessment. `byId` maps question id -> Likert value (1-5).
// Any question not in the map defaults to `fallback`.
async function answerAll(page: Page, byId: Record<number, number>, fallback = 3) {
  await page.goto("/assessment");
  // Wait for the DB-driven questions to render.
  const groups = page.getByTestId(/^question-/);
  await expect(groups.first()).toBeVisible();
  const count = await groups.count();
  expect(count).toBe(6);
  for (let qid = 1; qid <= 6; qid++) {
    const value = byId[qid] ?? fallback;
    await page.getByTestId(`answer-${qid}-${value}`).click();
  }
  await page.getByRole("button", { name: /submit assessment/i }).click();
}

// Criterion 1: Completing /assessment returns a scored result with a named archetype at /results/[id].
test("completing the assessment yields a named archetype at /results/[id]", async ({ page }) => {
  await answerAll(page, { 1: 4, 2: 4, 3: 3, 4: 3, 5: 2, 6: 2 });
  await expect(page).toHaveURL(/\/results\/\d+$/);
  const archetype = page.getByTestId("archetype-name");
  await expect(archetype).toBeVisible();
  const text = (await archetype.textContent())?.trim() ?? "";
  expect(ARCHETYPES).toContain(text);
});

// Criterion 2: Dimension scores drive correct archetype classification per documented rules.
test("leadership-dominant answers classify as the Builder archetype", async ({ page }) => {
  // Leadership = q1,q2 (max), everything else minimal -> Builder.
  await answerAll(page, { 1: 5, 2: 5, 3: 1, 4: 1, 5: 1, 6: 1 });
  await expect(page).toHaveURL(/\/results\/\d+$/);
  await expect(page.getByTestId("archetype-name")).toHaveText("Builder");
  // Leadership dimension score should be the highest on the result page.
  await expect(page.getByTestId("score-Leadership")).toContainText("100");
});

test("adaptability-dominant answers classify as the Catalyst archetype", async ({ page }) => {
  // Adaptability = q5,q6 (max) -> Catalyst.
  await answerAll(page, { 1: 1, 2: 1, 3: 1, 4: 1, 5: 5, 6: 5 });
  await expect(page).toHaveURL(/\/results\/\d+$/);
  await expect(page.getByTestId("archetype-name")).toHaveText("Catalyst");
});

// Criterion 3: /dashboard renders radar + bar + trend charts populated from seeded data.
test("dashboard renders radar, bar, and trend charts from seeded data", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /executive dashboard/i })).toBeVisible();
  for (const id of ["chart-radar", "chart-bar", "chart-trend"]) {
    const chart = page.getByTestId(id);
    await expect(chart).toBeVisible();
    await expect(chart.locator("svg.recharts-surface").first()).toBeVisible();
  }
  // Populated from seeded submissions -> a non-zero sample count is shown.
  await expect(page.getByTestId("sample-count")).toContainText(/\d+/);
});

// Criterion 4: The results page produces a downloadable PDF executive report.
test("results page downloads a PDF executive report", async ({ page }) => {
  await answerAll(page, { 1: 4, 2: 5, 3: 3, 4: 2, 5: 4, 6: 3 });
  await expect(page).toHaveURL(/\/results\/\d+$/);
  const downloadButton = page.getByRole("button", { name: /download pdf/i });
  await expect(downloadButton).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    downloadButton.click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});

// Criterion 5: Questions are loaded from the database, not hardcoded in the page.
test("questions are served from the database via the API", async ({ request }) => {
  const res = await request.get("/api/questions");
  expect(res.ok()).toBeTruthy();
  const questions = await res.json();
  expect(Array.isArray(questions)).toBeTruthy();
  expect(questions).toHaveLength(6);
  const dimensions = new Set(questions.map((q: { dimension: string }) => q.dimension));
  expect([...dimensions].sort()).toEqual(["Adaptability", "Collaboration", "Leadership"]);
  for (const q of questions) {
    expect(typeof q.id).toBe("number");
    expect(typeof q.text).toBe("string");
    expect(q.text.length).toBeGreaterThan(0);
  }
});
