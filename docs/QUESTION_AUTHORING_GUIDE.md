# QUESTION_AUTHORING_GUIDE.md

面向所有 Generation Agent 的命题指南。**违反者产出会在自动审计与盲审阶段被拒**。

## 1. 内容卡先行

禁止从通用语言模板拼接选项。生成 **每一道题** 之前，必须先写出内容卡（保存到 `data/content-cards/<module>/<id>.json`）：

```json
{
  "learningObjective": "...",
  "canonicalClaims": [
    {
      "claim": "...",
      "conditions": ["..."],
      "nonImplications": ["..."],
      "sourceMappings": [{"ref": "SR-....", "locator": "..."}]
    }
  ],
  "misconceptions": [
    {
      "claim": "...",
      "errorType": "definition_confusion | scope_error | wrong_causal_direction | wrong_condition | overgeneralization | version_leak | hardware_leak | benchmark_leak | performance_confusion",
      "whyWrong": "...",
      "sourceOrEvidence": "..."
    }
  ],
  "implementationFacts": ["..."],
  "performanceScenarios": ["..."],
  "versionSensitivity": "stable_principle | version_sensitive | experimental"
}
```

要求：

* 至少 **1** 个 canonicalClaim（含 conditions 与 sourceMappings）；
* 至少 **3** 个 subtopic-specific misconceptions；
* 正确选项必须由 canonicalClaim 直接生成，禁止改写模板；
* 错误选项必须来自真实 misconceptions，禁止空泛限定语。

## 2. 严禁的选项模式

* 元陈述：如 "上述说法都对"、"以上均正确"、"以上均错误"；
* 无内容答案：如 "视情况而定"、"取决于具体实现"（除非题目**明确要求识别信息不足**且给出具体缺失字段）；
* 空泛限定：如 "在合适的条件下" 而不给条件；
* 只考名称：只让选择者认名字而不考语义。

**信息不足** 类必须写清楚缺什么：

> "无法判断，因为题目未指定 (Shape / dtype / launch grid / warp size / KV cache 长度 / Profiler 指标 / ...)"

## 3. 选项长度门禁

* 正确选项 **不得** 显著长于错误选项；
* 全库范围内：`max_correct_longest_ratio <= 0.25`（同一题中若正确项最长，累计比例不得超过 25%）；
* `max_correct_wrong_average_length_gap <= 0.15`。

如为准确性需要，正确选项长于错误选项时，必须在其他题中平衡。**不得为了等长而破坏技术准确性**。

## 4. 硬件与张量上下文

* 代码题：必须给出 `tensorContext.shapes/dtypes/strides/layouts` + `hardwareContext`；
* IR 题：给出 IR 片段 + `codeSnippet`/`irSnippet` + 假设的 lowering / dialect；
* 性能题：给 profileData 或 benchmark 场景描述 + 硬件要求。

## 5. 版本敏感字段

* `softwareContext.frameworkVersionScope`：例如 "PyTorch 2.3 ~ 2.4"；
* `softwareContext.verifiedAt`：`YYYY-MM-DD`；
* `performanceClaim.hardwareDependent`：布尔。

若无法核验版本 → **保 draft** 并添加 `misconceptionTags: ["needs_source_verification"]`。

## 6. 来源要求

* 每个 **正确项** 必须映射到 `sourceRefs` 中的至少 1 条条目；
* Tier 3（工程博客、开发者讨论）**不能** 单独支撑唯一答案；
* 论文性能数字必须绑定 `performanceClaim.evidenceType = "paper_result"` 且 `sourceRefs` 精确指向该论文。

## 7. 严禁的语义混淆

| 混淆 | 说明 |
|------|------|
| Kernel 加速 ↔ 端到端加速 | 二者必须分开表述 |
| 模型更小 ↔ 更快 | 不能划等号 |
| 精度更低 ↔ 更快 | 需硬件支持 + 对应 Kernel |
| 编译时间省略 | 性能对比必须提及 compile time 是否被忽略 |
| 单篇论文结论 ↔ 领域共识 | 单篇论文的结论必须带 scope |
| Static Cost Model ↔ 真实测量 | 不能等价 |

## 8. 认知题型指引

* `precise_definition`：考精确定义与边界，不考死记名字；
* `concept_boundary`：考"A 是什么、A 不是什么"；
* `formula_performance`：考 Roofline / Arithmetic Intensity / Occupancy 等公式与直觉；
* `ir_transformation`：给出转换前后 IR，判断合法性、语义保持、性能影响；
* `code_implementation`：给出 CUDA/Triton/PyTorch 代码片段，判断行为、bug、shape、边界；
* `performance_diagnosis`：给出 Profiler 数据 / 日志 / 时间线，判断瓶颈；
* `systems_dataflow`：Serving 场景 KV Cache / Batching / Preemption 数据流；
* `paper_design_intent`：考论文引入某设计的动机与权衡。

## 9. 多选正确项数量

* 正确项为 2 项或 3 项；
* 数量基本均衡；
* 不允许固定"3 对 1 错"；
* 每个正确项必须有独立 sourceRefs 条目。

## 10. 题干与选项风格

* 简洁、无口语化冗余；
* 避免"上下文暗示答案"：例如题干使用了正确选项的关键词，导致明显偏向；
* 干扰项必须来自内容卡中的 misconceptions；
* **不得** 使用"下列哪个说法错误"作为唯一区分题干（应少用，且必须让所有 3 个错误项各具明确错误点）。

## 11. 提交格式

```
feat: add module F CUDA and Triton questions
```

commit body：

```
Agent: generation-F
Base: <base-commit>
Files:
- data/questions/F/*.json
- data/content-cards/F/*.json
- manifests/F.json
- handoffs/generation/F.md
```
