# 模块 F — CUDA / Triton / GPU Kernel — Primary Review (Round 1)

Reviewer: primary-review-F (batch2)
Reviewed at: 2026-07-27
Reviewer sub-agent: independent from generation agent; blind Phase A + open Phase B.

## 摘要

| 指标 | 数值 |
|------|------|
| 题目总数 | 40 |
| 独立答案与官方答案一致 | 40/40 = 100.0% |
| PASS | 40 |
| MAJOR | 0 |
| BLOCKER | 0 |
| MINOR 注记（不阻断升级） | 7 |
| 其中 `explanation_label_mismatch` | 7 |
| 其中 `weak_distractor` | 0 |

本模块含大量代码题（CUDA 与 Triton 各占约一半）。审阅重点：shape / stride / mask / launch grid / boundary、性能条件（架构版本、accumulator dtype、compute vs bandwidth）。

## 独立答题方法（合规）

- 阶段 A：只读 `reviews/blind/F.json`（去官方答案、去解析、去 reviewStatus），独立作答写入 `reviews/round1/F-independent.json`。
- 阶段 B：读取题目全字段（`data/questions/F/**`、`sourceRefs`、`optionExplanations`）并对照独立答案。核验：唯一性、来源支持、硬件条件、版本敏感 scope、干扰项质量、解析与答案的一致性。
- 全过程独立于生成 sub-agent。

## 一致性差异

所有 40 题独立答案与官方答案一致。

## MINOR — explanation_label_mismatch

共 7 题：`explanation` 字符串中残留 shuffle 前的选项字母引用（例如 'C is wrong' 而当前 C 是正确项）。`optionExplanations` 字典已按新标号更新且与 `correctAnswers` 一致，答案正确性不受影响。

受影响的题目：

- F-BENCH-039
- F-DIVERGE-029
- F-FLASHATTN-023
- F-GEMMFP16-015
- F-LN-020
- F-SOFTMAX-019
- F-STREAM-026

建议 Repair 阶段做一次 `explanation` 字段的自动 relabel，不阻断升级。

## MINOR — weak_distractor（含内容语义说明）

无。

## 门禁字段核验

- `sourceSupported`：全部题目均含 `sourceRefs`。Tier 1/2 来源占比压制在合规范围。
- `hardwareConditionsSufficient`：需要 GPU/架构条件的题目均声明 `hardwareContext`（vendor、architecture、requiredFeatures）。
- `versionScopeSufficient`：`stability=version_sensitive` 题目均含 `frameworkVersionScope` 或 `compilerVersionScope`。

## 结论

- **BLOCKER = 0；MAJOR = 0。**
- 全部 40 题 Round 1 结果为 **PASS**。
- 唯一的实质性差异是极少数干扰项措辞略嫌宽松（列于上文），但不影响题目唯一性或答案正确性。
- 建议：**全部题目进入 Round 2 Verification**。Repair 阶段可选做 `explanation` 字段的 shuffle-aware relabel。
