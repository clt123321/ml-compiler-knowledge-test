# Contributing

感谢你愿意一起维护这个题库产品。

## 环境要求

- Node.js `>=20`
- Git
- npm

本仓库默认不要求先执行 `npm install`。`npm run dev`、`npm run build` 等站点命令会在首次运行时自动下载并安装固定版本的 Knowledge Test Kit。

## 本地启动

```bash
git clone https://github.com/clt123321/ml-compiler-knowledge-test.git
cd ml-compiler-knowledge-test
npm run dev
```

常用命令：

```bash
npm run inspect
npm run doctor
npm run site:validate
npm run content:validate
npm run content:audit
npm run content:export
```

## 题目 ID 规则

题目 ID 采用 `模块代码-主题缩写-序号`，例如：

```text
F-TRITON-016
J-KVCACHE-009
```

题目文件路径、内容卡路径、manifest 记录和审查记录必须保持一致。

## version 递增

以下改动需要递增对应题目的 `version`：

- 修改正确答案
- 修改错误选项集合
- 修改题干技术含义
- 修改解析中的技术结论
- 修改版本敏感字段并影响题意

纯文档、README、工作流、Runner、导出文件与站点集成层改动，不会触碰题目 `version`。

## reviewStatus 规则

允许的审核状态：

- `draft`
- `agent_reviewed`
- `human_reviewed`
- `deprecated`

约束如下：

- 不得自动把 `draft` 升级为 `agent_reviewed`
- 不得自动把任何题目标记为 `human_reviewed`
- 只有人工确认后，才可以进入 `human_reviewed`
- 每次状态升级都必须留下审查证据与 ledger 记录

## 改错别字 vs 改答案

两类修改的流程不同：

1. 只改错别字、链接、排版或非技术性元数据：
   - 尽量保持题干语义、答案与解析结论不变
   - 运行 `npm run content:validate`
   - 如变更影响导出，再运行 `npm run content:export`

2. 修改答案、解析结论、选项或题干技术判断：
   - 必须说明原因与依据
   - 递增题目 `version`
   - 更新相关审查记录
   - 重新运行 `npm run content:validate`、`npm run content:audit`
   - 在 PR 中明确标记为需要复核的内容变更

## PR 前检查

提交前请至少完成：

```bash
npm run content:validate
npm run content:audit
npm run site:validate
```

如果改动了导出、README、工作流或 Kit 集成层，建议再运行：

```bash
npm run build
```

## 内容修改边界

允许维护：

- 题目、解析、内容卡
- 资料索引与来源登记
- 审查记录与升级留痕
- Runner、配置、README、维护文档、CI

禁止在未复核的情况下批量改写：

- 正确答案
- 选项内容
- 题干技术结论
- 审核状态

## 相关文档

- [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- [docs/MAINTENANCE.md](./docs/MAINTENANCE.md)
