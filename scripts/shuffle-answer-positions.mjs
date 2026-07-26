#!/usr/bin/env node
// scripts/shuffle-answer-positions.mjs
// 机械地将每道题的选项位置打乱到均衡分布。不改内容，只改 A/B/C/D 标号与 correctAnswers/optionExplanations 键。
// 目的：解决 batch generation 产生的 answer_position_bias。

import { readFile, writeFile } from "node:fs/promises";
import { loadAllQuestions, ROOT } from "./lib/loader.mjs";
import { join } from "node:path";

// 目标位置分布：给单选题按 id 序号的哈希均匀分配到 A/B/C/D
function targetPositionForSingle(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return "ABCD"[(h % 4 + 4) % 4];
}

// 对 4 项选项做确定性的置换，使正确项落到 target。
// 单选：只需要把当前正确项与 target 位置的选项互换
// 多选：为均衡多选正确项位置，只对错误项做一次循环右移（保持正确项集合不变但重新排列在 A/B/C/D 上）
function shuffleQuestion(q) {
  const originalIds = ["A", "B", "C", "D"];
  const optsByLetter = {};
  const explByLetter = {};
  const distByLetter = {};
  for (const o of q.options) optsByLetter[o.id] = o.text;
  for (const [k, v] of Object.entries(q.optionExplanations || {})) explByLetter[k] = v;
  for (const [k, v] of Object.entries(q.distractorRationales || {})) distByLetter[k] = v;

  if (q.type === "single") {
    const cur = q.correctAnswers[0];
    const target = targetPositionForSingle(q.id);
    if (cur === target) return false;
    // swap cur <-> target
    const tmp = optsByLetter[cur];
    optsByLetter[cur] = optsByLetter[target];
    optsByLetter[target] = tmp;
    const tmpE = explByLetter[cur];
    explByLetter[cur] = explByLetter[target];
    explByLetter[target] = tmpE;
    // distractorRationales：cur 原本不在 → 现在 target 位置改为原 cur 位置的干扰项说明（若有）
    // 简化处理：整体交换
    const tmpD = distByLetter[cur];
    distByLetter[cur] = distByLetter[target];
    distByLetter[target] = tmpD;
    // sourceRefs.supports 中的 letter 需要同步替换
    q.sourceRefs = q.sourceRefs.map((r) => {
      if (!r.supports) return r;
      const remapped = r.supports.map((s) => (s === cur ? target : s === target ? cur : s));
      return { ...r, supports: remapped };
    });
    q.correctAnswers = [target];
    // rebuild options
    q.options = originalIds.map((id) => ({ id, text: optsByLetter[id] }));
    q.optionExplanations = {};
    for (const id of originalIds) q.optionExplanations[id] = explByLetter[id];
    if (q.distractorRationales) {
      const nd = {};
      for (const id of originalIds) if (distByLetter[id] != null) nd[id] = distByLetter[id];
      q.distractorRationales = nd;
    }
    return true;
  }

  if (q.type === "multiple") {
    // 对 multiple 采用简单的确定性循环左移：根据 id 哈希决定移位 k（0..3）
    let h = 0;
    for (let i = 0; i < q.id.length; i++) h = ((h << 5) - h + q.id.charCodeAt(i)) | 0;
    const shift = (h % 4 + 4) % 4;
    if (shift === 0) return false;
    const remap = {}; // 新位置 -> 旧位置
    for (let i = 0; i < 4; i++) remap[originalIds[i]] = originalIds[(i + shift) % 4];
    const newOpts = originalIds.map((id) => ({ id, text: optsByLetter[remap[id]] }));
    const newExpl = {};
    for (const id of originalIds) newExpl[id] = explByLetter[remap[id]];
    const newDist = {};
    for (const id of originalIds) if (distByLetter[remap[id]] != null) newDist[id] = distByLetter[remap[id]];
    // correctAnswers 集合按反向映射
    const invRemap = {};
    for (const [nk, ok] of Object.entries(remap)) invRemap[ok] = nk;
    const newCorrect = q.correctAnswers.map((c) => invRemap[c]).sort();
    // sourceRefs.supports 同步
    q.sourceRefs = q.sourceRefs.map((r) => {
      if (!r.supports) return r;
      const remapped = r.supports.map((s) => invRemap[s] || s).sort();
      return { ...r, supports: remapped };
    });
    q.options = newOpts;
    q.optionExplanations = newExpl;
    if (q.distractorRationales && Object.keys(newDist).length) q.distractorRationales = newDist;
    q.correctAnswers = newCorrect;
    return true;
  }
  return false;
}

const questions = await loadAllQuestions();
let changed = 0;
for (const q of questions) {
  if (shuffleQuestion(q)) {
    q.updatedAt = "2026-07-26";
    // 内容未变；version 保持不变（位置移动不构成内容变更）
    const file = q.__file;
    delete q.__file;
    await writeFile(join(ROOT, file), JSON.stringify(q, null, 2) + "\n", "utf-8");
    changed += 1;
  }
}
console.log(`Shuffled ${changed}/${questions.length} questions.`);
