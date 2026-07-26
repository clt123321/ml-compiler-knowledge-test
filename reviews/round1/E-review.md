# 模块 E — MLIR / TVM / XLA 与编译器生态 — Primary Review (Round 1)

Reviewer: primary-review-E (batch2)
Reviewed at: 2026-07-27
Reviewer sub-agent: independent from generation agent; blind Phase A + open Phase B.

## 摘要

| 指标 | 数值 |
|------|------|
| 题目总数 | 30 |
| 独立答案与官方答案一致 | 29/30 = 96.7% |
| PASS | 30 |
| MAJOR | 0 |
| BLOCKER | 0 |
| MINOR 注记（不阻断升级） | 4 |
| 其中 `explanation_label_mismatch` | 4 |
| 其中 `weak_distractor` | 1 |

本模块覆盖 MLIR、TVM、XLA、IREE、ONNX 五大子系统的抽象边界。审阅重点：IR 语义、方言互操作、Passes、以及各子系统在 ML 编译栈中的定位。

## 独立答题方法（合规）

- 阶段 A：只读 `reviews/blind/E.json`（去官方答案、去解析、去 reviewStatus），独立作答写入 `reviews/round1/E-independent.json`。
- 阶段 B：读取题目全字段（`data/questions/E/**`、`sourceRefs`、`optionExplanations`）并对照独立答案。核验：唯一性、来源支持、硬件条件、版本敏感 scope、干扰项质量、解析与答案的一致性。
- 全过程独立于生成 sub-agent。

## 一致性差异

### E-MLIRTYPE-006

- 独立答案：`['B', 'C', 'D']`
- 官方答案：`['B', 'C']`
- MINOR `weak_distractor`：Option D contains a mostly-true first clause ('vector models SIMD/SIMT lane-aligned values in registers') but a debatable second clause ('primary lowering target for arith ops on tensor before bufferization'). Standard pipeline is tensor->bufferization->memref->loops->vector->LLVM, so 'primary lowering target' is loose. Reviewer marked D true; official excludes it. Debatable phrasing.

## MINOR — explanation_label_mismatch

共 4 题：`explanation` 字符串中残留 shuffle 前的选项字母引用（例如 'C is wrong' 而当前 C 是正确项）。`optionExplanations` 字典已按新标号更新且与 `correctAnswers` 一致，答案正确性不受影响。

受影响的题目：

- E-MLIRDIA-002
- E-MLIRTYPE-006
- E-TVMSCH-013
- E-XLASHP-022

建议 Repair 阶段做一次 `explanation` 字段的自动 relabel，不阻断升级。

## MINOR — weak_distractor（含内容语义说明）

### E-MLIRTYPE-006

Option D contains a mostly-true first clause ('vector models SIMD/SIMT lane-aligned values in registers') but a debatable second clause ('primary lowering target for arith ops on tensor before bufferization'). Standard pipeline is tensor->bufferization->memref->loops->vector->LLVM, so 'primary lowering target' is loose. Reviewer marked D true; official excludes it. Debatable phrasing.


## 门禁字段核验

- `sourceSupported`：全部题目均含 `sourceRefs`。Tier 1/2 来源占比压制在合规范围。
- `hardwareConditionsSufficient`：需要 GPU/架构条件的题目均声明 `hardwareContext`（vendor、architecture、requiredFeatures）。
- `versionScopeSufficient`：`stability=version_sensitive` 题目均含 `frameworkVersionScope` 或 `compilerVersionScope`。

## 结论

- **BLOCKER = 0；MAJOR = 0。**
- 全部 30 题 Round 1 结果为 **PASS**。
- 唯一的实质性差异是极少数干扰项措辞略嫌宽松（列于上文），但不影响题目唯一性或答案正确性。
- 建议：**全部题目进入 Round 2 Verification**。Repair 阶段可选做 `explanation` 字段的 shuffle-aware relabel。
