# PLAN.md

## 阶段流水线

```
1. 初始化仓库 + 控制文件（本文件产生的提交）
2. 沉淀 references/ 与 docs/SYLLABUS.md
3. 建立 Schema、校验、审计、导出、盲审包脚本；冻结 Schema
4. 生成 25 题金丝雀（模块 A/C/D/F/L 各 5 题）
5. 金丝雀独立盲审 + 生成器修复
6. 分模块并行生成剩余 375 题
   - Batch 1: A, B, C, D
   - Batch 2: E, F, G, H
   - Batch 3: I, J, K, L
   - Batch 4: M, N
7. 全库自动审计 + 门禁
8. 分模块独立盲审（Primary Review Round 1）
9. 全局四位 Reviewer 只读审阅
10. BLOCKER / MAJOR 定向修复
11. 由第三方 subagent 做 Verification（Round 2）
12. 达到双重门禁的题升级为 agent_reviewed
13. 生成最终导出 + 人工抽查包
14. 合并到 main 并推送 GitHub
```

## 分支策略

* `main`：唯一稳定分支；
* `feat/ml-compiler-knowledge-test-v1`：本次集成分支，所有 agent 产出先落到该分支；
* `agent/<phase>-<module>`：各 subagent 使用的短生命周期分支，来自 worktree。

## 并发上限

* 写入型 subagent 最多同时 4 个；
* 只读型 Reviewer subagent 数量不受此限；
* 每个 worktree 只写入被授权的目录。

## 关键顺序约束

* Schema **必须** 在第 3 阶段末冻结；
* 金丝雀 **必须** 通过后才启动 Batch 1；
* Verification **必须** 由第三方 subagent（非生成、非 Primary、非 Repair）执行；
* `agent_reviewed` 的升级 **必须** 满足 Round 1 & Round 2 双重门禁；
* `human_reviewed` **禁止** 自动升级。

## 成功条件

| 结论 | 触发条件 |
|------|----------|
| `ML_COMPILER_TEST_COMPLETED` | 400 题全部 `agent_reviewed`，无 BLOCKER，导出与推送成功 |
| `ML_COMPILER_TEST_COMPLETED_WITH_HUMAN_QUEUE` | 400 题就绪，Verification 完成，部分题目需人工抽查 |
| `ML_COMPILER_TEST_INCOMPLETE` | 未满足以上任一，须清晰列出缺口 |

## 风险与回退

* GitHub 推送失败：保留本地提交、报告 commit hash 与分支、不虚报；
* Subagent 越权修改：拒绝合并，重开 worktree；
* 审计门禁不达标：先修生成器再重跑该模块；
* 单点问题 ≥ 3 题的错误模式：视为生成器问题，允许局部重生成。
