# SYLLABUS – 机器学习编译知识考纲

面向 ML Infra、高性能推理、CUDA/Triton Kernel、机器学习编译器、部署与量化方向。共 14 个模块，合计 400 题。

## A. 计算机体系结构与性能模型（30 题）

- CPU / GPU / 加速器执行模型；
- SIMD 与 SIMT；
- Thread、Warp、Block、Grid；
- Cache、HBM、Shared Memory、SRAM、Register；
- Memory Hierarchy；
- Latency 与 Throughput；
- Arithmetic Intensity；
- Roofline Model；
- Compute-bound 与 Memory-bound；
- Memory Bandwidth；
- Cache Hit 与 Data Locality；
- Parallelism、Occupancy、Register Pressure；
- Amdahl 定律、Little 定律的系统直觉；
- PCIe、NVLink 与设备通信；
- Kernel Launch Overhead；
- Energy 与 Power 基本约束；
- 理论峰值与实际性能差距。

要求：**至少 8 道** 为定量或性能数据诊断题。

## B. 编译器基础与程序分析（25 题）

- Token / AST / IR；
- Basic Block、CFG；
- SSA、Phi、Dominance；
- Data-flow Analysis、Liveness、Def-use Chain；
- Alias Analysis、Escape Analysis；
- Constant Folding、Constant Propagation；
- Dead Code Elimination、Common Subexpression Elimination；
- Loop Invariant Code Motion、Inlining；
- Register Allocation、Instruction Selection；
- Pattern Rewriting；
- Partial Evaluation；
- JIT 与 AOT；
- Soundness 与 Semantic Preservation。

## C. 计算图、张量程序与中间表示（30 题）

- Eager vs. Static；
- Computational Graph / Dataflow Graph；
- Graph-level / Operator / Tensor / Loop-level / Low-level IR；
- Shape、Symbolic Shape、Dynamic Shape；
- Layout、Stride、View vs. Materialization；
- Buffer、Tensor Expression；
- Producer / Consumer；
- Region、Operation、Dialect；
- Lowering、Legalization、Type Conversion、Canonicalization；
- IR Verification；
- 三层 IR（Graph / Tensor / Loop）之间的关系。

要求：**至少 5 道** 提供 IR 片段。

## D. PyTorch Compiler 与动态图捕获（35 题）

- `torch.compile`、TorchDynamo；
- Python Bytecode 捕获；
- FX Graph；
- Guard、Recompilation、Graph Break、Fullgraph；
- Dynamic Shape、Symbolic Integer；
- FakeTensor、Functionalization、AOTAutograd；
- Forward / Backward Graph、Decomposition；
- TorchInductor、Scheduler、Fusion；
- Generated Triton Kernel；
- CPU C++ Backend；
- AOTInductor、`torch.export`；
- Compilation Cache、Eager Fallback；
- Custom Operator、Mutation、Side Effect、Python Control Flow；
- Debug Trace、Minifier / Reproducer。

要求：**至少 10 道** 提供代码 / graph break / recompile 日志。所有版本敏感题必须记录 `frameworkVersionScope` 与 `verifiedAt`。

## E. MLIR、TVM、XLA 与编译器生态（30 题）

### MLIR
- Operation / Region / Block / Value / Type / Attribute；
- Dialect、Trait、Interface；
- Pattern Rewrite；
- Pass、Dialect Conversion、Conversion Target、Type Converter；
- Partial vs. Full Lowering；
- Affine、Linalg、Tensor、MemRef、Vector、GPU、LLVM Dialect。

### TVM
- IRModule、Relax、TensorIR、PrimFunc；
- Graph-level vs. Tensor-level 优化；
- Schedule、MetaSchedule；
- Runtime、Relax VM；
- External Library；
- Target；
- Operator Fusion。

### XLA / StableHLO
- HLO / StableHLO；
- Framework/Compiler Portability；
- Fusion；
- Buffer Assignment；
- Target-independent / target-specific 优化；
- Static / Dynamic Shape；
- SPMD 基础。

### IREE / ONNX
- MLIR-based End-to-end Compilation；
- Compiler / Runtime 分离；
- Edge 部署；
- ONNX Graph、Operator Set、Shape Inference、Versioning、Model Interchange；
- 交换格式 ≠ 高性能 Runtime。

## F. CUDA、Triton 与 GPU Kernel（40 题）

- CUDA 执行模型：Grid / Block / Warp / Thread；
- Warp Scheduling、Warp Divergence；
- Global / Shared / Register / Constant Memory；
- Texture / Read-only 路径基本概念；
- Coalesced Access；
- Shared Memory Bank Conflict；
- Synchronization、Barrier、Atomic、Race Condition；
- Stream、Event、Async Copy；
- Tensor Core、MMA；
- Occupancy、Register Spill、Launch Configuration；
- CUDA Graph、Persistent Kernel；
- Reduction、Scan、GEMV、GEMM、Softmax、LayerNorm；
- Triton Program、Program ID、Block Size、Mask；
- `tl.load` / `tl.store`、Pointer Arithmetic、Block Pointer；
- Autotune、Heuristics；
- Correctness Test、Benchmark。

要求：**至少 12 道** 代码题。代码题必须明确：
- Tensor shape / dtype / stride / device；
- launch grid / block size；
- 边界条件；
- 预期行为。

## G. 图优化、循环变换、调度与自动调优（30 题）

- Operator Fusion：Vertical / Horizontal / Producer-consumer / Epilogue；
- Fusion Boundary；
- Loop Fusion、Loop Fission；
- Tiling、Blocking、Loop Reordering、Unrolling、Vectorization、Parallelization；
- Layout Transformation；
- Memory Planning、Buffer Reuse、Recomputation；
- Constant Folding、CSE、DCE；
- Shape Specialization、Kernel Selection；
- Schedule、Search Space、Cost Model；
- Autotuning、Measurement Noise、Compilation Budget；
- Cache、Transfer Tuning；
- Template-based vs. Template-free Search；
- MetaSchedule / Ansor 思想；
- Performance Portability。

重点：**优化成立条件**、**何时反而变慢**、**编译时间与运行时间权衡**、**静态 Cost Model 与真实测量差异**。

## H. 数值表示、混合精度与模型量化（35 题）

- FP32 / TF32 / FP16 / BF16 / FP8 / INT8 / INT4；
- Exponent / Mantissa、Dynamic Range、Precision；
- Overflow、Underflow、Rounding、Saturation；
- Accumulation Precision；
- Scale、Zero Point、Symmetric / Asymmetric；
- Per-tensor / Per-channel / Per-group；
- Weight-only / Weight-activation；
- Dynamic vs. Static Quantization、PTQ / QAT、Fake Quantization；
- Calibration：MinMax / Percentile / KL；
- Outlier、SmoothQuant、GPTQ、AWQ；
- Quantized GEMM、Dequantization；
- Mixed Precision；
- Accuracy / Memory / Latency 权衡；
- 硬件支持、Kernel Availability、Quantization Granularity；
- KV Cache Quantization。

要求：**至少 8 道** 要求结合硬件、Kernel 与 memory traffic 判断。

**严禁** 把 "模型更小" 写成 "必然更快"。

## I. 核心算子、融合 Kernel 与 Attention（30 题）

- GEMM、GEMV、Convolution、Reduction、Softmax；
- LayerNorm、RMSNorm；
- Embedding、Top-k、Sampling、RoPE；
- MLP、SwiGLU；
- Attention：MHA / MQA / GQA；
- Online Softmax；
- FlashAttention 思想；
- Tiling、Recomputation；
- KV Cache 读写；
- Fused QKV / Fused Norm / Fused MLP；
- MoE Routing、Grouped GEMM；
- Sparse vs. Dense Kernel 边界；
- FFT、CQT 等自定义算子。

要求：**至少 6 道** 结合 Kernel 数据流或 memory footprint；不得只考算法名称。

## J. LLM 推理优化与生成系统（30 题）

- Prefill / Decode；
- TTFT / TPOT / Inter-token Latency / Throughput；
- Batch Size、Continuous Batching、Dynamic Batching；
- Paged KV Cache、KV Cache 容量；
- Chunked Prefill、Prefix Caching；
- Speculative Decoding、Draft Model、Acceptance Rate；
- Tensor / Pipeline / Expert / Sequence Parallel；
- MoE、Weight Loading、Quantized Inference；
- CUDA Graph、Kernel Fusion；
- Model Serving Scheduler、Request Preemption；
- Memory Fragmentation；
- Disaggregated Prefill/Decode；
- vLLM / SGLang / TensorRT-LLM 架构边界；
- 延迟与吞吐权衡；
- 长上下文；
- 多租户与公平性。

要求：**至少 10 道** 为系统指标、时间线或显存诊断题。系统特定题必须限定版本或只考稳定架构原则。

## K. Runtime、模型交换与部署（30 题）

- Compiler 与 Runtime 边界；
- Dispatcher、Executor、Virtual Machine；
- Ahead-of-time Artifact；
- Dynamic Library、ABI；
- Kernel Registry；
- Device Placement、Memory Allocator、Memory Pool；
- Stream、Event、Host/Device Synchronization；
- CPU Fallback、Custom Operator、External Library；
- ONNX、Opset、StableHLO、TensorRT、AOTInductor、TVM Runtime、IREE Runtime；
- Shape Runtime；
- Model Packaging、Serialization、Version Compatibility；
- Edge 部署、Cross Compilation、Heterogeneous Execution；
- Cold Start、Compilation Cache。

## L. Profiling、Benchmark、Debug 与正确性（30 题）

- PyTorch Profiler、Nsight Systems / Compute；
- Timeline、CPU Launch Gap、Kernel Duration；
- Memory Throughput、SM Utilization、Occupancy、Warp Stall、Register Pressure、Cache Hit；
- Roofline；
- Compile Time、Graph Break、Recompilation；
- IR Dump、Generated Code；
- Numerical Tolerance、Reference Implementation、Golden Test、Differential Testing；
- Benchmark Warmup、Synchronization、Asynchronous Timing；
- CUDA Event、CPU Timer 陷阱；
- Shape Coverage、Dynamic Shape Regression、Accuracy Regression；
- NaN、Overflow、Race Condition、Non-determinism；
- Performance Noise；
- Median / Percentile / Variance；
- End-to-end 与 Microbenchmark 差异。

要求：**至少 10 道** 提供 Profiler 数据、Benchmark 代码或日志。

## M. 分布式、通信编译与异构执行（15 题）

- AllReduce、AllGather、ReduceScatter、All-to-All；
- Collective、Communication / Computation Overlap；
- Fusion、Bucketing；
- Sharding、SPMD、Device Mesh、Tensor Partition；
- Operator Sharding、Reshard；
- Communication Cost Model；
- GSPMD 基本思想；
- Pipeline；
- Host / Accelerator 协作；
- CPU / GPU / NPU 异构；
- Collective Scheduling；
- 编译器与分布式 Runtime 边界。

## N. 论文设计、系统权衡与研究判断（10 题）

- 论文为什么引入某 IR；
- 为什么分离 Compute 和 Schedule；
- 为什么需要多层 Lowering；
- 为什么用真实测量而非纯 Cost Model；
- 某个 Fusion 为何失败；
- 某优化的必要前提；
- Ablation 能支持什么；
- Benchmark 是否公平；
- Compile Time 是否被忽略；
- 是否换了算法而非仅编译优化；
- 是否使用了不同精度；
- 是否只在特定 Shape / 硬件生效；
- Peak Speedup 与 Geomean 区别；
- End-to-end 与 Kernel-level 差别；
- 单篇论文结论与领域共识区别。
