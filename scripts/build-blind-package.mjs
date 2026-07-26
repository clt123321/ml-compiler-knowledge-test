#!/usr/bin/env node
// scripts/build-blind-package.mjs
// 生成盲审包：去 correctAnswers / explanation / optionExplanations / distractorRationales / reviewStatus / sourceRefs.supports

import { loadAllQuestions, MODULE_MAP, ROOT, writeJson, today } from "./lib/loader.mjs";
import { join } from "node:path";

const questions = await loadAllQuestions();
const byModuleCode = {};

for (const q of questions) {
  const code = Object.entries(MODULE_MAP).find(([_, m]) => m.name === q.module)?.[0];
  if (!code) continue;
  const blinded = {
    id: q.id,
    type: q.type,
    module: q.module,
    subtopic: q.subtopic,
    learningObjective: q.learningObjective,
    archetype: q.archetype,
    difficulty: q.difficulty,
    depth: q.depth,
    hardwareContext: q.hardwareContext,
    softwareContext: q.softwareContext,
    tensorContext: q.tensorContext,
    stem: q.stem,
    codeSnippet: q.codeSnippet,
    irSnippet: q.irSnippet,
    profileData: q.profileData,
    options: q.options,
    assumptions: q.assumptions,
    version: q.version
  };
  byModuleCode[code] = byModuleCode[code] || [];
  byModuleCode[code].push(blinded);
}

for (const [code, items] of Object.entries(byModuleCode)) {
  const meta = MODULE_MAP[code];
  const pack = {
    module: meta.name,
    code,
    label: meta.label,
    generatedAt: today(),
    count: items.length,
    questions: items
  };
  await writeJson(join(ROOT, "reviews", "blind", `${code}.json`), pack);
}

console.log(`Built blind packages for ${Object.keys(byModuleCode).length} modules.`);
