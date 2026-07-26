# ARCHITECTURE.md

## 1. 组件

```
┌─────────────────────────────────────────────────────────────────┐
│                      主控 (Orchestrator)                        │
│  · 调度 subagent                                                 │
│  · 合并 / 审查 / 门禁                                            │
│  · Schema 冻结 / 版本                                            │
│  · 推送 GitHub                                                   │
└─────────────────────────────────────────────────────────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────────┐
│ Research  │  │ Generate  │  │ Reviewer  │  │ Verifier     │
│ subagent  │  │ subagent  │  │ subagent  │  │ subagent     │
│ (worktree)│  │ (worktree)│  │ (worktree)│  │ (worktree)   │
└───────────┘  └───────────┘  └───────────┘  └──────────────┘
      │              │              │              │
      ▼              ▼              ▼              ▼
   references/    data/questions/  reviews/     reviews/round2/
```

## 2. 数据流

```
docs/SYLLABUS.md  ─────────────────────────────────►  Generation
config/*.yaml     ─────────────────────────────────►  Generation / Review / Audit
references/*      ─────────────────────────────────►  Generation / Review / Audit
                                                      │
                                                      ▼
                                data/content-cards/<M>/*.json
                                data/questions/<M>/*.json
                                manifests/<M>.json
                                                      │
                                                      ▼
                    scripts/validate-questions.mjs
                    scripts/audit-questions.mjs
                    scripts/build-blind-package.mjs
                                                      │
                                                      ▼
                            reviews/blind/<M>.json
                                                      │
                                                      ▼
                            reviews/round1/<M>-independent.json
                            reviews/round1/<M>-review.json
                                                      │
                                                      ▼
                             reviews/global/*
                                                      │
                                                      ▼
                     reviews/resolutions/<M>.json  (Repair)
                                                      │
                                                      ▼
                    reviews/round2/<M>-verification.json (Verify)
                                                      │
                                                      ▼
                    reviews/promotion-ledger.json  →  agent_reviewed
                                                      │
                                                      ▼
                            scripts/export-questions.mjs
                                                      │
                                                      ▼
                                    exports/**
```

## 3. Schema 层次

* **Question Schema** (`schemas/question.schema.json`)：单题结构；
* **Content Card Schema** (`schemas/content-card.schema.json`)：命题内容卡；
* **Review Schema** (`schemas/review.schema.json`)：Round 1 / Round 2 记录；
* **Manifest Schema** (`schemas/manifest.schema.json`)：模块清单。

Schema 冻结后只允许向后兼容扩展。

## 4. 目录约束

见 `AGENTS.md §4`。

## 5. 幂等与哈希

`scripts/audit-questions.mjs` 为每题计算 `contentHash`；Repair 修改后必须变化。**未修改 PASS 题的 contentHash 必须保持不变**，否则算越权。

## 6. Runtime 依赖

* Node.js ≥ 20（内置 fetch、`node:test`）；
* 无外部 npm 依赖（若必须，只允许 `ajv` 校验 Schema）；
* `jq` 可选。

## 7. GitHub Actions（题库层最小）

* `ci`：安装 → 校验 → 审计 → 导出（不构建 Web）；
* Pages 部署由下游统一仓库负责，本仓库不部署 Pages。
