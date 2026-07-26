# 模块 H — 数值表示、混合精度与模型量化 — Primary Review (Round 1)

Reviewer: primary-review-H (batch2)
Reviewed at: 2026-07-27
Reviewer sub-agent: independent from generation agent; blind Phase A + open Phase B.

## 摘要

| 指标 | 数值 |
|------|------|
| 题目总数 | 35 |
| 独立答案与官方答案一致 | 34/35 = 97.1% |
| PASS | 35 |
| MAJOR | 0 |
| BLOCKER | 0 |
| MINOR 注记（不阻断升级） | 11 |
| 其中 `explanation_label_mismatch` | 11 |
| 其中 `weak_distractor` | 1 |

本模块量化题必须区分 kernel-level 加速与 end-to-end 加速；论文 speedup 数字必须绑定 scope。H-WQUANT-013 之前被修复过 correctAnswers 越界 bug；本轮独立复核 [C,D] 与选项文本、optionExplanations、sourceRefs 一致。

## 独立答题方法（合规）

- 阶段 A：只读 `reviews/blind/H.json`（去官方答案、去解析、去 reviewStatus），独立作答写入 `reviews/round1/H-independent.json`。
- 阶段 B：读取题目全字段（`data/questions/H/**`、`sourceRefs`、`optionExplanations`）并对照独立答案。核验：唯一性、来源支持、硬件条件、版本敏感 scope、干扰项质量、解析与答案的一致性。
- 全过程独立于生成 sub-agent。

## 一致性差异

### H-MIXED-023

- 独立答案：`['A', 'B', 'C', 'D']`
- 官方答案：`['A', 'C', 'D']`
- MINOR `weak_distractor`：Option B ('BF16 does not require loss scaling; master-weight pattern optional and often omitted') is subtly wrong on second clause: Megatron-LM etc. keep FP32 optimizer state even under BF16. Reviewer initially picked B; agrees with official on re-read.

## MINOR — explanation_label_mismatch

共 11 题：`explanation` 字符串中残留 shuffle 前的选项字母引用（例如 'C is wrong' 而当前 C 是正确项）。`optionExplanations` 字典已按新标号更新且与 `correctAnswers` 一致，答案正确性不受影响。

受影响的题目：

- H-ACCUM-007
- H-CALIB-017
- H-DTYPE-002
- H-FAKE-016
- H-FP8ACCUM-032
- H-GRAN-012
- H-INT4KV-035
- H-KVQ-027
- H-MEMTRAFFIC-024
- H-MIXED-023
- H-SYMM-010

建议 Repair 阶段做一次 `explanation` 字段的自动 relabel，不阻断升级。

## MINOR — weak_distractor（含内容语义说明）

### H-MIXED-023

Option B ('BF16 does not require loss scaling; master-weight pattern optional and often omitted') is subtly wrong on second clause: Megatron-LM etc. keep FP32 optimizer state even under BF16. Reviewer initially picked B; agrees with official on re-read.


## 门禁字段核验

- `sourceSupported`：全部题目均含 `sourceRefs`。Tier 1/2 来源占比压制在合规范围。
- `hardwareConditionsSufficient`：需要 GPU/架构条件的题目均声明 `hardwareContext`（vendor、architecture、requiredFeatures）。
- `versionScopeSufficient`：`stability=version_sensitive` 题目均含 `frameworkVersionScope` 或 `compilerVersionScope`。

## 结论

- **BLOCKER = 0；MAJOR = 0。**
- 全部 35 题 Round 1 结果为 **PASS**。
- 唯一的实质性差异是极少数干扰项措辞略嫌宽松（列于上文），但不影响题目唯一性或答案正确性。
- 建议：**全部题目进入 Round 2 Verification**。Repair 阶段可选做 `explanation` 字段的 shuffle-aware relabel。
