# Knowledge Test Kit Integration

本文档说明 **ml-compiler-knowledge-test** 题库如何接入 **knowledge-test-kit**（下游统一 Web 应用脚手架）。

**本仓库不复制、不开发前端；只提供题库、Schema、审阅记录与配置。**

## 1. 题库目录

| 路径 | 内容 |
|------|------|
| `data/questions/{A..N}/*.json` | 400 道题目 |
| `data/content-cards/{A..N}/*.json` | 400 份命题内容卡 |
| `manifests/{A..N}.json` | 每模块清单（含 version、reviewStatus） |

## 2. Schema

| Schema | 路径 |
|--------|------|
| Question | `schemas/question.schema.json` |
| Content Card | `schemas/content-card.schema.json` |
| Review Record | `schemas/review.schema.json` |
| Manifest | `schemas/manifest.schema.json` |

Schema 已在 Phase 3 冻结；后续下游只能通过版本化字段扩展。

## 3. reviewStatus 语义

| 状态 | 含义 | 下游默认可见 |
|------|------|:-----------:|
| `draft` | 生成完成但未通过完整 Agent 审查 | 仅开发预览 |
| `agent_reviewed` | Round 1 + Round 2 双 PASS + 所有门禁字段为 true | ✅ 正式考试 / 练习 |
| `human_reviewed` | 人工确认 | ✅ 正式考试 / 练习 |
| `deprecated` | 废弃但保留记录 | ❌ |

**自动流程只能升级到 `agent_reviewed`**；`human_reviewed` 必须由人工确认。

## 4. 参考资料目录

`references/` 已沉淀：

- `BOOKS.md` — 6 本核心书籍
- `PAPERS.md` — 15 篇核心论文
- `OFFICIAL_DOCS.md` — 22 份官方文档
- `COURSES.md` — 高质量课程与综述（Tier 3）
- `READING_PATHS.md` → `docs/LEARNING_PATH.md`（4 条学习路径）
- `SOURCE_REGISTRY.json` — 机读来源登记（每题 `sourceRefs.ref` 引用其中的 id）
- `COVERAGE_MATRIX.md` — 来源 × 模块覆盖矩阵

## 5. 导出文件（下游主入口）

| 文件 | 说明 |
|------|------|
| `exports/question-bank.json` | 完整题库（不含 deprecated） |
| `exports/question-bank.csv` | 简版行数据 |
| `exports/module-coverage.json` | 模块 / 题型 / 难度 / 认知类型 / reviewStatus 分布 |
| `exports/source-coverage.json` | 各来源被引用次数 |
| `exports/book-coverage.json` / `exports/paper-coverage.json` | 书目 / 论文单独覆盖 |
| `exports/framework-coverage.json` / `exports/hardware-coverage.json` | 框架与硬件覆盖 |
| `exports/review-summary.md` / `exports/review-summary.json` | 审阅汇总 |
| `exports/promotion-ledger.json` | draft → agent_reviewed 升级留痕 |
| `exports/human-sampling-package.md` | 人工抽查队列（260 题） |
| `exports/question-audit.md` / `exports/question-audit.json` | 自动审计报告 |

Kit 应优先读取 `exports/question-bank.json` + `knowledge-test.config.json`。

## 6. 配置入口

根目录 `knowledge-test.config.json` 提供：

- `content.questionGlobs` — 题库匹配
- `content.exports.questionBank` — 首选题库文件
- `modules[]` — 14 模块元数据
- `review.publicStatuses` — 下游默认公开的状态（`agent_reviewed`、`human_reviewed`）
- `exam.singleScore=2` / `multipleScore=3` / `passingRatio=0.6` / `passingRoundUp=true`
- `presets.comprehensive` — 100 题综合模拟建议
- `presets.moduleFocused` — 30 题模块专项建议
- `presets.canary` — 25 题金丝雀（可作为快速上手集）
- `humanQueue.ids` — 当前 8 题保留 draft，下游默认不公开

## 7. 本地预览命令

本仓库无前端，可通过下述命令做数据侧本地校验：

```bash
npm run validate:questions   # Schema 400/400
npm run audit:questions       # 9/9 gates
npm run blind:build           # 生成 reviews/blind/<M>.json 用于盲审
npm run export:questions      # 重建 exports/
```

## 8. 静态构建 / 生成

题库本身无需构建。下游 Kit 构建时：

1. 读取 `knowledge-test.config.json`
2. 加载 `exports/question-bank.json`（或按 `questionGlobs` 递归加载）
3. 按 `review.publicStatuses` 过滤 `agent_reviewed` + `human_reviewed`
4. 应用 `exam.*` 计分规则

## 9. GitHub Pages 准备步骤

**下游 Kit 完成后**，用户在 GitHub 上执行：

```
Repository → Settings → Pages
→ Build and deployment
→ Source: GitHub Actions
```

参见 `docs/MANUAL_GITHUB_SETUP.md`。

本仓库当前 **不启用** Pages Workflow —— 因为 knowledge-test-kit 尚未发布 tag，一个引用不存在版本的 workflow 会导致构建失败。当 Kit 首个稳定版本发布后再启用 `docs/pages-workflow-draft.yml`。

## 10. Human Queue（当前 draft 8 题默认不公开）

| id | 原因 |
|----|------|
| G-COSTMODEL-020 | Round 2 独立答案与官方不一致（干扰项 D warmup 归类可议） |
| G-FUSION-003 | Round 2 独立答案与官方不一致（rank/extent 硬边界可议） |
| G-REORDER-010 | Release 阶段修复解析标签，需再复核 |
| H-MIXED-023 | Round 2 独立答案与官方不一致（BF16 master weight 表述可议） |
| H-SATURATE-031 | Release 阶段修复解析标签，需再复核 |
| I-ATTBACK-025 | Round 2 独立答案与官方不一致（"entirely from HBM traffic" 措辞可议） |
| K-ONNXVER-017 | Release 阶段修复解析标签，需再复核 |
| L-STREAM-008 | Release 阶段修复解析标签，需再复核 |

## 11. 解析标签扫描结果

`reviews/release/explanation-label-scan.md` / `.json`：

- 总 106 处 explanation 中显式引用了 Option A/B/C/D
- 明确冲突（likelyStale=true）：4 处（已在 Release Round 修复；见 `reviews/resolutions/release-round.json`）
- 其余 102 处启发式判定为一致或语气不明；后续人工可再判定，无需批量替换

## 12. 不复制前端代码原则

**本仓库不复制 knowledge-test-kit 的任何前端源码。** 若下游 Kit 需要静态资源，请在 Kit 侧通过：

- npm workspaces / pnpm workspaces / git submodule / npm 依赖

引用本仓库的 `exports/question-bank.json` 与 `knowledge-test.config.json`。
