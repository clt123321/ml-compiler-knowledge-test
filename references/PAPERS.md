# PAPERS.md — 核心论文

以下论文条目遵循 `docs/SOURCE_POLICY.md`。**性能数字仅可绑定到 `paper_result` 且必须附实验条件**。

## 编译栈与 IR

### Halide: A Language and Compiler for Optimizing Parallelism, Locality, and Recomputation in Image Processing Pipelines
- 作者：Ragan-Kelley et al.
- 会议：PLDI 2013
- 主要问题：图像处理管线中的 locality / parallelism / recomputation 空间搜索
- 主要思想：**Compute 与 Schedule 分离**
- 关键抽象：Algorithm、Schedule、Stage
- Evidence：多领域 pipeline 加速；vs. hand-tuned Halide 生成的代码接近或更好
- Limitation：Schedule 搜索非自动（Ansor 后续）；主要图像/立方体算子
- 与题库映射：**C / G / N**

### TVM: An Automated End-to-End Optimizing Compiler for Deep Learning
- 作者：Chen et al.
- 会议：OSDI 2018
- 主要问题：跨硬件、跨算子的自动优化
- 关键抽象：Compute Description、Schedule、AutoTVM、Halide-inspired IR
- 与题库映射：**C / E / G / N**

### Ansor: Generating High-Performance Tensor Programs for Deep Learning
- 作者：Zheng et al.
- 会议：OSDI 2020
- 主要思想：自动构建 Schedule 搜索空间 + Cost Model + Task Scheduler
- 与题库映射：**G / N**

### MLIR: A Compiler Infrastructure for the End of Moore's Law
- 作者：Lattner et al.
- 会议：CGO 2021
- 关键抽象：Dialect、Op、Region、Block、Interface、Pattern Rewrite、Progressive Lowering
- 与题库映射：**C / E / N**

### Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations
- 作者：Philippe Tillet et al.
- 会议：MAPL 2019
- 主要思想：面向 Tile 的 GPU DSL
- 与题库映射：**F / G / N**

### Tensor Comprehensions
- 作者：Vasilache et al.
- arXiv 2018
- 主要思想：Einstein 风格张量表达 + Polyhedral + JIT
- 与题库映射：**C / G / N**

### XLA / StableHLO 设计资料
- 项目：Google / OpenXLA
- 主要抽象：HLO / StableHLO；框架无关的高层 IR
- 使用注意：官方设计文档（Tier 1）优先于任何博客
- 与题库映射：**E / N**

### GSPMD: General and Scalable Parallelization for ML Computation Graphs
- 作者：Xu et al.
- arXiv 2021
- 主要思想：Auto-sharding on HLO
- 与题库映射：**M / N**

## GPU Kernel 与 Attention

### FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness
- 作者：Tri Dao et al.
- 会议：NeurIPS 2022
- 主要思想：Tiling + Online Softmax + Recomputation，把 attention 变 memory-bound → compute-bound
- 关键抽象：Block-wise softmax、SRAM tiling、Backward with recomputation
- 与题库映射：**F / I / L / N**

### FlashAttention-2 / FlashAttention-3（后续系列）
- 会议：ICLR 2024 / arXiv 2024
- 与题库映射：**F / I**（需绑定版本）

## LLM Serving 与推理

### Efficient Memory Management for Large Language Model Serving with PagedAttention（vLLM）
- 作者：Woosuk Kwon et al.
- 会议：SOSP 2023
- 主要思想：Paged KV Cache + Block Table，消除 KV cache 内部碎片
- 与题库映射：**J / K / N**

### Continuous Batching Papers（Orca 等）
- Orca: A Distributed Serving System for Transformer-Based Generative Models（OSDI 2022）
- 主要思想：Iteration-level scheduling / Continuous Batching
- 与题库映射：**J / K / N**

## 量化

### SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models
- 作者：Guangxuan Xiao et al.
- 会议：ICML 2023
- 主要思想：activation outlier 通过 per-channel scale 迁移到 weight，做 W8A8
- 与题库映射：**H / I**

### GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers
- 作者：Frantar et al.
- 会议：ICLR 2023
- 主要思想：基于 Optimal Brain Quantization 的 weight-only INT4
- 与题库映射：**H**

### AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration
- 作者：Lin et al.
- 会议：MLSys 2024
- 主要思想：Salient weight scale-based protection
- 与题库映射：**H**

## PyTorch 2 编译链

### PyTorch 2: Faster Machine Learning Through Dynamic Python Bytecode Transformation and Graph Compilation
- 作者：Ansel et al.
- 会议：ASPLOS 2024
- 覆盖：TorchDynamo / AOTAutograd / TorchInductor 全栈
- 与题库映射：**D / N**

### Speculative Decoding
- 相关论文：Fast Inference from Transformers via Speculative Decoding（Leviathan et al., ICML 2023）；Medusa；EAGLE 等
- 与题库映射：**J**

## 元数据模板

见 `references/SOURCE_REGISTRY.json`。每篇登记：

```json
{
  "title": "",
  "authors": [],
  "year": 0,
  "venue": "",
  "topic": [],
  "mainProblem": "",
  "mainIdea": "",
  "keyAbstractions": [],
  "evidence": [],
  "limitations": [],
  "questionModules": [],
  "sourceUrl": "",
  "verifiedAt": ""
}
```
