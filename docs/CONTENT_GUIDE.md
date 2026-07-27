# CONTENT_GUIDE.md

## 内容范围

本仓库维护的是知识题库内容本身，而不是前端应用源码。核心资产包括：

- `data/questions/`：题目
- `data/content-cards/`：内容卡
- `manifests/`：原始模块清单
- `modules.json`：Kit 兼容层模块文件
- `references/`：资料与来源登记
- `reviews/`：盲审、修复、复核与升级记录
- `exports/`：导出与审计产物

## 题目 Schema

题目结构以 `schemas/question.schema.json` 为准。题目通常包含：

- `id`
- `type`
- `module`
- `stem`
- `options`
- `correctAnswers`
- `explanation`
- `optionExplanations`
- `sourceRefs`
- `reviewStatus`
- `version`

相关 Schema：

- `schemas/question.schema.json`
- `schemas/content-card.schema.json`
- `schemas/manifest.schema.json`
- `schemas/review.schema.json`

## 模块

题库共 14 个模块，模块元数据有两层：

1. `manifests/*.json` 保留原始生成与审查流程上下文
2. `modules.json` 提供给 Knowledge Test Kit 读取

不要为了目录整齐移动题目文件。当前题目主路径仍然是 `data/questions/**/*.json`。

## 来源体系

来源分为三类：

- 书籍：`references/BOOKS.md`
- 论文：`references/PAPERS.md`
- 官方文档：`references/OFFICIAL_DOCS.md`

机读登记位于：

- `references/SOURCE_REGISTRY.json`

来源等级规则：

- Tier 1：教材、官方规范、官方设计文档
- Tier 2：原始论文、官方代码/教程
- Tier 3：高质量课程、综述、工程博客

Tier 3 不能单独支撑唯一标准答案。

## reviewStatus 语义

| 状态 | 含义 |
|------|------|
| `draft` | 尚未通过完整 Agent 审查 |
| `agent_reviewed` | 已完成审查与复核，可进入公开站点 |
| `human_reviewed` | 已经人工确认 |
| `deprecated` | 保留记录但不再公开 |

公开站点与 Practice 默认只公开：

- `agent_reviewed`
- `human_reviewed`

`draft` 默认隐藏，不得自动升级。`human_reviewed` 只能由人工确认。

## 内容变更规则

以下修改属于内容变更，必须谨慎处理：

- 修改题干技术结论
- 修改正确答案
- 修改错误选项
- 修改解析中的技术判断
- 修改版本敏感字段并改变语义

这类改动通常需要：

- 递增题目 `version`
- 更新相关审查记录
- 重新运行校验与审计

以下改动通常不触碰题目内容语义：

- README、维护文档、工作流
- Kit runner 与配置兼容层
- 导出文件重建
- 页面集成与 GitHub Pages 设置

## 字节级保护原则

本次产品化重构的核心要求之一，是题库内容文件保持字节级不变。除非属于明确的配置兼容问题，否则不要修改：

- 题目 JSON
- 正确答案
- 审核状态
- 解析技术结论

需要做安全核对时，请重新计算题目文件哈希。

## 审计与导出

常用命令：

```bash
npm run content:validate
npm run content:audit
npm run content:blind
npm run content:export
npm run content:scan-labels
```

## 相关文档

- [docs/QUESTION_AUTHORING_GUIDE.md](./QUESTION_AUTHORING_GUIDE.md)
- [docs/REVIEW_GUIDE.md](./REVIEW_GUIDE.md)
- [docs/SOURCE_POLICY.md](./SOURCE_POLICY.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
