# AGENTS.md

本文档是 **ML Compiler Knowledge Test** 项目所有 Agent 的宪法。所有自动化产物必须遵循。

## 1. 主控 Agent

* 初始化仓库与远程；
* 固化项目规范（本仓库中的 `PROJECT_SPEC.md`、`docs/*.md`、`config/*.yaml`）；
* 调度 subagent（每个 subagent 对应一个 worktree 或一个独立执行边界）；
* 合并模块提交、审阅越权修改；
* 运行校验、审计、导出脚本；
* 编排金丝雀生成、独立盲审、定向修订、独立复核；
* 管理审核状态字段与升级动作；
* 生成最终导出与人工抽查包；
* 决定推送 GitHub 的时机与方式。

## 2. Subagent 角色

| 角色 | 只可读 | 只可写 | 禁止 |
|------|--------|--------|------|
| **Research** | 官方文档、公开论文、公开教材元信息 | `research/*.md`、`research/*.json`、`references/**` 的候选增量 | 生成正式题目、修改 Schema |
| **Generation-<M>** | 考纲、`research/`、`references/`、`config/` | `data/questions/<M>/`、`data/content-cards/<M>/`、`manifests/<M>.json`、`handoffs/generation/<M>.md` | 修改 Schema、修改其它模块、直接设置 `human_reviewed` |
| **Primary Reviewer-<M>** | `reviews/blind/<M>.json`（去答案盲审包） | `reviews/round1/<M>-independent.json`、`reviews/round1/<M>-review.md/json` | 修改题目文件、看到答案前作答后不得回改 |
| **Global Reviewer** | 全库只读 | `reviews/global/*.md/json` | 修改题目 |
| **Repair-<M>** | 报告点名的题、对应 manifest | 被点名题、对应 manifest、`reviews/resolutions/<M>.json` | 修改未点名题、修改 `learningObjective` 但不记录 |
| **Verification-<M>** | 修订题、Primary PASS 题 | `reviews/round2/<M>-verification.json`、升级 `reviewStatus` 到 `agent_reviewed` | 直接改题、自动升级到 `human_reviewed` |

## 3. Worktree 规则

* 所有写入型 subagent 必须在独立 Git worktree 中执行；
* Worktree 目录：`.worktrees/`（已 `.gitignore`）；
* 分支命名：`agent/<phase>-<module-or-topic>`；
* 完成后必须：
  1. 运行授权范围校验；
  2. 创建提交；
  3. 返回 commit hash；
  4. 写入 `handoffs/` 的对应文件；
  5. **不得自行合并**。
* 主控合并前必须：
  ```bash
  git show --stat <commit>
  git diff <base>..<commit>
  ```
  确认修改范围，越权则拒绝。
* 最多 4 个写入型 subagent 并发。

## 4. 模块目录所有权

| 目录 | 所有者 |
|------|--------|
| `docs/`, `config/`, `schemas/`, `scripts/` | 主控 + Schema Agent（初始化后冻结 Schema） |
| `references/`, `research/` | Research Agent + 主控整合 |
| `data/questions/<M>/`, `data/content-cards/<M>/`, `manifests/<M>.json` | 对应模块的 Generation / Repair Agent |
| `reviews/blind/`, `reviews/round1/`, `reviews/round2/`, `reviews/global/`, `reviews/resolutions/` | 对应 Reviewer / Verifier |
| `exports/` | 主控 |

**禁止跨模块修改。** 违反者的提交将被拒绝合并。

## 5. Git 提交格式

```
research: add compiler and IR source map
feat: add module F CUDA and Triton questions
review: complete module F blind review
repair: resolve module F review findings
verify: verify module F promotion candidates
chore: update STATUS after batch merge
```

签名者字段必须包含 `Agent: <role>`（在 commit body 中）。

## 6. 题目审核状态

```
draft → agent_reviewed → human_reviewed
                       ↘ deprecated
```

* 自动流程最多升级到 `agent_reviewed`。
* `human_reviewed` **只能由人工确认**。
* 每次状态变更必须在 `reviews/promotion-ledger.json` 中留痕，字段：`id`, `from`, `to`, `by`, `at`, `evidence`。

## 7. 测试命令

主控在合并、生成、审阅、导出各关键节点必须运行：

```bash
node scripts/validate-questions.mjs
node scripts/audit-questions.mjs
node scripts/build-blind-package.mjs
node scripts/export-questions.mjs
```

任何一步失败必须阻断后续动作。

## 8. 来源等级

* **Tier 1**：正式出版教材、官方规范、官方编程指南、官方项目设计文档；
* **Tier 2**：原始论文、官方代码/教程、顶级系统或编译会议论文；
* **Tier 3**：高质量课程、综述、开发者讨论、工程博客。

**Tier 3 不能单独支撑唯一标准答案**，仅可作为补充或场景来源。

## 9. 版本敏感字段

框架特定题（PyTorch Compiler、TorchInductor、vLLM、TensorRT-LLM 等）必须记录：

* `softwareContext.frameworkVersionScope` 或 `compilerVersionScope`；
* `softwareContext.verifiedAt`；
* `performanceClaim.hardwareDependent`；
* 如无法核验版本 → 保持 `draft` 并标记 `needs_source_verification`。

## 10. 严禁事项

* **不得** 伪造性能数据、Profiling 输出、Benchmark 数字；
* **不得** 将 Kernel 级加速写成端到端加速；
* **不得** 把「模型更小」直接推断为「必然更快」；
* **不得** 使用「视情况而定」作为无内容答案；
* **不得** 提交凭证、Token、`.env`、私有内部资料、受版权保护的教材全文；
* **不得** 自动设置 `human_reviewed`；
* **不得** 让同一 Agent 同时承担生成、修订、复核；
* **不得** 直接跳过金丝雀审查批量生成 400 题；
* **不得** 在 400 题未生成、未审查时声称完成；
* **不得** 因无 GPU 环境而声称 Kernel 性能已验证。

## 11. 动态软件版本处理

对于 PyTorch 2.x、TorchInductor、vLLM 等演进快的框架，题干必须落在下列两类之一：

1. **稳定原则**（`stability: stable_principle`）：例如 "TorchDynamo 通过 Guard 判断已编译图是否可复用"，跨版本成立；
2. **版本敏感**（`stability: version_sensitive`）：例如 "在 PyTorch 2.3 中，`torch.compile(dynamic=True)` 会 ..."，必须给出 `frameworkVersionScope` 与 `verifiedAt`。

不得把当前实现细节写成永久不变的编译理论。

## 12. 变更管理

* 修改本文件必须在 `DECISIONS.md` 中记录 rationale；
* Schema 冻结后严禁修改；只能通过版本化字段扩展；
* 一切规则变更由主控 Agent 决定并全局广播。
