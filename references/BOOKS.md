# BOOKS.md — 核心著作

以下书目已核验作者、出版社与主题。所有条目遵循 `docs/SOURCE_POLICY.md` §1-2。**仓库不保存整本 PDF**，只保存书目信息、原创摘要、章节主题与题库映射。

## 编译器基础

### Engineering a Compiler
- 作者：Keith D. Cooper, Linda Torczon
- 出版社：Morgan Kaufmann，第 3 版（2022）
- 覆盖：Lexer / Parser / IR / Data-flow / SSA / Optimization / Code Generation
- 建议章节：
  - Ch 5 IR、Ch 8 数据流分析、Ch 9 SSA、Ch 10 常见优化、Ch 13 寄存器分配
- 与题库映射：**B**（几乎全模块）、**C**（IR 概念）、**G**（循环变换与优化）

### Compilers: Principles, Techniques, and Tools（Dragon Book）
- 作者：Aho, Lam, Sethi, Ullman
- 出版社：Pearson，第 2 版（2006）
- 覆盖：编译器完整栈；对现代 SSA / GPU 编译覆盖较薄
- 与题库映射：**B**

### Modern Compiler Implementation
- 作者：Andrew W. Appel
- 出版社：Cambridge University Press（ML / Java 各一版）
- 覆盖：包含 SSA、Alias、Liveness、Register Allocation 的实现视角
- 与题库映射：**B**

### LLVM 官方语言与教程
- 项目：LLVM (llvm.org)
- 覆盖：LLVM IR、Pass、后端；本项目主要作为背景理解，不做 LLVM 后端专家题
- 与题库映射：**B / K**

## 体系结构与并行计算

### Computer Architecture: A Quantitative Approach
- 作者：John L. Hennessy, David A. Patterson
- 出版社：Morgan Kaufmann，第 6 版（2017）
- 覆盖：ILP / DLP / TLP / Cache / Memory Hierarchy / DSA
- 建议章节：
  - Ch 1 定量方法与 Amdahl / Little；Ch 2 存储层次；Ch 4 数据级并行；Ch 7 加速器与领域专用架构
- 与题库映射：**A**（核心）、**M**（异构与通信）

### Programming Massively Parallel Processors
- 作者：David B. Kirk, Wen-mei W. Hwu
- 出版社：Morgan Kaufmann，第 4 版（2022）
- 覆盖：CUDA、Warp、Shared Memory、Coalesced Access、Reduction、GEMM、Convolution、Tensor Core、CUDA Graph
- 建议章节：几乎全书
- 与题库映射：**A / F / I / L**

### Efficient Processing of Deep Neural Networks
- 作者：Vivienne Sze, Yu-Hsin Chen, Tien-Ju Yang, Joel S. Emer
- 出版社：Morgan & Claypool / Springer
- 覆盖：DNN 算子、Dataflow、Systolic Array、量化、稀疏、硬件加速
- 与题库映射：**A / H / I**

### CUDA C++ Programming Guide
- 项目：NVIDIA 官方文档
- 覆盖：CUDA 执行模型、内存模型、异步 API、Tensor Core、CUDA Graph
- 与题库映射：**A / F / K / L**
- 使用注意：**版本敏感**，题目引用需记录 `verifiedAt`

### CUDA Best Practices Guide
- 项目：NVIDIA 官方文档
- 覆盖：Coalesced access、Bank conflict、Occupancy、Launch overhead 等经验规则
- 与题库映射：**A / F / L**

## ML Systems 与深度学习系统

### Machine Learning Systems
- 作者：Aurélien Géron / 或社区开源教材（多本同名，登记时需核验特定书目）；本项目暂用 Chip Huyen 《Designing Machine Learning Systems》(O'Reilly, 2022) 与开源教材 **mlsysbook.ai** 相结合
- 覆盖：数据管道、训练系统、部署、监控
- 与题库映射：**J / K / L**

### Deep Learning Systems: Algorithms, Compilers, and Processors for Large-Scale Production
- 作者：Andres Rodriguez
- 出版社：Intel Press / 现由 Springer 系发行（需最终核验）
- 覆盖：算法 → 编译器 → 处理器 全栈
- 与题库映射：**C / E / G / H / K**

## 使用说明

* 每题的 `sourceRefs` 引用格式：`BOOK:<slug>:<chapter/section>`；
* 具体 slug 见 `references/SOURCE_REGISTRY.json`；
* 每本书的原创摘要与 mapping 在下述 SOURCE_REGISTRY 中登记。
