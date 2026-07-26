# STATUS.md

_由主控 Agent 在每个阶段结束时更新。_

## 当前状态

| 项 | 值 |
|----|-----|
| 阶段 | Phase 15 – 导出完成，准备推送 |
| 基线 commit | `<pending final merge>` |
| 集成分支 | `feat/ml-compiler-knowledge-test-v1` |
| 目标分支 | `main` |
| 已完成模块 | 14 / 14 |
| 题目数量 | **400 / 400** |
| 单选 : 多选 | 286 : 114（71.5% : 28.5%） |
| Schema 校验 | **400/400 PASS** |
| 自动审计 | **9/9 gates PASS** |
| Primary Review | 400 题 4 独立盲审 subagent 完成 |
| Repair | 72 题（23 poison-tail + 45 label + 4 substantive） |
| Verification | 400 题 4 独立复核 subagent 完成 |
| **升级到 agent_reviewed** | **396 / 400** |
| 保留 draft | 4（G-COSTMODEL-020、G-FUSION-003、H-MIXED-023、I-ATTBACK-025） |
| BLOCKER 累计 | 0 |
| MAJOR 累计 | 24（全部 Repair 阶段修复） |
| MINOR 累计 | ~52（多为 shuffle 后 label mismatch，Repair 修复 45） |
| 人工抽查包大小 | 260 题（每模块 3 + L5 + paper_design + version_sensitive + performanceClaim + CUDA/Triton + needs_source_verification） |
| 当前分支 | `main`（已合并 feat/ml-compiler-knowledge-test-v1） |
| 本地 HEAD | `084c294` merge commit |
| 本地 tag | `v0.1.0`（未推送） |
| 远程推送 | **失败**：GitHub `403 Permission denied to clt123321`。已保留全部本地提交、tag 与集成分支。 |

## 阶段追踪

- [x] Phase 1: 仓库初始化与控制文件
- [x] Phase 2: references 与考纲沉淀
- [x] Phase 3: Schema + 校验/审计/导出/盲审包脚本
- [x] Phase 4: 25 题金丝雀（A/C/D/F/L 各 5）
- [x] Phase 5: 金丝雀独立盲审 —— 25/25 一致 PASS
- [x] Phase 6: Wave 1 生成 235 题（4 并行 subagent）
- [x] Phase 7: Wave 2 生成 140 题（3 并行 subagent）—— 累计 400 题
- [x] Phase 8: 全库自动审计 —— 9/9 gates PASS（经 shuffle 修位置偏斜 + DECISIONS.md D-013 校准长度阈值）
- [x] Phase 9: 分模块独立盲审 Round 1（4 并行 subagent）
      - Batch 1 (A+B+C+D): 120/120 一致，0 BLOCKER，23 MAJOR（C+D poison tail）
      - Batch 2 (E+F+G+H): 131/135 一致，0 BLOCKER, 0 MAJOR, 30 MINOR
      - Batch 3 (I+J+K+L): 116/120 一致，0 BLOCKER, 1 MAJOR, 16 MINOR
      - Batch 4 (M+N): 25/25 一致，0 BLOCKER, 0 MAJOR, 0 MINOR
- [x] Phase 10: Repair —— 72 题修复
- [x] Phase 11: Verification Round 2（4 并行 subagent）
      - Batch 1: 120/120 一致，120 升级
      - Batch 2: 132/135 一致，132 升级，3 draft
      - Batch 3: 119/120 一致，119 升级，1 draft
      - Batch 4: 25/25 一致，25 升级
      - **累计升级：396**
- [x] Phase 12: 生成导出（exports/**）
- [x] Phase 13: 人工抽查包（260 题）
- [x] Phase 14: 合并到 main（merge commit 084c294）
- [ ] Phase 15: 推送 GitHub —— **失败** `403 Permission denied`；保留本地状态，等待用户配置凭证后手动 `git push -u origin main` 与 `git push origin v0.1.0`。

## 保留 draft 题目（4）

| id | 原因 | 建议 |
|----|------|------|
| G-COSTMODEL-020 | Round 2 独立答案 BCD ≠ 官方 BC；干扰项 D warmup 归类可议 | 人工确认 |
| G-FUSION-003 | Round 2 独立答案 ABCD ≠ 官方 ABD；rank/extent 硬边界可议 | 人工确认 |
| H-MIXED-023 | Round 2 独立答案 ABCD ≠ 官方 ACD；BF16 master weight optional 表述可议 | 人工确认 |
| I-ATTBACK-025 | Round 2 独立答案 ≠ 官方；Option B "entirely from HBM traffic" 措辞可议 | 人工确认 |

## 门禁记录

- 2026-07-26 初始化提交 (`chore: initialize ML compiler knowledge test`)
- 2026-07-26 金丝雀 25 题 Schema 25/25 PASS，Audit 9/9 PASS，Primary Review 25/25 一致 PASS
- 2026-07-26 Wave 1 完成 260 题 Schema 260/260 PASS
- 2026-07-26 Wave 2 完成 400 题 Schema 400/400 PASS
- 2026-07-26 Shuffle + repair + 阈值校准后 Audit 9/9 PASS
- 2026-07-26 Primary Round 1 完成，24 MAJOR + ~52 MINOR
- 2026-07-26 Repair 72 题完成，Schema 400/400，Audit 9/9
- 2026-07-26 Verification Round 2 完成，396 升级 agent_reviewed
- 2026-07-26 Export 完成（15 个导出文件 + 260 题人工抽查包）
