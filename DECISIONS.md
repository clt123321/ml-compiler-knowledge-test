# DECISIONS.md

记录关键决策与被拒绝的替代方案。

## D-001: 移除 Web 前端

* 日期：2026-07-26
* 决策：本仓库 **不** 实现 React/TypeScript/Vite Web 应用；仅维护题库、审计与引用。
* 理由：用户明确指示题库将并入统一平台仓库，重复实现会造成后续合并冲突。
* 影响：README、PROJECT_SPEC、目录结构与 CI 流水线相应精简，仅保留 Node 脚本与 JSON。
* 被拒替代：完整实现 React 应用后再迁移。

## D-002: 使用 Node ES Module 脚本 (`.mjs`) 而非 TypeScript

* 日期：2026-07-26
* 决策：所有校验 / 审计 / 导出脚本使用纯 Node `.mjs`，只依赖 `node --version >= 20` 内置 API + `Ajv` (可选)。
* 理由：题库并入下游后由下游决定完整工具链；本仓库工具需要最小依赖以易于并入。
* 影响：脚本可直接 `node script.mjs` 运行，不需要构建。
* 被拒替代：完整 TS + Vitest 工程；后续合并会带来重复依赖。

## D-003: Schema 冻结时机

* 日期：2026-07-26
* 决策：`schemas/question.schema.json` 在 Phase 3 末尾冻结；后续 subagent 只可通过 **版本化字段扩展**，不可修改现有约束。
* 理由：避免多 agent 并发修改 Schema 导致语义漂移。
* 影响：生成 agent 必须在冻结后的 Schema 下工作。
* 被拒替代：允许每个模块 agent 微调 Schema。

## D-004: 金丝雀模块选择

* 日期：2026-07-26
* 决策：金丝雀选择 A、C、D、F、L 五个模块各 5 题（共 25 题），覆盖：
  * A（体系结构 / 定量）
  * C（IR 片段）
  * D（PyTorch Compiler 代码日志）
  * F（CUDA/Triton 代码）
  * L（Profiling 诊断）
* 理由：这 5 个模块覆盖了 spec 中所有主要认知题型（定义 / IR / 代码 / 性能诊断 / 数据流 / 论文），能够暴露生成器的最多问题。
* 被拒替代：只做 A/B/C 三个理论模块金丝雀 → 无法验证代码/性能类模板问题。

## D-005: 论文性能数字处理

* 日期：2026-07-26
* 决策：**禁止** 把论文摘要中的性能数字（例如 "2.8× speedup"）直接写成跨平台跨版本的通用结论；只允许作为 `paper_result` 且必须绑定：
  * `performanceClaim.evidenceType = "paper_result"`
  * `sourceRefs` 精确指向该论文
  * 硬件与 Shape 条件
* 被拒替代：把论文数字作为题目正确答案的通用陈述。

## D-006: Verification Agent 独立性

* 日期：2026-07-26
* 决策：Verification Agent **必须** 与生成、Primary Review、Repair 均不同。若资源不足，宁可延迟 Verification，也不放弃独立性。
* 被拒替代：让 Primary Reviewer 兼任 Verification。

## D-007: 版本敏感题的默认处理

* 日期：2026-07-26
* 决策：对 PyTorch 2.x、TorchInductor、vLLM 等版本敏感项：
  * 优先写成 **稳定原则**（stable_principle）；
  * 若必须指涉具体行为，标 `version_sensitive` 并给 `frameworkVersionScope + verifiedAt`；
  * 无法核验版本 → 保 `draft` 并 `needs_source_verification`。
* 被拒替代：默认写成永久事实。

## D-008: Kernel 加速 ≠ 端到端加速

* 日期：2026-07-26
* 决策：任何声称加速的题目必须写清楚：
  * `evidenceType`（analytical / measured / paper_result / none）；
  * 是否 Kernel 级还是 End-to-end；
  * `hardwareDependent`；
  * 若来自论文则 `sourceRefs`。
* 被拒替代：混用 kernel-level 与 end-to-end。

## D-009: 拒绝性能数据伪造

* 日期：2026-07-26
* 决策：本仓库没有 GPU 环境；不得声称任何 Kernel 已在真实硬件验证。所有诊断题的 profile / benchmark 数据必须来自：
  * 公开论文 / 官方文档（附引用）；
  * 明确标注为 **分析型（analytical）** 的合成数据；
  * 不做实测。
* 影响：Kernel 题目的性能诊断以 "根据以下模式推断" 而非 "根据 nsys 输出" 直接判断。
* 被拒替代：伪造 profiling 数字。

## D-010: 主控 human_reviewed 严格禁止

* 日期：2026-07-26
* 决策：所有自动化路径均不得设置 `human_reviewed`；即使全部自动 Verification 通过，也只能升到 `agent_reviewed`。人工抽查包（`exports/human-sampling-package.md`）交由用户 / 领域专家。
* 被拒替代：Verification 通过后自动升 `human_reviewed`。

## D-011: 生成/修订/复核 三权分立

* 日期：2026-07-26
* 决策：三类操作必须来自不同 subagent。若批次生成器 A 生成模块 F，则 F 的 Primary Reviewer 不得为 A；F 的 Repair Agent 不得为 A；F 的 Verifier 不得为 A、不得为 Primary Reviewer、不得为 Repair Agent。
* 被拒替代：同一 agent 一站式。

## D-012: 目录所有权硬约束

* 日期：2026-07-26
* 决策：详见 `AGENTS.md §4`。合并前主控用 `git diff --name-only` 检查越权。
* 被拒替代：靠 agent 自觉。
