#!/usr/bin/env node
// scripts/validate-questions.mjs
// 校验：Schema、模块配额、ID 唯一、单选/多选答案数、选项与解析一致

import { loadAllQuestions, loadAllContentCards, MODULE_MAP, TOTAL_QUOTA, moduleCodeFromName } from "./lib/loader.mjs";
import { validateAgainst } from "./lib/schema.mjs";

const results = { errors: [], warnings: [], ok: 0, byModule: {} };

function err(msg) {
  results.errors.push(msg);
}
function warn(msg) {
  results.warnings.push(msg);
}

const questions = await loadAllQuestions();
const contentCards = await loadAllContentCards();

console.log(`Loaded ${questions.length} questions, ${contentCards.size} content cards.`);

// 1. Schema
for (const q of questions) {
  const errs = await validateAgainst("question", q);
  if (errs.length) {
    err(`${q.__file || q.id}: schema errors:\n  - ${errs.join("\n  - ")}`);
  } else {
    results.ok += 1;
  }
}

// 2. ID 唯一
const idCount = new Map();
for (const q of questions) {
  idCount.set(q.id, (idCount.get(q.id) || 0) + 1);
}
for (const [id, n] of idCount) {
  if (n > 1) err(`Duplicate question id: ${id} (${n} times)`);
}

// 3. ID 前缀与 module 一致
for (const q of questions) {
  const expectedCode = moduleCodeFromName(q.module);
  if (!expectedCode) err(`${q.id}: unknown module '${q.module}'`);
  else if (!q.id.startsWith(`${expectedCode}-`))
    err(`${q.id}: id prefix does not match module '${q.module}' (expected ${expectedCode}-)`);
}

// 4. 单选 / 多选答案数
for (const q of questions) {
  if (q.type === "single" && q.correctAnswers.length !== 1)
    err(`${q.id}: single-type must have exactly 1 correct answer, got ${q.correctAnswers.length}`);
  if (q.type === "multiple") {
    if (q.correctAnswers.length < 2 || q.correctAnswers.length > 3)
      err(`${q.id}: multiple-type must have 2 or 3 correct answers, got ${q.correctAnswers.length}`);
  }
}

// 5. correctAnswers 都存在于 options
for (const q of questions) {
  const opts = new Set(q.options.map((o) => o.id));
  for (const c of q.correctAnswers) {
    if (!opts.has(c)) err(`${q.id}: correctAnswer '${c}' not in options`);
  }
}

// 6. optionExplanations 覆盖所有 option
for (const q of questions) {
  for (const o of q.options) {
    if (!q.optionExplanations || !q.optionExplanations[o.id])
      err(`${q.id}: missing optionExplanation for '${o.id}'`);
  }
}

// 7. sourceRefs 至少 1 条 supports 覆盖正确项
for (const q of questions) {
  const supportedByRefs = new Set();
  for (const r of q.sourceRefs) {
    for (const s of r.supports || []) supportedByRefs.add(s);
  }
  const missingSupport = q.correctAnswers.filter((a) => !supportedByRefs.has(a));
  if (missingSupport.length && q.correctAnswers.length > 0) {
    warn(`${q.id}: correct answer(s) ${missingSupport.join(",")} lack explicit sourceRef.supports`);
  }
}

// 8. 内容卡存在
for (const q of questions) {
  if (!contentCards.has(q.id)) err(`${q.id}: missing content card`);
}

// 9. 内容卡 Schema
for (const [id, c] of contentCards) {
  const errs = await validateAgainst("content-card", c);
  if (errs.length) err(`content-card ${id}: schema errors:\n  - ${errs.join("\n  - ")}`);
}

// 10. 模块配额
const byModuleActive = {};
for (const q of questions) {
  if (q.reviewStatus === "deprecated") continue;
  byModuleActive[q.module] = (byModuleActive[q.module] || 0) + 1;
}
const byCode = {};
for (const [code, meta] of Object.entries(MODULE_MAP)) {
  const actual = byModuleActive[meta.name] || 0;
  byCode[code] = { expected: meta.quota, actual };
  results.byModule[code] = { expected: meta.quota, actual, label: meta.label };
  if (actual !== meta.quota) {
    // 允许 draft 阶段不满，只警告；final 阶段调用者应判断门禁
    warn(`Module ${code} (${meta.name}): expected ${meta.quota}, got ${actual}`);
  }
}
const total = Object.values(byModuleActive).reduce((s, n) => s + n, 0);
results.total = total;
results.totalQuota = TOTAL_QUOTA;

// 11. 版本敏感字段
for (const q of questions) {
  const stab = q.softwareContext?.stability;
  if (stab === "version_sensitive" && !q.softwareContext?.verifiedAt) {
    err(`${q.id}: version_sensitive but missing softwareContext.verifiedAt`);
  }
  if (stab === "version_sensitive" && !q.softwareContext?.frameworkVersionScope && !q.softwareContext?.compilerVersionScope) {
    err(`${q.id}: version_sensitive but missing frameworkVersionScope/compilerVersionScope`);
  }
}

// 12. performanceClaim 一致性
for (const q of questions) {
  const pc = q.performanceClaim;
  if (pc?.present && pc.evidenceType === "none")
    err(`${q.id}: performanceClaim.present=true but evidenceType='none'`);
  if (!pc?.present && pc?.evidenceType && pc.evidenceType !== "none")
    warn(`${q.id}: performanceClaim.present=false but evidenceType='${pc.evidenceType}'`);
}

// 13. code/IR/perf archetype 上下文
for (const q of questions) {
  if (q.archetype === "code_implementation" && !q.codeSnippet)
    err(`${q.id}: code_implementation requires codeSnippet`);
  if (q.archetype === "ir_transformation" && !q.irSnippet)
    err(`${q.id}: ir_transformation requires irSnippet`);
  if (q.archetype === "performance_diagnosis" && !q.profileData && !q.codeSnippet)
    warn(`${q.id}: performance_diagnosis lacks profileData/codeSnippet`);
}

// 输出
console.log("\n=== VALIDATION SUMMARY ===");
console.log(`Total questions (non-deprecated): ${total} / ${TOTAL_QUOTA}`);
for (const [code, { expected, actual }] of Object.entries(byCode)) {
  console.log(`  ${code}: ${actual}/${expected}`);
}
console.log(`Schema OK: ${results.ok}/${questions.length}`);
if (results.warnings.length) {
  console.log(`\nWarnings (${results.warnings.length}):`);
  for (const w of results.warnings) console.log(`  - ${w}`);
}
if (results.errors.length) {
  console.log(`\nErrors (${results.errors.length}):`);
  for (const e of results.errors) console.log(`  - ${e}`);
  process.exit(1);
}

console.log("\nOK");
