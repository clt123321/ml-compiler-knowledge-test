# ML Compiler Knowledge Test

面向 **机器学习编译 / 高性能推理 / CUDA 与 Triton Kernel / 模型部署与量化 / LLM Serving** 方向的知识诊断题库。

本仓库只维护题库、审计工具与知识引用；**不包含前后端 Web 架构**（后续会并入统一仓库集中管理）。

## 目录

```
docs/            # 考纲、命题指南、审阅指南、来源政策
references/     # 书目、论文、官方文档、阅读路径、来源登记
schemas/        # 题目 / 内容卡 / 审阅记录 JSON Schema
scripts/        # 校验、审计、导出、盲审包生成
data/questions/ # 14 个模块的题目 JSON（A ~ N）
data/content-cards/  # 命题内容卡
manifests/      # 每个模块的清单
reviews/        # 盲审、修订、复核记录
handoffs/       # 阶段交接文件
exports/        # 最终导出与人工抽查包
AGENTS.md
PROJECT_SPEC.md
PLAN.md
STATUS.md
DECISIONS.md
worktrees.json
```

## 模块与题量

| 编号 | 模块 | 题数 |
|------|------|------:|
| A | 计算机体系结构与性能模型 | 30 |
| B | 编译器基础与程序分析 | 25 |
| C | 计算图、张量程序与中间表示 | 30 |
| D | PyTorch Compiler 与动态图捕获 | 35 |
| E | MLIR / TVM / XLA 与编译器生态 | 30 |
| F | CUDA / Triton / GPU Kernel | 40 |
| G | 图优化 / 循环变换 / 调度 / 自动调优 | 30 |
| H | 数值表示、混合精度与模型量化 | 35 |
| I | 核心算子、融合 Kernel 与 Attention | 30 |
| J | LLM 推理优化与生成系统 | 30 |
| K | Runtime、模型交换与部署 | 30 |
| L | Profiling、Benchmark、Debug 与正确性 | 30 |
| M | 分布式、通信编译与异构执行 | 15 |
| N | 论文设计、系统权衡与研究判断 | 10 |
| **合计** | | **400** |

## 快速命令

```bash
# 校验题目 Schema、模块配额、ID 唯一
node scripts/validate-questions.mjs

# 全库审计：模板 / 重复 / 元陈述 / 来源 / 长度门禁
node scripts/audit-questions.mjs

# 生成盲审包（去答案 + 去解析）
node scripts/build-blind-package.mjs

# 生成导出包
node scripts/export-questions.mjs
```

## 审核状态

| 状态 | 含义 |
|------|------|
| `draft` | 生成完成，未通过完整 Agent 审查 |
| `agent_reviewed` | 通过 Primary Review 与独立 Verification |
| `human_reviewed` | 由领域专家人工确认（**禁止自动升级**） |
| `deprecated` | 废弃但保留记录 |

自动流程最多升级到 `agent_reviewed`。`human_reviewed` 必须由人工确认。

## 使用与合并

题库与审计工具在本仓库独立完成后，将并入统一的知识测试平台仓库统一部署。当前仓库不包含 Web 应用代码，可以通过：

- `exports/question-bank.json`
- `exports/question-bank.csv`

将题库导入下游平台。

## License

MIT。详见 [LICENSE](LICENSE)。
