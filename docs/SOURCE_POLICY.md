# SOURCE_POLICY.md

## 1. 来源三级

见 `config/source-policy.yaml`。

## 2. 使用规则

* **Tier 1**（官方规范、正式教材、官方设计文档）：可作为唯一权威来源；
* **Tier 2**（原始论文、官方代码、顶会论文）：可作为唯一权威来源，但性能数字仅可作为 `paper_result` 且必须绑定实验条件；
* **Tier 3**（工程博客、开发者讨论、课程）：**不可** 单独支撑唯一答案，只作为补充。

## 3. 版本敏感处理

所有 PyTorch 2.x / TorchInductor / vLLM / TensorRT-LLM / SGLang 相关题目：

* 优先写成 **stable_principle**（跨版本成立）；
* 若必须落到实现细节，写 **version_sensitive**：
  * `softwareContext.frameworkVersionScope`；
  * `softwareContext.verifiedAt`；
* 无法核验版本 → 保 `draft` 并标 `misconceptionTags: ["needs_source_verification"]`。

## 4. 论文数字处理

严禁把摘要中的性能数字直接写成跨平台事实。

论文数字可用于：

* 单选/多选中的正确项：必须带 `evidenceType: "paper_result"` + hardware + shape 条件；
* 干扰项：必须给出与该数字接近但错误的语义解释（例如 "把 kernel 加速倍数当端到端加速"）。

## 5. 严禁

* 下载 / 复制 / 提交受版权保护的整本书 PDF；
* 提交私有 benchmark 数据；
* 提交 Token、`.env`、内部文档、私有模型权重；
* 声称 "在我们的 GPU 上测得"（本仓库无 GPU 环境）。

## 6. 无法核验时的默认行为

* Keep `draft`；
* Tag `needs_source_verification`；
* Log to `references/COVERAGE_MATRIX.md` 的"待核验"栏；
* 不猜测。
