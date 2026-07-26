#!/usr/bin/env node
// scripts/export-questions.mjs
// 生成最终导出：JSON、CSV、多维覆盖、人工抽查包

import { loadAllQuestions, loadAllContentCards, MODULE_MAP, ROOT, writeJson, writeText, today } from "./lib/loader.mjs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const questions = await loadAllQuestions();
const cards = await loadAllContentCards();
const active = questions.filter((q) => q.reviewStatus !== "deprecated");
const registry = JSON.parse(await readFile(join(ROOT, "references", "SOURCE_REGISTRY.json"), "utf-8"));
const tierOf = new Map(registry.sources.map((s) => [s.id, s.tier]));

// 1. question-bank.json
await writeJson(join(ROOT, "exports", "question-bank.json"), {
  generatedAt: today(),
  count: active.length,
  questions: active.map((q) => {
    const { __file, ...rest } = q;
    return rest;
  })
});

// 2. question-bank.csv
const csvRows = [
  [
    "id",
    "module",
    "code",
    "subtopic",
    "type",
    "archetype",
    "difficulty",
    "depth",
    "reviewStatus",
    "version",
    "correctAnswers",
    "stem"
  ].join(",")
];
for (const q of active) {
  const code = Object.entries(MODULE_MAP).find(([_, m]) => m.name === q.module)?.[0] || "?";
  const stemSafe = q.stem.replace(/"/g, '""').replace(/\n/g, " ");
  csvRows.push(
    [
      q.id,
      q.module,
      code,
      q.subtopic,
      q.type,
      q.archetype,
      q.difficulty,
      q.depth,
      q.reviewStatus,
      q.version,
      q.correctAnswers.join("|"),
      `"${stemSafe}"`
    ].join(",")
  );
}
await writeText(join(ROOT, "exports", "question-bank.csv"), csvRows.join("\n") + "\n");

// 3. 覆盖矩阵
const moduleCoverage = {};
const typeDist = { single: 0, multiple: 0 };
const difficultyDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
const archetypeDist = {};
const depthDist = {};
const statusDist = { draft: 0, agent_reviewed: 0, human_reviewed: 0, deprecated: 0 };

for (const q of questions) {
  statusDist[q.reviewStatus] = (statusDist[q.reviewStatus] || 0) + 1;
}
for (const q of active) {
  const code = Object.entries(MODULE_MAP).find(([_, m]) => m.name === q.module)?.[0];
  moduleCoverage[code] = moduleCoverage[code] || { code, label: MODULE_MAP[code]?.label, count: 0, expected: MODULE_MAP[code]?.quota };
  moduleCoverage[code].count += 1;
  typeDist[q.type] = (typeDist[q.type] || 0) + 1;
  difficultyDist[q.difficulty] = (difficultyDist[q.difficulty] || 0) + 1;
  archetypeDist[q.archetype] = (archetypeDist[q.archetype] || 0) + 1;
  depthDist[q.depth] = (depthDist[q.depth] || 0) + 1;
}
await writeJson(join(ROOT, "exports", "module-coverage.json"), { generatedAt: today(), moduleCoverage, typeDist, difficultyDist, archetypeDist, depthDist, statusDist });

// 4. 来源覆盖
const sourceUsage = {};
for (const q of active) {
  for (const r of q.sourceRefs) {
    sourceUsage[r.ref] = sourceUsage[r.ref] || { ref: r.ref, tier: tierOf.get(r.ref) || null, questions: 0 };
    sourceUsage[r.ref].questions += 1;
  }
}
await writeJson(join(ROOT, "exports", "source-coverage.json"), { generatedAt: today(), sources: sourceUsage });

// 5. Book / Paper / Framework / Hardware 分类覆盖
const bookCoverage = {};
const paperCoverage = {};
const frameworkCoverage = {};
const hardwareCoverage = {};
for (const s of registry.sources) {
  const used = sourceUsage[s.id]?.questions || 0;
  if (s.type === "book") bookCoverage[s.id] = { title: s.title, used };
  if (s.type === "paper") paperCoverage[s.id] = { title: s.title, used };
}
for (const q of active) {
  const fw = q.softwareContext?.framework;
  if (fw) frameworkCoverage[fw] = (frameworkCoverage[fw] || 0) + 1;
  const vendor = q.hardwareContext?.vendor;
  if (vendor) hardwareCoverage[vendor] = (hardwareCoverage[vendor] || 0) + 1;
}
await writeJson(join(ROOT, "exports", "book-coverage.json"), { generatedAt: today(), coverage: bookCoverage });
await writeJson(join(ROOT, "exports", "paper-coverage.json"), { generatedAt: today(), coverage: paperCoverage });
await writeJson(join(ROOT, "exports", "framework-coverage.json"), { generatedAt: today(), coverage: frameworkCoverage });
await writeJson(join(ROOT, "exports", "hardware-coverage.json"), { generatedAt: today(), coverage: hardwareCoverage });

// 6. review 汇总
const reviewSummary = {
  generatedAt: today(),
  total: active.length,
  byStatus: statusDist,
  byModule: moduleCoverage,
  byType: typeDist,
  byDifficulty: difficultyDist,
  byArchetype: archetypeDist
};
await writeJson(join(ROOT, "exports", "review-summary.json"), reviewSummary);

const rsLines = [
  "# Review Summary",
  "",
  `- Generated: ${reviewSummary.generatedAt}`,
  `- Total non-deprecated: ${reviewSummary.total}`,
  "",
  "## Status",
  "",
  "| Status | Count |",
  "|--------|------:|"
];
for (const [k, v] of Object.entries(statusDist)) rsLines.push(`| ${k} | ${v} |`);
rsLines.push("", "## Module Coverage", "", "| Code | Module | Actual | Expected |", "|------|--------|-------:|---------:|");
for (const [code, mc] of Object.entries(moduleCoverage)) rsLines.push(`| ${code} | ${mc.label} | ${mc.count} | ${mc.expected} |`);
rsLines.push("", "## Question Type Distribution", "", "| Type | Count |", "|------|------:|");
for (const [k, v] of Object.entries(typeDist)) rsLines.push(`| ${k} | ${v} |`);
rsLines.push("", "## Difficulty Distribution", "", "| Level | Count |", "|-------|------:|");
for (const [k, v] of Object.entries(difficultyDist)) rsLines.push(`| L${k} | ${v} |`);
rsLines.push("", "## Archetype Distribution", "", "| Archetype | Count |", "|-----------|------:|");
for (const [k, v] of Object.entries(archetypeDist)) rsLines.push(`| ${k} | ${v} |`);
await writeText(join(ROOT, "exports", "review-summary.md"), rsLines.join("\n") + "\n");

// 7. promotion ledger（读取现有）
const promotionLedgerPath = join(ROOT, "reviews", "promotion-ledger.json");
try {
  const raw = await readFile(promotionLedgerPath, "utf-8");
  await writeJson(join(ROOT, "exports", "promotion-ledger.json"), JSON.parse(raw));
} catch {
  await writeJson(join(ROOT, "exports", "promotion-ledger.json"), { generatedAt: today(), entries: [] });
}

// 8. 人工抽查包
const samplePool = new Set();
// 每模块随机 3 题（这里做确定性采样：按 id 排序取前 3）
const byCode = {};
for (const q of active) {
  const code = Object.entries(MODULE_MAP).find(([_, m]) => m.name === q.module)?.[0];
  byCode[code] = byCode[code] || [];
  byCode[code].push(q);
}
for (const [code, qs] of Object.entries(byCode)) {
  qs.sort((a, b) => a.id.localeCompare(b.id));
  qs.slice(0, 3).forEach((q) => samplePool.add(q.id));
}
// L5 题
for (const q of active) if (q.difficulty === 5) samplePool.add(q.id);
// 论文题
for (const q of active) if (q.archetype === "paper_design_intent") samplePool.add(q.id);
// 版本敏感
for (const q of active) if (q.softwareContext?.stability === "version_sensitive") samplePool.add(q.id);
// 性能数据
for (const q of active) if (q.performanceClaim?.present) samplePool.add(q.id);
// CUDA/Triton 代码题
for (const q of active) if (q.module === "cuda_triton_kernel" && q.archetype === "code_implementation") samplePool.add(q.id);
// 待核验来源
for (const q of active) if ((q.misconceptionTags || []).includes("needs_source_verification")) samplePool.add(q.id);

const humanLines = [
  "# Human Sampling Package",
  "",
  `- Generated: ${today()}`,
  `- Total picks: ${samplePool.size}`,
  "",
  "## Reasons for selection",
  "",
  "- 每模块随机 3 题",
  "- 所有 L5 题",
  "- 所有 paper_design_intent 题",
  "- 所有 version_sensitive 题",
  "- 所有含 performanceClaim 的题",
  "- 所有 CUDA/Triton 代码题",
  "- 所有标记 needs_source_verification 的题",
  "",
  "## Questions to review",
  "",
  "| id | module | difficulty | archetype | reviewStatus |",
  "|----|--------|-----------:|-----------|--------------|"
];
const sortedPicks = [...samplePool].sort();
for (const id of sortedPicks) {
  const q = active.find((x) => x.id === id);
  if (!q) continue;
  humanLines.push(`| ${q.id} | ${q.module} | ${q.difficulty} | ${q.archetype} | ${q.reviewStatus} |`);
}
await writeText(join(ROOT, "exports", "human-sampling-package.md"), humanLines.join("\n") + "\n");

console.log(`Export complete. Active questions: ${active.length}. Human samples: ${samplePool.size}.`);
