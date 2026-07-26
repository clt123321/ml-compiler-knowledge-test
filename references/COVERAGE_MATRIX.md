# COVERAGE_MATRIX.md

来源与模块覆盖矩阵。行是来源，列是模块。**●** 表示该来源可作为该模块题目的主要引用；**○** 表示可作为补充。

|  | A | B | C | D | E | F | G | H | I | J | K | L | M | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BOOK:eac3 |  | ● | ● |  |  |  | ● |  |  |  |  |  |  |  |
| BOOK:dragon2 |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| BOOK:appel |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| BOOK:hp6 | ● |  |  |  |  |  |  |  |  |  |  |  | ● |  |
| BOOK:pmpp4 | ● |  |  |  |  | ● |  |  | ● |  |  | ● |  |  |
| BOOK:sze-eff | ● |  |  |  |  |  |  | ● | ● |  |  |  |  |  |
| DOC:cuda-guide | ● |  |  |  |  | ● |  |  |  |  | ● | ● |  |  |
| DOC:cuda-best | ● |  |  |  |  | ● |  |  |  |  |  | ● |  |  |
| DOC:torch-compile |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |
| DOC:torch-dynamo |  |  |  | ● |  |  |  |  |  |  |  |  |  |  |
| DOC:torch-inductor |  |  |  | ● |  |  | ● |  |  |  |  |  |  |  |
| DOC:torch-export |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  |
| DOC:torch-aoti |  |  |  | ● |  |  |  |  |  |  | ● |  |  |  |
| DOC:torch-profiler |  |  |  | ○ |  |  |  |  |  |  |  | ● |  |  |
| DOC:mlir-langref |  |  | ● |  | ● |  |  |  |  |  |  |  |  |  |
| DOC:mlir-dialect-conversion |  |  |  |  | ● |  |  |  |  |  |  |  |  |  |
| DOC:tvm-relax |  |  |  |  | ● |  | ● |  |  |  |  |  |  |  |
| DOC:stablehlo |  |  |  |  | ● |  |  |  |  |  | ● |  |  |  |
| DOC:iree |  |  |  |  | ● |  |  |  |  |  | ● |  |  |  |
| DOC:onnx |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| DOC:triton |  |  |  |  |  | ● |  |  |  |  |  |  |  |  |
| DOC:nsys |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| DOC:ncu |  |  |  |  |  |  |  |  |  |  |  | ● |  |  |
| DOC:trt |  |  |  |  |  |  |  |  |  |  | ● |  |  |  |
| DOC:trtllm |  |  |  |  |  |  |  |  |  | ● | ● |  |  |  |
| DOC:vllm |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| DOC:sglang |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| DOC:llvm-langref |  | ● |  |  |  |  |  |  |  |  |  |  |  |  |
| PAPER:halide |  |  | ● |  |  |  | ● |  |  |  |  |  |  | ● |
| PAPER:tvm |  |  | ● |  | ● |  | ● |  |  |  |  |  |  | ● |
| PAPER:ansor |  |  |  |  |  |  | ● |  |  |  |  |  |  | ● |
| PAPER:mlir |  |  | ● |  | ● |  |  |  |  |  |  |  |  | ● |
| PAPER:triton |  |  |  |  |  | ● | ● |  |  |  |  |  |  | ● |
| PAPER:flashattn |  |  |  |  |  | ● |  |  | ● |  |  | ● |  | ● |
| PAPER:vllm |  |  |  |  |  |  |  |  |  | ● | ● |  |  | ● |
| PAPER:orca |  |  |  |  |  |  |  |  |  | ● |  |  |  | ● |
| PAPER:smoothquant |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| PAPER:gptq |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| PAPER:awq |  |  |  |  |  |  |  | ● |  |  |  |  |  |  |
| PAPER:pytorch2 |  |  |  | ● |  |  |  |  |  |  |  |  |  | ● |
| PAPER:gspmd |  |  |  |  |  |  |  |  |  |  |  |  | ● | ● |
| PAPER:specdecode |  |  |  |  |  |  |  |  |  | ● |  |  |  |  |
| PAPER:tc |  |  | ● |  |  |  | ● |  |  |  |  |  |  | ● |

## 待核验

| 项目 | 待核验点 | Owner |
|------|---------|-------|
| 《Machine Learning Systems》 | 确认最终收录版本（Chip Huyen vs. 开源教材 vs. Vijay Janapa Reddi 等） | Research R1 |
| 《Deep Learning Systems: Algorithms, Compilers, and Processors...》 | 具体出版社/年份/作者最终核验 | Research R1 |
| StableHLO 现行版本 | 最新 opset 与 verifiedAt | Research R1 |
| vLLM/SGLang/TensorRT-LLM 当前主版本 | verifiedAt 需在正式命题时刷新 | Research R4 |

`needs_source_verification` 标记的题目在 Verification 阶段仍不能升到 `agent_reviewed`，须留在人工抽查队列。
