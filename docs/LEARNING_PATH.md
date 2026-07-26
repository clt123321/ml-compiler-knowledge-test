# LEARNING_PATH.md

四条学习路线。每条路线附前置知识、推荐顺序、核心书目、核心论文、官方教程、实践项目、可通过哪些题库模块验证。

## 路线 1：ML Infra / 推理优化工程师

### 前置

* Python + PyTorch 基本使用；
* Linear Algebra、GPU 基本概念。

### 推荐顺序

```
体系结构 → CUDA & Triton → PyTorch Compiler → 核心 Kernel → 量化 → LLM 推理 → Profiling
```

### 核心书目

* 《Programming Massively Parallel Processors》（Kirk & Hwu）；
* 《Computer Architecture: A Quantitative Approach》（Hennessy & Patterson）；
* 《Efficient Processing of Deep Neural Networks》（Sze et al.）。

### 核心论文

* FlashAttention；
* PagedAttention / vLLM；
* SmoothQuant、GPTQ、AWQ。

### 官方教程

* CUDA Programming Guide；
* CUDA Best Practices Guide；
* Triton Tutorials；
* PyTorch `torch.compile` docs、TorchInductor docs；
* vLLM 文档。

### 实践项目

* 手写 Triton GEMM、Softmax、LayerNorm、FlashAttention；
* 用 `torch.compile` 加速一个真实模型，分析 graph break；
* 用 Nsight Systems 抓一个 LLM decode 的 timeline，找到 kernel launch gap；
* 用 GPTQ / AWQ 量化 7B 模型并对比 accuracy / throughput。

### 题库验证

**主要模块**：A / F / D / I / H / J / L
**辅助模块**：G / K / M

---

## 路线 2：机器学习编译器工程师

### 前置

* 传统编译原理：AST / IR / SSA；
* C++ / LLVM 基础。

### 推荐顺序

```
传统编译基础 → SSA & 程序分析 → Tensor IR → MLIR → TVM → XLA / StableHLO → 自动调优
```

### 核心书目

* 《Engineering a Compiler》（Cooper & Torczon）；
* 《Compilers: Principles, Techniques, and Tools》（Dragon Book）；
* 《Modern Compiler Implementation in ML/Java》（Appel）；
* 《Deep Learning Systems: Algorithms, Compilers, and Processors for Large-Scale Production》。

### 核心论文

* Halide（Compute vs. Schedule 分离）；
* TVM；
* Ansor / MetaSchedule；
* MLIR；
* Triton；
* Tensor Comprehensions；
* XLA / StableHLO 设计资料。

### 官方教程

* MLIR Tutorial（Toy）；
* TVM Relax / TensorIR 官方文档；
* OpenXLA / StableHLO；
* IREE 文档。

### 实践项目

* 用 MLIR 写一个 Toy Dialect 与 Lowering；
* 用 TVM TensorIR 手写 GEMM Schedule 并跑 MetaSchedule 自动调优；
* 读 TorchInductor 的 fusion 逻辑源码，画数据流。

### 题库验证

**主要模块**：B / C / E / G / K
**辅助模块**：D / I / N

---

## 路线 3：CUDA / Triton Kernel 工程师

### 前置

* C++；
* GPU 架构基本概念；
* 数值线性代数。

### 推荐顺序

```
GPU 架构 → CUDA → Triton → GEMM/Reduction/Softmax → Attention → Profiler → 自定义算子
```

### 核心书目

* 《Programming Massively Parallel Processors》；
* 《Computer Architecture: A Quantitative Approach》（Ch 4-6）。

### 核心论文

* FlashAttention；
* Triton；
* CUTLASS 相关设计资料；
* Tensor Core / MMA 官方 whitepaper。

### 官方教程

* CUDA Programming Guide；
* CUDA Best Practices Guide；
* Triton Tutorials；
* CUTLASS 教程。

### 实践项目

* 手写 CUDA kernel：Reduction、Scan、GEMM（含 Tensor Core MMA）；
* 手写 Triton kernel：Softmax、LayerNorm、FlashAttention v1；
* 用 Nsight Compute 优化 kernel 至接近 roofline。

### 题库验证

**主要模块**：A / F / I / L
**辅助模块**：G / H

---

## 路线 4：模型部署工程师

### 前置

* PyTorch / TensorFlow 训练与导出；
* Linux / 容器。

### 推荐顺序

```
图捕获 → ONNX / StableHLO → Runtime → 量化 → AOT → Edge / Server 部署 → 正确性与回归
```

### 核心书目

* 《Deep Learning Systems: Algorithms, Compilers, and Processors for Large-Scale Production》；
* 《Machine Learning Systems》。

### 核心论文

* PagedAttention / vLLM；
* TensorRT / TensorRT-LLM 官方设计资料；
* SmoothQuant / GPTQ / AWQ；
* GSPMD。

### 官方教程

* `torch.export` / AOTInductor；
* ONNX 官方；
* TensorRT / TensorRT-LLM；
* vLLM / SGLang；
* IREE 文档；
* TVM Runtime。

### 实践项目

* 用 `torch.export` 导出 LLM 并 AOTInductor 编译；
* 转 ONNX → TensorRT，处理动态 shape；
* 用 vLLM 部署 7B 模型，处理 continuous batching 与 KV cache 溢出；
* Golden test：eager vs. AOT 差异容忍度分析。

### 题库验证

**主要模块**：K / H / J / D / L
**辅助模块**：C / M / N

---

## 全流程验证建议

任一路线学习者可用以下顺序做整体自测：

```
金丝雀 25 题（覆盖 A/C/D/F/L）
→ 路线相关模块专项练习
→ 综合 100 题模拟考
→ 错题重做
→ 论文设计题（N 模块）综合思辨
```
