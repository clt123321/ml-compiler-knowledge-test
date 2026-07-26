# Batch 2 — Primary Review (Round 1) — Summary

Reviewer: **primary-review-batch2** (E / F / G / H)
Date: 2026-07-27
Independence: reviewer sub-agent distinct from generation sub-agent; blind Phase A + open Phase B per `docs/REVIEW_GUIDE.md`.

## 汇总一致率

| 模块 | 主题 | 题量 | 一致 | 一致率 | PASS | BLOCKER | MAJOR | MINOR（含 label_mismatch） |
|------|------|------|------|--------|------|---------|-------|-----------------------------|
| E | MLIR / TVM / XLA / IREE / ONNX | 30 | 29 | 96.7% | 30 | 0 | 0 | 4 |
| F | CUDA / Triton / GPU Kernel | 40 | 40 | 100.0% | 40 | 0 | 0 | 7 |
| G | 图优化 / 循环变换 / 调度 / 自动调优 | 30 | 28 | 93.3% | 30 | 0 | 0 | 8 |
| H | 数值表示、混合精度与量化 | 35 | 34 | 97.1% | 35 | 0 | 0 | 11 |
| **合计** | | **135** | **131** | **97.0%** | **135** | **0** | **0** | **30** |

## 每模块 Top-3 严重问题

MINOR 问题按严重度整理（无 BLOCKER 或 MAJOR）：

### E — Top 3

1. **E-MLIRDIA-002** `explanation_label_mismatch` — 解析里 “D is wrong”，但 D 在正确答案中；`optionExplanations` 与选项文本一致，答案正确性不受影响。
2. **E-MLIRTYPE-006** `weak_distractor` — 选项 D “vector 是 tensor 上 arith ops 在 bufferize 前的 primary lowering target” 措辞太宽；官方将其定为错，独立答案定为对；实质是措辞边界。
3. **E-TVMSCH-013** / **E-XLASHP-022** — 相似的 `explanation_label_mismatch`（shuffle 后字母引用未同步）。

### F — Top 3

1. **F-BENCH-039** `explanation_label_mismatch` — 解析 “C is wrong” 但 C ∈ correctAnswers=[C,D]。
2. **F-GEMMFP16-015** `explanation_label_mismatch`。
3. **F-DIVERGE-029** `explanation_label_mismatch`。

（F 全部 40 题独立答案与官方答案一致；7 题带 label_mismatch MINOR）

### G — Top 3

1. **G-COSTMODEL-020** `weak_distractor` — 独立选 [B,C,D]（含 D 关于 warmup/JIT/clock ramp-up），官方选 [B,C]。官方解释视 D 为测量方法学问题（可用 warmup 消除），非模型—runtime 内在 gap。此题曾被 orchestrator 修复 correctAnswers 越界 bug；现行 [B,C] 与选项文本一致。
2. **G-FUSION-003** `weak_distractor` — 独立选 [A,B,C,D]，官方选 [A,B,D]。选项 C 陈述“rank/extent 差异需要编译器判断”，属现实调度考虑但非硬边界。
3. **G-PORTABILITY-026** / **G-TVMSCHED-028** — `explanation_label_mismatch`。

### H — Top 3

1. **H-MIXED-023** `weak_distractor` + `explanation_label_mismatch` — 独立选 [A,B,C,D]，官方 [A,C,D]。选项 B 关于 BF16 “master-weight optional and often omitted” 在生产实践中（Megatron-LM 等）不准确。
2. **H-ACCUM-007** / **H-FP8ACCUM-032** / **H-INT4KV-035** / **H-KERN-028** — 均为 `explanation_label_mismatch`（shuffle 副作用）。
3. **H-WQUANT-013** — 曾被 orchestrator 修复 correctAnswers 越界 bug；本轮独立复核 [C,D] 与题干、`optionExplanations`、`sourceRefs` 完全一致；解析文本有 label_mismatch MINOR。

## F 代码题正确性判断（重点）

模块 F 40 题独立答案 100% 一致。经手工逐题核验：

| 类别 | 关键题 | 判断 |
|------|--------|------|
| Shape / stride | F-BANK-003（矩阵转置 SMEM bank 冲突） | ✓ 分析正确：`tile[tx][ty]` 32-way conflict，`tile[32][33]` 消除。 |
| Launch grid | F-TLPGM-006（pid_m=17, pid_n=3） | ✓ 行 544..575、列 384..511，均在 M=2048, N=1024 内。 |
| Mask/boundary | F-TRITON-001（BLOCK=1024, N=1e6, pid=976） | ✓ 999_424..1_000_447 中 448 lane OOB 被 mask 屏蔽。 |
| Reduction | F-DOTPROD-004 | ✓ atomic_add 语义正确；mask+other=0.0 保持 sum 单位元；FP32 非结合导致 D 项错误。 |
| Online softmax | F-ONLINE-021, F-FLASHATTN-023 | ✓ `m=max(m_prev,m_new); s=s_prev·exp(m_prev−m)+s_new·exp(m_new−m)` 精确代数。 |
| Occupancy | F-OCC-030 | ✓ 65536/(96·256)=2.66→2 blocks，绑定于寄存器，25% occupancy。 |
| Arithmetic intensity | F-GEMMSM-014 | ✓ 128·128·32·2 / (128·32·4 + 32·128·4) = 32 FLOPs/B > A100 平衡点。 |
| Instruction semantics | F-MMA-016, F-CPASYNC-027, F-BARRIER-033 | ✓ warp-cooperative MMA、cp.async 语义、`__syncthreads` vs `__syncwarp` 全部与 PTX/CUDA 语义一致。 |

## MLIR / TVM / XLA 系统边界判断（模块 E）

| 系统 | 关键题 | 判断 |
|------|--------|------|
| MLIR structure | E-MLIROP-001, E-MLIRPASS-008, E-MLIRPAT-005 | ✓ Op/Region/Block/Value/Type/Attribute 定义正确；PassManager op-scoping 与 nested pipelines 一致；`-canonicalize` 折叠+DCE 行为正确。 |
| MLIR dialects | E-MLIRDIA-002, E-MLIRAFF-007, E-MLIRLIN-004, E-MLIRMEM-009, E-MLIRTYPE-006 | ✓ Trait/Interface/Dialect 三者定义一致；affine 结构性约束、`linalg.generic` matmul、strided memref、`tensor/memref/vector` 值/缓冲/寄存器语义正确。 |
| MLIR conversion | E-MLIRCONV-003, E-MLIRGPU-010 | ✓ Full vs Partial conversion 语义、`gpu.launch_func` 与 kernel 索引 bug 分析正确。 |
| TVM Relax/TensorIR | E-TVMRLX-011, E-TVMTIR-012, E-TVMSCH-013, E-TVMMETA-014, E-TVMFUS-015, E-TVMEXT-016, E-TVMVM-017 | ✓ Relax 动态 shape 优先、PrimFunc 分离 compute/schedule、schedule 原语（split/bind/cache_read）、MetaSchedule 搜索工作流、图/循环两级融合、BYOC、Relax VM 字节码运行时。 |
| XLA/StableHLO | E-HLO-018, E-STHLO-019, E-STHLOPORT-024, E-XLABUF-021, E-XLAFUS-020, E-XLASHP-022, E-XLASPMD-023 | ✓ HLO `dot` 语义、StableHLO 版本化契约、buffer assignment + in-place、fusion 分类（loop/input/output）、静态优先 + 桶/动态 op 支持、GSPMD 分区 + collective。 |
| IREE / ONNX | E-IREE-025, E-IREERT-026, E-ONNXFMT-030, E-ONNXOP-027, E-ONNXSHP-028, E-ONNXVER-029 | ✓ IREE MLIR AOT + HAL 运行时、compiler/runtime 分离动机、ONNX 交换格式 vs 运行时、opset 版本、shape inference、IR version vs opset version 严格区分。 |

## Quantization: kernel-level vs end-to-end 加速判断（模块 H）

模块 H 每道涉及"speedup"叙述的题目均已核验 scope：

| 题目 | 声明 scope | 独立判断 |
|------|------------|----------|
| H-MEMTRAFFIC-024 | 显式 batch=1 decode，dominated by weight loading | ✓ ~4× weight-load BW 减少 → decode 吞吐近 4× 提升（含 dequant-in-register 开销）。是 **BW-bound kernel-level** 加速，未包装为端到端。 |
| H-GEMM-022 | A100 INT8 vs FP16 GEMM，Case 2 M=1 | ✓ M=1 bandwidth-bound，peak-TOPS 优势无法实现；官方与独立一致。 |
| H-KVQ-025/026/027, H-INT4KV-035 | 显式 KV cache 内存足迹与 attention 内核 | ✓ 每题都明确 storage-vs-bandwidth 且区分 native quantized kernel（Hopper FP8 attention）与 dequant-in-register 路径。 |
| H-WQUANT-013 | W4A16 memory-bandwidth-bound decode / W8A8 compute-bound | ✓ [C,D] 明确对应 BW-bound vs compute-bound；A（"INT4 TC required"）、B（"W8A16 is compute-bound"）均被否决。 |
| H-FP8ACCUM-032 | H100 FP8 ~2× BF16 peak “only when memory bandwidth is not the bottleneck” | ✓ Option A 显式加了 “only when memory bandwidth is not the bottleneck” 限定，未过泛化。 |
| H-FP8-004 | E4M3 vs E5M2 use cases | ✓ 均为 scope-bounded 论断（forward vs gradient）；Ampere 无 FP8 TC 明确否决。 |
| H-CALIB-017, H-OUTLIER-018 | INT8 activation calibration | ✓ MinMax / Percentile / KL 各自适用范围清楚；outlier 敏感性明确。 |

**未发现 kernel↔e2e 混淆。** 论文 speedup 数字（H-FP8ACCUM-032 引用 H100 whitepaper 数据）均绑定硬件与 kernel 类别。

## 建议

1. **不必先修 Repair 后再进入 Round 2**：所有 135 题 BLOCKER=0、MAJOR=0，Round 1 全部 PASS。
2. **可在 Repair 阶段（可选、非阻断）批处理 `explanation` 字段的 shuffle-aware relabel**（受影响约 28 题）。`optionExplanations` 已正确，题目升级不受影响。
3. **G-COSTMODEL-020 与 H-WQUANT-013** — orchestrator 修复过 correctAnswers 越界的两题独立复核结论：现行答案实体正确。
4. **G-FUSION-003 与 G-COSTMODEL-020 的 weak_distractor** 是措辞边界问题，非答案错误，可留待 Verification 双确认。

## 输出文件

- `reviews/round1/E-independent.json`, `E-review.json`, `E-review.md`
- `reviews/round1/F-independent.json`, `F-review.json`, `F-review.md`
- `reviews/round1/G-independent.json`, `G-review.json`, `G-review.md`
- `reviews/round1/H-independent.json`, `H-review.json`, `H-review.md`
- `reviews/round1/batch2-summary.md`（本文件）
- `handoffs/review/batch2.md`（Handoff 备注）

## 独立性声明

- Phase A（30+40+30+35 = 135 题独立作答）严格只读 `reviews/blind/{E,F,G,H}.json`；未访问 `data/questions/**` 或 `data/content-cards/**`；未查阅 correctAnswers / explanation / optionExplanations / reviewStatus。
- Phase B 才引入题目全字段与 `sourceRefs` 对照。
- Reviewer sub-agent 与生成 sub-agent 不同；本 batch2 由 primary-review-{E,F,G,H} 分角色单独执行。
