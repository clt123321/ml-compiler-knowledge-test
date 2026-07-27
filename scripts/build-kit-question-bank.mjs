#!/usr/bin/env node
// scripts/build-kit-question-bank.mjs
// 为 Knowledge Test Kit 生成兼容的题库导出，不修改源题目。

import { loadAllQuestions, ROOT, today, writeJson } from "./lib/loader.mjs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const registry = JSON.parse(await readFile(join(ROOT, "references", "SOURCE_REGISTRY.json"), "utf-8"));
const sourceMap = new Map(registry.sources.map((source) => [source.id, source]));
const questions = await loadAllQuestions();

const kitQuestions = questions.map((question) => {
  const { __file, ...rest } = question;
  return {
    ...rest,
    stem: augmentPrompt(question.stem, question),
    sourceRefs: (question.sourceRefs || []).map((ref) => normalizeSourceRef(ref)),
  };
});

await writeJson(join(ROOT, "exports", "kit-question-bank.json"), {
  generatedAt: today(),
  count: kitQuestions.length,
  questions: kitQuestions,
});

console.log(`Kit question bank written: exports/kit-question-bank.json (${kitQuestions.length} questions)`);

function normalizeSourceRef(ref) {
  const meta = sourceMap.get(ref.ref) || {};
  const locator = ref.locator ? `${ref.locator}` : null;
  const supports = Array.isArray(ref.supports) && ref.supports.length > 0
    ? `supports ${ref.supports.join(", ")}`
    : null;
  const supportText = [locator, supports].filter(Boolean).join(" · ");

  return {
    title: meta.title || ref.ref,
    type: normalizeSourceType(meta.type),
    tier: normalizeTier(meta.tier),
    url: meta.url,
    supports: supportText || undefined,
  };
}

function normalizeSourceType(type) {
  switch (type) {
    case "book":
      return "book";
    case "paper":
      return "paper";
    case "official_doc":
      return "official_docs";
    default:
      return "other";
  }
}

function normalizeTier(tier) {
  if (tier === 1) return "tier1";
  if (tier === 2) return "tier2";
  if (tier === 3) return "tier3";
  return undefined;
}

function augmentPrompt(stem, question) {
  const sections = [];

  if (question.codeSnippet) {
    sections.push(["Code", fence(detectCodeLanguage(question.codeSnippet), question.codeSnippet)].join("\n\n"));
  }

  if (question.irSnippet) {
    sections.push(["IR", fence("text", question.irSnippet)].join("\n\n"));
  }

  if (question.profileData) {
    sections.push(["Profile", fence("text", question.profileData)].join("\n\n"));
  }

  if (sections.length === 0) {
    return stem;
  }

  return [stem, ...sections].join("\n\n");
}

function detectCodeLanguage(snippet) {
  if (/@triton\.jit|import triton|def\s+\w+\(/.test(snippet)) return "python";
  if (/__global__|threadIdx|blockIdx|cuda/.test(snippet)) return "cpp";
  if (/func @|scf\.for|arith\./.test(snippet)) return "mlir";
  return "text";
}

function fence(language, body) {
  return ["```" + language, body, "```"].join("\n");
}
