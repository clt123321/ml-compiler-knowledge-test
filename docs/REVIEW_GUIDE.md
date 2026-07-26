# REVIEW_GUIDE.md

面向所有 Reviewer / Verifier 的独立盲审指南。

## 1. 独立性要求

* Reviewer 与题目生成 Agent **必须不同**；
* Verifier 与 Reviewer / Repair Agent / 生成 Agent **必须不同**；
* Reviewer 在 **看到答案前** 必须自己完成整题的独立作答，且答案 **不得回改**。

## 2. 输入 / 输出

### Primary Review (Round 1)

* 输入：`reviews/blind/<M>.json`（去答案、去解析、去 reviewStatus 的盲审包）；
* 阶段 A 输出：`reviews/round1/<M>-independent.json`（Reviewer 独立答题）；
* 阶段 B 输出：`reviews/round1/<M>-review.md` + `reviews/round1/<M>-review.json`（对照官方答案 + 来源核验后的结论）。

### Verification (Round 2)

* 输入：修订题 + Primary PASS 题；
* 输出：`reviews/round2/<M>-verification.json`，每题一条记录（见下）。

## 3. 严重等级

| 级别 | 定义 | 处理 |
|------|------|------|
| **BLOCKER** | 关键错误，必须修正才能升级 | 修复；未修复不得升级 |
| **MAJOR** | 明显缺陷，影响题目质量 | 修复；总数 > 3 需要修生成器 |
| **MINOR** | 可接受的表达 / 风格问题 | 可选修复 |
| **PASS** | 无问题 | 可进入 Verification |

### BLOCKER 分类

* 官方答案错误；
* 无法唯一作答（多个合理答案 / 缺失关键信息）；
* 多选遗漏正确项；
* 公式错误；
* IR 语义判断错误；
* CUDA / Triton 代码行为判断错误；
* 来源不支持答案；
* 性能结论缺失决定性条件；
* Benchmark 方法错误；
* 解析与答案冲突。

### MAJOR 分类

* 干扰项过弱；
* 风格泄漏（正确项写法与错误项显著不同）；
* 版本敏感结论未限定；
* 论文结果过度泛化；
* 重要 Shape / dtype / 硬件条件缺失；
* Kernel 加速被写成端到端加速；
* 难度严重虚高；
* 解析遗漏关键边界。

## 4. Round 1 记录格式

```json
{
  "id": "F-CUDA-COALESCE-003",
  "reviewer": "primary-review-F",
  "independentAnswer": ["B"],
  "officialAnswer": ["B"],
  "answerAgreement": true,
  "uniqueAnswerConfidence": "high | medium | low",
  "sourceSupported": true,
  "hardwareConditionsSufficient": true,
  "versionScopeSufficient": true,
  "issues": [
    {"level": "MINOR", "type": "style", "note": "..."}
  ],
  "overallResult": "PASS"
}
```

## 5. Round 2（Verification）记录格式

```json
{
  "id": "F-CUDA-COALESCE-003",
  "verifier": "verifier-F",
  "independentAnswer": ["B"],
  "officialAnswer": ["B"],
  "answerAgreement": true,
  "uniqueAnswer": true,
  "sourceSupported": true,
  "hardwareConditionsSufficient": true,
  "versionScopeSufficient": true,
  "openBlocker": false,
  "openMajor": false,
  "verificationResult": "PASS"
}
```

满足 Round 1 & Round 2 双 PASS + 门禁字段全 true 的题：升级 `reviewStatus = "agent_reviewed"`。

## 6. 全局对抗审阅（Global Reviewer）

四位专项 Reviewer，只读，不改题：

* **G1 Compiler Semantics** — SSA / CFG / IR / Lowering / Semantic Preservation / MLIR、TVM、XLA 边界；
* **G2 GPU Performance** — CUDA / Triton / memory access / occupancy / benchmark / kernel correctness / Profiling 解释；
* **G3 PyTorch & Runtime** — TorchDynamo / AOTAutograd / Inductor / export / graph break / runtime / version sensitivity；
* **G4 Quantization & LLM Inference** — dtype / quantization / KV Cache / attention / serving / distributed / 性能结论边界。

输出：`reviews/global/*.md` + `reviews/global/*.json`。**不修改题目**。

## 7. Repair 责任分离

* Repair Agent **不得** 是原生成 Agent、Primary Reviewer、Verifier；
* 每次修改：`version += 1`、`updatedAt = today`、`reviewStatus = "draft"`；
* 记录到 `reviews/resolutions/<M>.json`：

```json
{
  "id": "F-CUDA-COALESCE-003",
  "finding": "BLOCKER: shape 未指定 stride",
  "resolution": "add strides to tensorContext",
  "diff": ["tensorContext.strides"],
  "priorVersion": 1,
  "newVersion": 2
}
```

* **不得** 修改未点名的 PASS 题；
* **不得** 静默改变 `learningObjective`。

## 8. 全局一致性最后检查

主控最终导出前用：

```bash
node scripts/audit-questions.mjs
```

跑完整门禁。任一项未过 → 阻断。
