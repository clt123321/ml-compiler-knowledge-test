# PROJECT_SPEC.md

## 1. 项目定位

**ML Compiler Knowledge Test** 是面向 ML 编译、推理系统、CUDA/Triton Kernel、量化与部署方向的**知识诊断题库工程**。核心产物是：

1. 400 道高质量选择题（14 模块）；
2. 完整的机器学习编译考纲；
3. 命题内容卡与来源登记；
4. 自动化审计与盲审流程；
5. 分阶段的独立盲审、修订、复核流水线；
6. 最终导出与人工抽查包。

本仓库**不包含** Web 前后端；下游平台将统一并入。

## 2. 非目标

* 不做前端 UI 或 Web 应用；
* 不做用户系统、鉴权、数据库；
* 不做在线评测服务；
* 不做题目搜索、推荐、AI 生成实时接口；
* 不做二级评分系统（题库导入下游后由下游负责）。

## 3. 覆盖知识链

```
模型与 PyTorch 程序
→ 图捕获和自动微分
→ 高层计算图 IR
→ 张量和循环级 IR
→ 图优化、算子融合和调度
→ CUDA / Triton / CPU Kernel
→ 低精度和量化
→ Runtime 与内存管理
→ LLM 推理和 Serving
→ Profiling、Debug 与性能验证
```

## 4. 交付物

| 类别 | 路径 |
|------|------|
| 考纲 | `docs/SYLLABUS.md` |
| 命题指南 | `docs/QUESTION_AUTHORING_GUIDE.md` |
| 审阅指南 | `docs/REVIEW_GUIDE.md` |
| 架构决策 | `docs/ARCHITECTURE.md` |
| 来源政策 | `docs/SOURCE_POLICY.md` |
| 学习路径 | `docs/LEARNING_PATH.md` |
| Schema | `schemas/question.schema.json`、`schemas/content-card.schema.json`、`schemas/review.schema.json` |
| 校验脚本 | `scripts/validate-questions.mjs` |
| 审计脚本 | `scripts/audit-questions.mjs` |
| 盲审包脚本 | `scripts/build-blind-package.mjs` |
| 导出脚本 | `scripts/export-questions.mjs` |
| 引用 | `references/{BOOKS,PAPERS,OFFICIAL_DOCS,COURSES,READING_PATHS}.md`、`references/SOURCE_REGISTRY.json`、`references/COVERAGE_MATRIX.md` |
| 配置 | `config/{question-generation,review-policy,source-policy}.yaml` |
| 题目 | `data/questions/<M>/*.json` |
| 内容卡 | `data/content-cards/<M>/*.json` |
| 清单 | `manifests/<M>.json` |
| 审阅 | `reviews/{blind,round1,round2,global,resolutions}/*` |
| 交接 | `handoffs/**` |
| 导出 | `exports/**` |

## 5. 题量与配额（硬性）

`draft + agent_reviewed + human_reviewed` 三态合计 **必须 = 400**：

| 编号 | 模块 | 题数 |
|------|------|------:|
| A | 计算机体系结构与性能模型 | 30 |
| B | 编译器基础与程序分析 | 25 |
| C | 计算图、张量程序与中间表示 | 30 |
| D | PyTorch Compiler 与动态图捕获 | 35 |
| E | MLIR、TVM、XLA 与编译器生态 | 30 |
| F | CUDA、Triton 与 GPU Kernel | 40 |
| G | 图优化、循环变换、调度与自动调优 | 30 |
| H | 数值表示、混合精度与模型量化 | 35 |
| I | 核心算子、融合 Kernel 与 Attention | 30 |
| J | LLM 推理优化与生成系统 | 30 |
| K | Runtime、模型交换与部署 | 30 |
| L | Profiling、Benchmark、Debug 与正确性 | 30 |
| M | 分布式、通信编译与异构执行 | 15 |
| N | 论文设计、系统权衡与研究判断 | 10 |
| **合计** | | **400** |

## 6. 题型分布

### 界面题型

| 题型 | 目标占比 |
|------|--------:|
| `single` | 0.65 |
| `multiple` | 0.35 |

多选正确项 2 或 3 项；每个正确项必须有独立来源映射；不允许固定模式（如始终三对一错）。

### 认知题型

| 认知题型 | 目标占比 |
|--------|--------:|
| `precise_definition` | 0.15 |
| `concept_boundary` | 0.15 |
| `formula_performance` | 0.10 |
| `ir_transformation` | 0.12 |
| `code_implementation` | 0.18 |
| `performance_diagnosis` | 0.18 |
| `systems_dataflow` | 0.07 |
| `paper_design_intent` | 0.05 |

### 难度分布

| 难度 | 占比 |
|------|-----:|
| L1 | 0.15 |
| L2 | 0.30 |
| L3 | 0.30 |
| L4 | 0.20 |
| L5 | 0.05 |

### 深度分布

| 深度 | 占比 |
|------|-----:|
| textbook | 0.30 |
| implementation | 0.40 |
| systems | 0.20 |
| research | 0.10 |

## 7. 工程实战定位（本项目重点）

用户明确要求：**以工程实战为主**。因此：

* PyTorch/TorchInductor 代码题、Graph Break 日志、Recompile 日志类题目占 D 模块 ≥ 10 道；
* CUDA/Triton 代码题占 F 模块 ≥ 12 道，附完整 shape / dtype / stride / device / launch grid / block size / 边界条件；
* Profiling 数据类题目占 L 模块 ≥ 10 道；
* IR 片段类题目占 C 模块 ≥ 5 道；
* 性能数据 / 系统日志诊断题占 A / L / J 模块显著比例。

## 8. 审核门禁

### 金丝雀通过条件

```yaml
BLOCKER: 0
MAJOR: <= 3
独立答案不一致: <= 2
来源不支持: 0
元陈述选项: 0
PASS: >= 15
无跨题系统性模板
```

### 全库审计门禁

```yaml
duplicate_stems: 0
duplicate_option_sets: 0
meta_statement_options: 0
missing_correct_option_source: 0
missing_content_cards: 0
missing_subtopic_misconceptions: 0
max_correct_longest_ratio: 0.25
max_correct_wrong_average_length_gap: 0.15
```

## 9. Schema 冻结

`schemas/question.schema.json` 在阶段二末尾由主控冻结，后续任何 subagent **不得** 修改；只能通过版本化字段扩展。

## 10. 严禁事项

* 伪造性能数据；
* 从摘要直接搬性能数字并跨平台化；
* 用「视情况而定」占位；
* 自动设置 `human_reviewed`；
* 不同 Agent 混合承担生成/审阅/修订/复核；
* 未通过金丝雀审查即批量扩展；
* 提交敏感信息或版权内容。
