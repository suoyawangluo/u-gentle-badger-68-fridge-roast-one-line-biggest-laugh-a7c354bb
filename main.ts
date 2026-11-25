// Fridge Roast: One Line, Biggest Laugh — make.fun entry
// u-gentle-badger-68-fridge-roast-one-line-biggest-laugh-a7c354bb
//
// The entry is a single line (1-200 characters) roasting a smart fridge,
// written to $MAKEFUN_OUTPUT_DIR/entry.txt (or ./output/entry.txt).
// Angle: the fridge put its ice maker behind a paywall — a fresh crack
// aimed at the fridge's app/subscription model, not the obvious
// "orders groceries" or "watches you" lines the judge brief warns against.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast, in two beats: the setup names the absurdity (a paywalled
// ice maker), the turn lands on what "free" still buys you (the light).
const SETUP = "My smart fridge put the ice maker behind a paywall";
const TURN = "the free tier is just the light coming on when I open the door.";

function buildEntry(): string {
  return `${SETUP} \u2014 ${TURN}`;
}

interface GateReport {
  codePoints: number;
  lines: number;
  ok: boolean;
}

function validateEntry(text: string): GateReport {
  const codePoints = [...text].length;
  const lines = text.split("\n").length;
  const ok =
    codePoints >= 1 &&
    codePoints <= 200 &&
    lines === 1 &&
    text.trim().length > 0;
  return { codePoints, lines, ok };
}

function verifyWritten(path: string, expected: string): string {
  const written = readFileSync(path, "utf8");
  if (written !== expected) {
    throw new Error("written entry does not match the built entry");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const entry = buildEntry();
  const report = validateEntry(entry);
  if (!report.ok) {
    throw new Error(
      `entry fails the gate: ${report.codePoints} code points, ${report.lines} lines`,
    );
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha = verifyWritten(outPath, entry);
  console.log(
    `gate passes: ${report.codePoints} code points, ${report.lines} line, sha256 ${sha}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
