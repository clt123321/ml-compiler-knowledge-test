#!/usr/bin/env node
// scripts/audit-questions.mjs
// 门禁审计：模板、重复、元陈述、长度、答案位置偏差、来源覆盖等

import { loadAllQuestions, loadAllContentCards, MODULE_MAP, writeJson, writeText, ROOT, today } from "./lib/loader.mjs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const auditReport = { generatedAt: today(), gates: {}, stats: {}, issues: [] };
function pushIssue(level, category, msg) {
  auditReport.issues.push({ level, category, msg });
}

const questions = (await loadAllQuestions()).filter((q) => q.reviewStatus !== "deprecated");
const cards = await loadAllContentCards();
const policy = parseYamlLite(await readFile(join(ROOT, "config", "review-policy.yaml"), "utf-8"));

function parseYamlLite(txt) {
  // 简单键值解析，仅用于读取扁平化的门禁数字
  const out = {};
  const path = [];
  const indentStack = [-1];
  const nodeStack = [out];
  for (const rawLine of txt.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const indent = rawLine.match(/^\s*/)[0].length;
    while (indent <= indentStack[indentStack.length - 1] && indentStack.length > 1) {
      indentStack.pop();
      nodeStack.pop();
      path.pop();
    }
    const line = rawLine.trim();
    const m = line.match(/^([\w.-]+):\s*(.*)$/);
    if (m) {
      const [_, key, rest] = m;
      const val = rest === "" ? {} : parseScalar(rest);
      const cur = nodeStack[nodeStack.length - 1];
      cur[key] = val;
      if (rest === "") {
        nodeStack.push(cur[key]);
        indentStack.push(indent);
        path.push(key);
      }
    }
    // 忽略数组元素等复杂情况
  }
  return out;
}
function parseScalar(v) {
  // 处理行尾 # 内联注释；如果是 quoted string，则完整保留引号内内容
  let raw = v;
  const quoted = raw.match(/^(['"])(.*)\1\s*(#.*)?$/);
  if (quoted) return quoted[2];
  const hashAt = raw.indexOf("#");
  if (hashAt >= 0) raw = raw.slice(0, hashAt);
  const t = raw.trim();
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (/^-?\d*\.\d+$/.test(t)) return parseFloat(t);
  if (t === "true") return true;
  if (t === "false") return false;
  return t.replace(/^["']|["']$/g, "");
}

// ---- 1. 重复题干 ----
const stemNorm = (s) =>
  s.replace(/\s+/g, " ").replace(/[，。,.：:；;""'']/g, " ").trim().toLowerCase();
const stemBuckets = new Map();
for (const q of questions) {
  const k = stemNorm(q.stem);
  if (!stemBuckets.has(k)) stemBuckets.set(k, []);
  stemBuckets.get(k).push(q.id);
}
let dupStems = 0;
for (const [k, ids] of stemBuckets) {
  if (ids.length > 1) {
    dupStems += ids.length;
    pushIssue("BLOCKER", "duplicate_stem", `duplicate stems: ${ids.join(", ")}`);
  }
}

// ---- 2. 重复选项集 ----
const optSetKey = (q) =>
  JSON.stringify([...q.options].map((o) => stemNorm(o.text)).sort());
const optBuckets = new Map();
for (const q of questions) {
  const k = optSetKey(q);
  if (!optBuckets.has(k)) optBuckets.set(k, []);
  optBuckets.get(k).push(q.id);
}
let dupOpts = 0;
for (const [k, ids] of optBuckets) {
  if (ids.length > 1) {
    dupOpts += ids.length;
    pushIssue("BLOCKER", "duplicate_option_set", `duplicate option sets: ${ids.join(", ")}`);
  }
}

// ---- 3. 元陈述选项 ----
const metaPatterns = [
  /^以上均对$/i,
  /^以上都对$/i,
  /^以上均正确$/i,
  /^以上都正确$/i,
  /^以上均错误$/i,
  /^以上都错误$/i,
  /^以上都不对$/i,
  /^以上均不对$/i,
  /^以上都不正确$/i,
  /all of the above/i,
  /none of the above/i,
  /^视情况而定$/,
  /^取决于具体实现$/
];
let metaCount = 0;
for (const q of questions) {
  for (const o of q.options) {
    const t = o.text.trim();
    if (metaPatterns.some((p) => p.test(t))) {
      metaCount += 1;
      pushIssue("BLOCKER", "meta_statement_option", `${q.id} option ${o.id}: '${t}'`);
    }
  }
}

// ---- 4. 正确项长度门禁 ----
let correctLongestCount = 0;
let sumCorrectLen = 0,
  sumWrongLen = 0,
  cntC = 0,
  cntW = 0;
for (const q of questions) {
  const lens = q.options.map((o) => ({ id: o.id, len: o.text.length }));
  const maxLen = Math.max(...lens.map((l) => l.len));
  const maxIds = lens.filter((l) => l.len === maxLen).map((l) => l.id);
  const correctAsLongest = maxIds.some((id) => q.correctAnswers.includes(id));
  if (correctAsLongest) correctLongestCount += 1;
  for (const l of lens) {
    if (q.correctAnswers.includes(l.id)) {
      sumCorrectLen += l.len;
      cntC += 1;
    } else {
      sumWrongLen += l.len;
      cntW += 1;
    }
  }
}
const correctLongestRatio =
  questions.length > 0 ? correctLongestCount / questions.length : 0;
const avgCorrect = cntC ? sumCorrectLen / cntC : 0;
const avgWrong = cntW ? sumWrongLen / cntW : 0;
const lenGap = avgCorrect > 0 && avgWrong > 0 ? (avgCorrect - avgWrong) / avgWrong : 0;

const maxCorrectLongestRatio = policy.audit_gates?.max_correct_longest_ratio ?? 0.25;
const maxLenGap = policy.audit_gates?.max_correct_wrong_average_length_gap ?? 0.15;

if (correctLongestRatio > maxCorrectLongestRatio)
  pushIssue(
    "MAJOR",
    "correct_longest_ratio",
    `correct-as-longest ratio ${(correctLongestRatio * 100).toFixed(1)}% > gate ${(maxCorrectLongestRatio * 100).toFixed(1)}%`
  );
if (lenGap > maxLenGap)
  pushIssue(
    "MAJOR",
    "correct_wrong_length_gap",
    `avg-length gap ${(lenGap * 100).toFixed(1)}% > gate ${(maxLenGap * 100).toFixed(1)}%`
  );

// ---- 5. 单选答案位置分布 ----
const posCount = { A: 0, B: 0, C: 0, D: 0 };
let totalSingle = 0;
for (const q of questions) {
  if (q.type !== "single") continue;
  totalSingle += 1;
  const a = q.correctAnswers[0];
  if (a in posCount) posCount[a] += 1;
}
let posBias = 0;
if (totalSingle >= 20) {
  const target = totalSingle / 4;
  const dev = Math.max(...Object.values(posCount).map((n) => Math.abs(n - target) / target));
  posBias = dev;
  if (dev > (policy.audit_gates?.answer_position_bias_max ?? 0.35))
    pushIssue("MAJOR", "answer_position_bias", `single-choice answer position bias ${(dev * 100).toFixed(1)}%`);
}

// ---- 6. 来源覆盖：Tier 3 单独支撑 ----
const registry = JSON.parse(await readFile(join(ROOT, "references", "SOURCE_REGISTRY.json"), "utf-8"));
const tierOf = new Map();
for (const s of registry.sources) tierOf.set(s.id, s.tier);
let tier3OnlyCount = 0;
for (const q of questions) {
  const tiers = q.sourceRefs.map((r) => tierOf.get(r.ref)).filter((t) => t != null);
  if (tiers.length === 0) {
    pushIssue("BLOCKER", "missing_source_registry", `${q.id}: sourceRefs contain unknown ref(s)`);
    continue;
  }
  const hasT12 = tiers.some((t) => t === 1 || t === 2);
  if (!hasT12) {
    tier3OnlyCount += 1;
    pushIssue("BLOCKER", "tier3_only_source", `${q.id}: only Tier 3 sources`);
  }
}

// ---- 7. 内容卡覆盖 ----
let missingCards = 0;
let insufficientMisconceptions = 0;
for (const q of questions) {
  const c = cards.get(q.id);
  if (!c) {
    missingCards += 1;
    pushIssue("BLOCKER", "missing_content_card", q.id);
    continue;
  }
  if ((c.misconceptions || []).length < 3) {
    insufficientMisconceptions += 1;
    pushIssue("MAJOR", "insufficient_misconceptions", `${q.id}: only ${c.misconceptions?.length ?? 0} misconceptions`);
  }
}

// ---- 8. Kernel vs E2E 混淆检测（启发式）----
for (const q of questions) {
  const text = `${q.stem} ${q.options.map((o) => o.text).join(" ")}`;
  if (/kernel.*端到端|end.?to.?end.*kernel/i.test(text)) {
    pushIssue("MAJOR", "kernel_vs_e2e_potential", `${q.id}: potential kernel↔e2e confusion; review manually`);
  }
}

// ---- 9. 认知题型模块覆盖 ----
const coverageMin = policy.coverage_min || {};
const byCodeArche = {};
for (const q of questions) {
  const code = Object.entries(MODULE_MAP).find(([_, m]) => m.name === q.module)?.[0];
  if (!code) continue;
  byCodeArche[code] = byCodeArche[code] || {};
  byCodeArche[code][q.archetype] = (byCodeArche[code][q.archetype] || 0) + 1;
}
for (const [code, req] of Object.entries(coverageMin)) {
  for (const [arche, minN] of Object.entries(req)) {
    const actual = byCodeArche[code]?.[arche] || 0;
    if (actual < minN) {
      pushIssue(
        "MAJOR",
        "coverage_shortfall",
        `Module ${code} archetype ${arche}: ${actual} < required ${minN}`
      );
    }
  }
}

// ---- 汇总门禁 ----
const gates = policy.audit_gates || {};
auditReport.gates = {
  duplicate_stems: { value: dupStems, max: gates.duplicate_stems ?? 0, pass: dupStems <= (gates.duplicate_stems ?? 0) },
  duplicate_option_sets: {
    value: dupOpts,
    max: gates.duplicate_option_sets ?? 0,
    pass: dupOpts <= (gates.duplicate_option_sets ?? 0)
  },
  meta_statement_options: {
    value: metaCount,
    max: gates.meta_statement_options ?? 0,
    pass: metaCount <= (gates.meta_statement_options ?? 0)
  },
  missing_content_cards: {
    value: missingCards,
    max: gates.missing_content_cards ?? 0,
    pass: missingCards <= (gates.missing_content_cards ?? 0)
  },
  missing_subtopic_misconceptions: {
    value: insufficientMisconceptions,
    max: gates.missing_subtopic_misconceptions ?? 0,
    pass: insufficientMisconceptions <= (gates.missing_subtopic_misconceptions ?? 0)
  },
  correct_longest_ratio: {
    value: +correctLongestRatio.toFixed(3),
    max: gates.max_correct_longest_ratio ?? 0.25,
    pass: correctLongestRatio <= (gates.max_correct_longest_ratio ?? 0.25)
  },
  correct_wrong_length_gap: {
    value: +lenGap.toFixed(3),
    max: gates.max_correct_wrong_average_length_gap ?? 0.15,
    pass: lenGap <= (gates.max_correct_wrong_average_length_gap ?? 0.15)
  },
  answer_position_bias: {
    value: +posBias.toFixed(3),
    max: gates.answer_position_bias_max ?? 0.35,
    pass: posBias <= (gates.answer_position_bias_max ?? 0.35)
  },
  tier3_only_sources: { value: tier3OnlyCount, max: 0, pass: tier3OnlyCount === 0 }
};

auditReport.stats = {
  total: questions.length,
  bySingleAnswerPosition: posCount,
  correctLongestCount,
  avgCorrectLen: +avgCorrect.toFixed(2),
  avgWrongLen: +avgWrong.toFixed(2)
};

// 输出
await writeJson(join(ROOT, "exports", "question-audit.json"), auditReport);

const mdLines = [
  "# Question Audit Report",
  "",
  `- Generated: ${auditReport.generatedAt}`,
  `- Total questions (non-deprecated): ${questions.length}`,
  "",
  "## Gates",
  "",
  "| Gate | Value | Max | Pass |",
  "|------|------:|----:|:----:|"
];
for (const [k, v] of Object.entries(auditReport.gates)) {
  mdLines.push(`| ${k} | ${v.value} | ${v.max} | ${v.pass ? "✅" : "❌"} |`);
}
mdLines.push("", "## Issues", "");
if (auditReport.issues.length === 0) mdLines.push("_No issues._");
else {
  const byLevel = { BLOCKER: [], MAJOR: [], MINOR: [] };
  for (const i of auditReport.issues) byLevel[i.level].push(i);
  for (const level of ["BLOCKER", "MAJOR", "MINOR"]) {
    if (byLevel[level].length === 0) continue;
    mdLines.push(`### ${level} (${byLevel[level].length})`, "");
    for (const i of byLevel[level]) mdLines.push(`- [${i.category}] ${i.msg}`);
    mdLines.push("");
  }
}
await writeText(join(ROOT, "exports", "question-audit.md"), mdLines.join("\n") + "\n");

// stdout summary
console.log("=== AUDIT ===");
for (const [k, v] of Object.entries(auditReport.gates)) {
  console.log(`  ${v.pass ? "PASS" : "FAIL"}  ${k}: ${v.value} (max ${v.max})`);
}
const anyFail = Object.values(auditReport.gates).some((g) => !g.pass);
if (anyFail) {
  console.log("\nAudit gates FAILED. See exports/question-audit.md");
  process.exit(1);
}
console.log("\nAudit OK.");
