# ML Compiler Knowledge Test v0.1.0

首个公开版本。面向 ML Infra、推理优化、Kernel、编译器与部署量化工程师的 400 题机器学习编译诊断题库。

## 内容规模

- 题目总数：400
- 模块：14（A 体系结构 … N 论文设计）
- 单选 : 多选 = 286 : 114（71.5% : 28.5%）
- 参考资料：核心书籍 6、论文 15、官方文档 22
- 学习路径：4 条（ML Infra、编译器、Kernel、部署）
- Schema 校验：400/400 PASS
- 自动审计：9/9 gates PASS

## 审核状态

- `agent_reviewed`：392
- `draft`：8（人工队列）
- `human_reviewed`：0
- `deprecated`：0

### 人工队列（8 题）

原始保留（Verification 未一致）：

- `G-COSTMODEL-020`
- `G-FUSION-003`
- `H-MIXED-023`
- `I-ATTBACK-025`

发布前解析标签扫描后修复并降级复核（explanation 已改写，version 1→2）：

- `G-REORDER-010`
- `H-SATURATE-031`
- `K-ONNXVER-017`
- `L-STREAM-008`

以上 8 题默认不进入正式考试抽题，只在开发预览模式下可见。

## 已知限制

- 未在本机进行 GPU 实测：Kernel 性能相关题目结论均来自官方文档、论文或 Roofline/analytical 推理，未通过 Nsight / Profiler 复测。
- 无题目自动升级至 `human_reviewed`；`human_reviewed` 状态必须由领域专家确认后手动设置。
- 解析标签扫描共 106 处命中，其中 4 处真实冲突已修复；剩余 2 处 MAJOR 系启发式误报（语义已验证正确），记录于 `reviews/release/explanation-label-scan.md`。
- 未附带前端 Web 应用：本仓库仅为题库与参考资料 SSOT，运行时依赖后续 `knowledge-test-kit` 集成。
- 部分版本敏感题目（PyTorch Compiler / vLLM / TensorRT-LLM）以稳定架构原则为主，且已在 `softwareContext.frameworkVersionScope` 与 `verifiedAt` 中标注核验时间。

## 后续计划

- 接入 `knowledge-test-kit` 共享前端脚手架（配置见 `knowledge-test.config.json`）。
- 完成 8 题人工复核后升级至 `human_reviewed` 或改写为新版本。
- 补充 GPU 实测数据，用于替换纯 analytical 的 performance claim。
- 启用 GitHub Pages（工作流草案见 `docs/pages-workflow-draft.yml`）。

## 免责声明

本题库不包含受版权保护的教材全文、任何 GitHub Token、企业内部资料或私有 benchmark 数据。所有性能结论均在题干或解析中说明其来源（analytical / paper_result / measured）与硬件依赖。
