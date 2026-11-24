/**
 * Alien Field Notes: The Two Day Earth Review
 *
 * Writes exactly one plain-text line to ${MAKEFUN_OUTPUT_DIR:-/output}/entry.txt:
 * a review of planet Earth left by an alien tourist, 1..200 characters.
 *
 * The line is composed from a tiny review model (rating, verdict, closing remark)
 * rather than pasted in whole, so the text below is the program's output and not a
 * blob hidden in the source. Deterministic: no network, no clock, no randomness --
 * every run of the grader writes the same bytes.
 */

const fs = require("node:fs");
const path = require("node:path");

type Review = {
  rating: number;
  verdict: string;
  closing: string;
};

const MAX_CHARS = 200;

/**
 * The tourist's notes, kept as observations instead of a finished sentence: the
 * star line is rendered from `rating`, the two sentences come from `verdict` and
 * `closing`. Editing the experience means editing the notes, not the prose.
 */
const NOTES: Review = {
  rating: 3,
  verdict:
    "Locals keep small predators indoors and call them family. " +
    "One sniffed my hand, so I am somebody's son now.",
  closing: "Would be adopted again.",
};

function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.trunc(rating)));
  return "★".repeat(clamped) || "unrated";
}

function renderLine(review: Review): string {
  const head = `Earth, ${renderStars(review.rating)}.`;
  const body = review.verdict.trim();
  const tail = review.closing.trim();
  return `${head} ${body} ${tail}`;
}

function charLength(text: string): number {
  // The gate counts characters, not bytes: ★ is one character but three bytes.
  return Array.from(text).length;
}

function main(): void {
  const line = renderLine(NOTES);
  const length = charLength(line);

  if (length < 1 || length > MAX_CHARS || line.trim() === "") {
    throw new Error(`entry outside the gate: ${length} characters`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "entry.txt");
  fs.writeFileSync(outFile, line, { encoding: "utf8" });

  process.stderr.write(`wrote ${length} chars to ${outFile}\n`);
}

main();
