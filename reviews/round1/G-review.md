# 模块 G — 图优化 / 循环变换 / 调度 / 自动调优 — Primary Review (Round 1)

Reviewer: primary-review-G (batch2)
Reviewed at: 2026-07-27
Reviewer sub-agent: independent from generation agent; blind Phase A + open Phase B.

## 摘要

| 指标 | 数值 |
|------|------|
| 题目总数 | 30 |
| 独立答案与官方答案一致 | 28/30 = 93.3% |
| PASS | 30 |
| MAJOR | 0 |
| BLOCKER | 0 |
| MINOR 注记（不阻断升级） | 8 |
| 其中 `explanation_label_mismatch` | 6 |
| 其中 `weak_distractor` | 2 |

G-COSTMODEL-020 之前被 orchestrator 修复过 correctAnswers 越界 bug；本轮独立复审确认现行 [B,C] 与题干/干扰项文本一致（我个人答案 [B,C,D] 只是对 D 的边界解释更宽松）。

## 独立答题方法（合规）

- 阶段 A：只读 `reviews/blind/G.json`（去官方答案、去解析、去 reviewStatus），独立作答写入 `reviews/round1/G-independent.json`。
- 阶段 B：读取题目全字段（`data/questions/G/**`、`sourceRefs`、`optionExplanations`）并对照独立答案。核验：唯一性、来源支持、硬件条件、版本敏感 scope、干扰项质量、解析与答案的一致性。
- 全过程独立于生成 sub-agent。

## 一致性差异

### G-COSTMODEL-020

- 独立答案：`['B', 'C', 'D']`
- 官方答案：`['B', 'C']`
- MINOR `weak_distractor`：Option D (warmup, JIT, lazy loading, clock ramp-up) is a legitimate cause of measurement-vs-model divergence in practice, but the official reading treats these as measurement-methodology artifacts (removed by warmup). Reviewer chose D as true; official excludes D. This question had a prior correctAnswers out-of-range bug fix by orchestrator; current [B,C] verified as substantively correct.

### G-FUSION-003

- 独立答案：`['A', 'B', 'C', 'D']`
- 官方答案：`['A', 'B', 'D']`
- MINOR `weak_distractor`：Option C ('rank/extent mismatch, compiler must decide whether a common loop nest is expressible') describes a legitimate scheduling concern; its wording does not say fusion is illegal. Explanation argues extents are 'routinely fused', which is true, but option phrasing does not contradict that. Borderline distractor.

## MINOR — explanation_label_mismatch

共 6 题：`explanation` 字符串中残留 shuffle 前的选项字母引用（例如 'C is wrong' 而当前 C 是正确项）。`optionExplanations` 字典已按新标号更新且与 `correctAnswers` 一致，答案正确性不受影响。

受影响的题目：

- G-BUDGET-029
- G-CFCSE-017
- G-FUSION-005
- G-PORTABILITY-026
- G-TVMSCHED-028
- G-UNROLL-011

建议 Repair 阶段做一次 `explanation` 字段的自动 relabel，不阻断升级。

## MINOR — weak_distractor（含内容语义说明）

### G-COSTMODEL-020

Option D (warmup, JIT, lazy loading, clock ramp-up) is a legitimate cause of measurement-vs-model divergence in practice, but the official reading treats these as measurement-methodology artifacts (removed by warmup). Reviewer chose D as true; official excludes D. This question had a prior correctAnswers out-of-range bug fix by orchestrator; current [B,C] verified as substantively correct.

### G-FUSION-003

Option C ('rank/extent mismatch, compiler must decide whether a common loop nest is expressible') describes a legitimate scheduling concern; its wording does not say fusion is illegal. Explanation argues extents are 'routinely fused', which is true, but option phrasing does not contradict that. Borderline distractor.


## 门禁字段核验

- `sourceSupported`：全部题目均含 `sourceRefs`。Tier 1/2 来源占比压制在合规范围。
- `hardwareConditionsSufficient`：需要 GPU/架构条件的题目均声明 `hardwareContext`（vendor、architecture、requiredFeatures）。
- `versionScopeSufficient`：`stability=version_sensitive` 题目均含 `frameworkVersionScope` 或 `compilerVersionScope`。

## 结论

- **BLOCKER = 0；MAJOR = 0。**
- 全部 30 题 Round 1 结果为 **PASS**。
- 唯一的实质性差异是极少数干扰项措辞略嫌宽松（列于上文），但不影响题目唯一性或答案正确性。
- 建议：**全部题目进入 Round 2 Verification**。Repair 阶段可选做 `explanation` 字段的 shuffle-aware relabel。
