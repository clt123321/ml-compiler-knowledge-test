# OFFICIAL_DOCS.md — 官方文档登记

引用时必须记录 `verifiedAt`；对于 stability 为 `version_sensitive` 的条目，题目必须记录 `frameworkVersionScope` 或 `compilerVersionScope`。

## PyTorch 与编译栈

| 项目 | 文档 | Topic | Stability | 官方链接 |
|------|------|-------|-----------|---------|
| PyTorch | `torch.compile` | dynamo/fullgraph/dynamic/mode | version_sensitive | https://pytorch.org/docs/stable/torch.compiler.html |
| PyTorch | TorchDynamo | bytecode capture / guards | version_sensitive | https://pytorch.org/docs/stable/torch.compiler_dynamo_overview.html |
| PyTorch | TorchInductor | scheduler / fusion / codegen | version_sensitive | https://pytorch.org/docs/stable/torch.compiler_inductor.html |
| PyTorch | AOTAutograd | forward/backward graph, decomposition | version_sensitive | https://pytorch.org/docs/stable/torch.compiler_aot_inductor.html |
| PyTorch | `torch.export` | graph capture for AOT | version_sensitive | https://pytorch.org/docs/stable/export.html |
| PyTorch | AOTInductor | packaged AOT artifact | version_sensitive | https://pytorch.org/docs/stable/torch.compiler_aot_inductor.html |
| PyTorch | Profiler | timeline / kineto | version_sensitive | https://pytorch.org/docs/stable/profiler.html |

## MLIR / TVM / XLA / IREE / ONNX

| 项目 | 文档 | Topic | Stability | 官方链接 |
|------|------|-------|-----------|---------|
| MLIR | Language Reference | Op/Region/Block/Type/Attribute/Dialect | stable_principle | https://mlir.llvm.org/docs/LangRef/ |
| MLIR | Pattern Rewriter | rewriting infrastructure | stable_principle | https://mlir.llvm.org/docs/PatternRewriter/ |
| MLIR | Dialect Conversion | conversion target / type converter | stable_principle | https://mlir.llvm.org/docs/DialectConversion/ |
| TVM | Relax / TensorIR | high-level & tensor-level | version_sensitive | https://tvm.apache.org/docs/ |
| TVM | Runtime & Relax VM | executor / packed func | version_sensitive | https://tvm.apache.org/docs/reference/api/python/runtime.html |
| OpenXLA | Overview | HLO / hardware backends | version_sensitive | https://openxla.org |
| StableHLO | Spec | opset & semantics | stable_principle | https://openxla.org/stablehlo |
| IREE | Compiler / Runtime | end-to-end MLIR compilation | version_sensitive | https://iree.dev |
| ONNX | Spec / Operator Set / Shape Inference | operator schema / versioning | stable_principle | https://onnx.ai |

## CUDA / Triton / TensorRT

| 项目 | 文档 | Topic | Stability | 官方链接 |
|------|------|-------|-----------|---------|
| NVIDIA | CUDA C++ Programming Guide | execution / memory / async / TC | version_sensitive | https://docs.nvidia.com/cuda/cuda-c-programming-guide/ |
| NVIDIA | CUDA C++ Best Practices Guide | coalesced access / occupancy / launch | version_sensitive | https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/ |
| NVIDIA | Nsight Systems | timeline / kernel gap | version_sensitive | https://docs.nvidia.com/nsight-systems/ |
| NVIDIA | Nsight Compute | kernel metrics | version_sensitive | https://docs.nvidia.com/nsight-compute/ |
| OpenAI / Triton | Language & Tutorials | kernel authoring | version_sensitive | https://triton-lang.org |
| NVIDIA | TensorRT | plan / engine / dynamic shape | version_sensitive | https://docs.nvidia.com/deeplearning/tensorrt/ |
| NVIDIA | TensorRT-LLM | LLM serving | version_sensitive | https://nvidia.github.io/TensorRT-LLM/ |

## LLM Serving

| 项目 | 文档 | Topic | Stability | 官方链接 |
|------|------|-------|-----------|---------|
| vLLM | Docs | PagedAttention / scheduler / batching | version_sensitive | https://docs.vllm.ai |
| SGLang | Docs | radix attention / continuous batching | version_sensitive | https://sgl-project.github.io/ |

## LLVM

| 项目 | 文档 | Topic | Stability | 官方链接 |
|------|------|-------|-----------|---------|
| LLVM | Language Reference | LLVM IR | stable_principle | https://llvm.org/docs/LangRef.html |

## 使用注意

* 表中 `verifiedAt` 由 `references/SOURCE_REGISTRY.json` 每条条目单独记录；
* 出题时对 `version_sensitive` 项必须在 `softwareContext.frameworkVersionScope`/`compilerVersionScope` 中限定；
* Nsight / Profiler 输出的具体格式版本敏感，题目应聚焦语义（如 "kernel duration"、"launch gap"），不做特定 UI 字段考察。
