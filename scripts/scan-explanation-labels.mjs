#!/usr/bin/env node
// scripts/scan-explanation-labels.mjs
// 扫描 explanation 中的选项字母引用，评估是否与当前 correctAnswers 一致。
// 只报告，不改题。

import { loadAllQuestions, ROOT, writeJson, writeText, today } from "./lib/loader.mjs";
import { join } from "node:path";

const LABEL_RE = /\bOption\s+[ABCD]/g;

function extractLabels(text) {
  const found = new Set();
  const re = /\b(?:Option|Options?)\s+([ABCD])|选项\s*([ABCD])|([ABCD])\s*选项/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    for (const g of [m[1], m[2], m[3]]) if (g) found.add(g);
  }
  return [...found];
}

function contextSnippet(text, idx, width = 100) {
  const start = Math.max(0, idx - width);
  const end = Math.min(text.length, idx + width);
  return (start > 0 ? "…" : "") + text.slice(start, end).replace(/\s+/g, " ") + (end < text.length ? "…" : "");
}

const questions = await loadAllQuestions();
const hits = [];

for (const q of questions) {
  const expl = q.explanation || "";
  const labels = extractLabels(expl);
  if (labels.length === 0) continue;

  const correctSet = new Set(q.correctAnswers);
  // 每个 label 用法：判断它出现的语境是"正面（correct）"还是"负面（wrong）"
  // 启发式：局部窗口内如果含 "correct/right/is true/正确"，判 positive；含 "wrong/incorrect/false/错误" 判 negative
  const re = /(Option|Options?)\s+([ABCD])|选项\s*([ABCD])|([ABCD])\s*选项/g;
  let m;
  const perMatch = [];
  while ((m = re.exec(expl)) !== null) {
    const letter = m[2] || m[3] || m[4];
    const idx = m.index;
    const ctx = contextSnippet(expl, idx, 80);
    // 从 ctx 中判断语境
    const posHit = /\bcorrect\b|is right|正确|CORRECT/i.test(ctx);
    const negHit = /\b(wrong|incorrect|false|is not|misrepresent|misclaim|fabricat|straw)\b|错误|不正确/i.test(ctx);
    const claimSide = posHit && !negHit ? "positive" : negHit && !posHit ? "negative" : "unclear";
    // stale 检测：若 claim positive 但 letter 不在 correctAnswers；或 claim negative 但 letter 在 correctAnswers
    let stale = false;
    if (claimSide === "positive" && !correctSet.has(letter)) stale = true;
    if (claimSide === "negative" && correctSet.has(letter)) stale = true;
    perMatch.push({ letter, claimSide, stale, context: ctx });
  }

  const anyStale = perMatch.some((x) => x.stale);
  const severity = anyStale ? "MAJOR" : (perMatch.some((x) => x.claimSide === "unclear") ? "NOTE" : "NOTE");
  hits.push({
    questionId: q.id,
    file: q.__file,
    module: q.module,
    correctAnswers: q.correctAnswers,
    labelsMentioned: labels,
    matches: perMatch,
    likelyStaleLabel: anyStale,
    severity,
    requiresHumanCheck: severity !== "NOTE" || perMatch.some((x) => x.claimSide === "unclear")
  });
}

// 汇总
const staleCount = hits.filter((h) => h.likelyStaleLabel).length;
const noteCount = hits.filter((h) => !h.likelyStaleLabel).length;

await writeJson(join(ROOT, "reviews", "release", "explanation-label-scan.json"), {
  generatedAt: today(),
  totalHits: hits.length,
  likelyStaleCount: staleCount,
  noteCount,
  hits
});

const mdLines = [
  "# Explanation Label Scan (Release Phase)",
  "",
  `- Generated: ${today()}`,
  `- Total questions with explicit option-letter references in explanation: **${hits.length}**`,
  `- Likely stale (letter reference conflicts with current correctAnswers): **${staleCount}**`,
  `- Note-only (labels consistent with correctAnswers OR unclear stance): **${noteCount}**`,
  "",
  "## Policy",
  "",
  "- 只报告，不批量替换；",
  "- 明确冲突（severity=MAJOR）题目进入人工审查队列，Repair Agent 再逐题修复；",
  "- severity=NOTE 的引用视为可接受的解析行文。",
  "",
  "## Likely Stale Hits (MAJOR)",
  ""
];
if (staleCount === 0) {
  mdLines.push("_None._");
} else {
  mdLines.push("| Question | Module | correctAnswers | Conflicting Letters |");
  mdLines.push("|----------|--------|----------------|---------------------|");
  for (const h of hits.filter((x) => x.likelyStaleLabel)) {
    const conflicting = h.matches.filter((m) => m.stale).map((m) => `${m.letter}(${m.claimSide})`).join(", ");
    mdLines.push(`| ${h.questionId} | ${h.module} | [${h.correctAnswers.join(",")}] | ${conflicting} |`);
  }
}
mdLines.push("", "## NOTE Hits (informational, no action required)", "", `Total: ${noteCount}`, "");
if (noteCount > 0) {
  mdLines.push("| Question | Module | correctAnswers | Labels mentioned |");
  mdLines.push("|----------|--------|----------------|------------------|");
  for (const h of hits.filter((x) => !x.likelyStaleLabel)) {
    mdLines.push(`| ${h.questionId} | ${h.module} | [${h.correctAnswers.join(",")}] | ${h.labelsMentioned.join(",")} |`);
  }
}
await writeText(join(ROOT, "reviews", "release", "explanation-label-scan.md"), mdLines.join("\n") + "\n");

console.log(`Scan complete: ${hits.length} hits, ${staleCount} likely stale, ${noteCount} notes.`);
