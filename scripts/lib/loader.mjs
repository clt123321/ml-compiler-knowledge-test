#!/usr/bin/env node
// scripts/lib/loader.mjs — 共享的加载与工具函数

import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export const MODULE_MAP = {
  A: { name: "arch_perf_model", label: "计算机体系结构与性能模型", quota: 30 },
  B: { name: "compiler_basics", label: "编译器基础与程序分析", quota: 25 },
  C: { name: "graph_tensor_ir", label: "计算图、张量程序与中间表示", quota: 30 },
  D: { name: "pytorch_compiler", label: "PyTorch Compiler 与动态图捕获", quota: 35 },
  E: { name: "mlir_tvm_xla", label: "MLIR / TVM / XLA 与编译器生态", quota: 30 },
  F: { name: "cuda_triton_kernel", label: "CUDA / Triton / GPU Kernel", quota: 40 },
  G: { name: "graph_opt_schedule", label: "图优化 / 循环变换 / 调度 / 自动调优", quota: 30 },
  H: { name: "quantization", label: "数值表示、混合精度与模型量化", quota: 35 },
  I: { name: "core_ops_attention", label: "核心算子、融合 Kernel 与 Attention", quota: 30 },
  J: { name: "llm_inference", label: "LLM 推理优化与生成系统", quota: 30 },
  K: { name: "runtime_deploy", label: "Runtime、模型交换与部署", quota: 30 },
  L: { name: "profiling_debug", label: "Profiling / Benchmark / Debug / 正确性", quota: 30 },
  M: { name: "distributed", label: "分布式、通信编译与异构执行", quota: 15 },
  N: { name: "paper_design", label: "论文设计、系统权衡与研究判断", quota: 10 }
};

export const TOTAL_QUOTA = Object.values(MODULE_MAP).reduce((s, m) => s + m.quota, 0);

export async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

export async function loadJson(path) {
  const raw = await readFile(path, "utf-8");
  return JSON.parse(raw);
}

export async function loadAllQuestions() {
  const questionsRoot = join(ROOT, "data", "questions");
  if (!existsSync(questionsRoot)) return [];
  const files = (await walk(questionsRoot)).filter((f) => f.endsWith(".json"));
  const result = [];
  for (const file of files) {
    try {
      const q = await loadJson(file);
      q.__file = relative(ROOT, file);
      result.push(q);
    } catch (e) {
      throw new Error(`Failed to parse ${file}: ${e.message}`);
    }
  }
  return result;
}

export async function loadAllContentCards() {
  const cardsRoot = join(ROOT, "data", "content-cards");
  if (!existsSync(cardsRoot)) return [];
  const files = (await walk(cardsRoot)).filter((f) => f.endsWith(".json"));
  const cards = new Map();
  for (const file of files) {
    const c = await loadJson(file);
    cards.set(c.questionId, { ...c, __file: relative(ROOT, file) });
  }
  return cards;
}

export function contentHash(question) {
  const stripped = { ...question };
  delete stripped.__file;
  delete stripped.updatedAt;
  delete stripped.version;
  return createHash("sha256").update(JSON.stringify(stripped, orderKeys)).digest("hex");
}

function orderKeys(_key, value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).sort().reduce((acc, k) => {
      acc[k] = value[k];
      return acc;
    }, {});
  }
  return value;
}

export function moduleCodeFromName(name) {
  for (const [code, meta] of Object.entries(MODULE_MAP)) {
    if (meta.name === name) return code;
  }
  return null;
}

export async function ensureDir(path) {
  if (!existsSync(path)) await mkdir(path, { recursive: true });
}

export function pctFormat(n) {
  return `${(n * 100).toFixed(1)}%`;
}

export async function writeJson(path, obj) {
  await ensureDir(dirname(path));
  await writeFile(path, JSON.stringify(obj, null, 2) + "\n", "utf-8");
}

export async function writeText(path, text) {
  await ensureDir(dirname(path));
  await writeFile(path, text, "utf-8");
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
