# Explanation Label Scan (Release Phase)

- Generated: 2026-07-27
- Total questions with explicit option-letter references in explanation: **106**
- Likely stale (letter reference conflicts with current correctAnswers): **2**
- Note-only (labels consistent with correctAnswers OR unclear stance): **104**

## Policy

- 只报告，不批量替换；
- 明确冲突（severity=MAJOR）题目进入人工审查队列，Repair Agent 再逐题修复；
- severity=NOTE 的引用视为可接受的解析行文。

## Likely Stale Hits (MAJOR)

| Question | Module | correctAnswers | Conflicting Letters |
|----------|--------|----------------|---------------------|
| G-REORDER-010 | graph_opt_schedule | [D] | A(positive) |
| K-ONNXVER-017 | runtime_deploy | [B] | A(positive) |

## NOTE Hits (informational, no action required)

Total: 104

| Question | Module | correctAnswers | Labels mentioned |
|----------|--------|----------------|------------------|
| A-BANK-022 | arch_perf_model | [D] | D |
| A-BATCH-028 | arch_perf_model | [D] | B |
| A-INTENSE-019 | arch_perf_model | [B] | A |
| A-NVLINK-014 | arch_perf_model | [A] | A |
| A-PEAK-018 | arch_perf_model | [B] | A |
| A-POWER-029 | arch_perf_model | [D] | B |
| A-REGSPILL-025 | arch_perf_model | [C] | B |
| A-TC-023 | arch_perf_model | [D] | B |
| B-CPROP-010 | compiler_basics | [B] | B |
| B-CSE-012 | compiler_basics | [C] | C |
| B-DEFUSE-006 | compiler_basics | [C] | B |
| B-DOMTREE-025 | compiler_basics | [D] | B |
| B-ESCAPE-008 | compiler_basics | [D] | B |
| B-INSTSEL-016 | compiler_basics | [B] | B |
| B-LICM-013 | compiler_basics | [D] | D |
| B-LOOPINV-023 | compiler_basics | [C] | B |
| B-PARTIAL-018 | compiler_basics | [A] | B |
| B-REGALLOC-015 | compiler_basics | [D] | B |
| B-SSAFORM-024 | compiler_basics | [D] | B |
| C-GRAPH-025 | graph_tensor_ir | [B,C,D] | B |
| D-EXPORT-018 | pytorch_compiler | [A,B,D] | A |
| E-MLIRDIA-002 | mlir_tvm_xla | [A,B,D] | A |
| E-MLIRTYPE-006 | mlir_tvm_xla | [B,C] | B |
| E-TVMSCH-013 | mlir_tvm_xla | [B,C,D] | B |
| E-XLASHP-022 | mlir_tvm_xla | [A,C,D] | A |
| F-BENCH-039 | cuda_triton_kernel | [C,D] | C |
| F-DIVERGE-029 | cuda_triton_kernel | [B,C,D] | B |
| F-FLASHATTN-023 | cuda_triton_kernel | [C,D] | C |
| F-GEMMFP16-015 | cuda_triton_kernel | [B,C] | B |
| F-LN-020 | cuda_triton_kernel | [C] | C |
| F-SOFTMAX-019 | cuda_triton_kernel | [C] | C |
| F-STREAM-026 | cuda_triton_kernel | [C,D] | C |
| F-TLPGM-006 | cuda_triton_kernel | [A] | B |
| G-ANSOR-024 | graph_opt_schedule | [A] | B,C,D |
| G-AUTOTUNE-021 | graph_opt_schedule | [D] | B,D |
| G-BUDGET-029 | graph_opt_schedule | [A,B,D] | A |
| G-CFCSE-017 | graph_opt_schedule | [B] | B,D |
| G-COSTMODEL-020 | graph_opt_schedule | [B,C] | A,D |
| G-FUSION-005 | graph_opt_schedule | [C] | C |
| G-HALIDE-025 | graph_opt_schedule | [D] | B |
| G-INDUCTOR-027 | graph_opt_schedule | [A] | B,C,D |
| G-KERNSEL-019 | graph_opt_schedule | [B] | B,C,D |
| G-MEMPLAN-015 | graph_opt_schedule | [D] | B,C,D |
| G-PORTABILITY-026 | graph_opt_schedule | [A,C,D] | A |
| G-TVMSCHED-028 | graph_opt_schedule | [B,C,D] | B |
| G-UNROLL-011 | graph_opt_schedule | [D] | D |
| G-VECTOR-012 | graph_opt_schedule | [B] | A |
| H-ACCUM-007 | quantization | [A,C,D] | A |
| H-ACCUM-008 | quantization | [D] | B,C,D |
| H-CALIB-017 | quantization | [B,C,D] | B |
| H-DEQ-029 | quantization | [B] | B,C,D |
| H-DTYPE-002 | quantization | [C] | C |
| H-DTYPE-003 | quantization | [D] | B |
| H-DYN-014 | quantization | [C] | B,C,D |
| H-FAKE-016 | quantization | [C] | C,D |
| H-FP8ACCUM-032 | quantization | [A,C,D] | A |
| H-GEMM-022 | quantization | [C] | B |
| H-GPTQ-020 | quantization | [A] | B |
| H-GRAN-012 | quantization | [B] | B,D |
| H-INT-005 | quantization | [C] | B,C,D |
| H-INT4KV-035 | quantization | [A,C,D] | A |
| H-KVQ-025 | quantization | [D] | B,C,D |
| H-KVQ-026 | quantization | [A] | B,C,D |
| H-KVQ-027 | quantization | [A,B,D] | A |
| H-MEMTRAFFIC-024 | quantization | [C] | C,D |
| H-MIXED-023 | quantization | [A,C,D] | A |
| H-OUTLIER-018 | quantization | [B] | B |
| H-OVERFLOW-006 | quantization | [A] | B,C,D |
| H-PTQ-015 | quantization | [D] | B |
| H-QAT-033 | quantization | [C] | B |
| H-ROUND-030 | quantization | [B] | B |
| H-SATURATE-031 | quantization | [B] | A |
| H-SCALE-009 | quantization | [B] | B |
| H-SMOOTH-019 | quantization | [C] | B,C,D |
| H-SYMM-010 | quantization | [B] | B |
| H-TRTLLM-034 | quantization | [A] | B |
| I-ATTBACK-025 | core_ops_attention | [A,B,C] | A |
| I-EPILOGUE-024 | core_ops_attention | [B,D] | B |
| I-FLASHPROP-026 | core_ops_attention | [B,C,D] | B |
| I-FUSEDPROP-030 | core_ops_attention | [B,C,D] | B |
| I-KVDF-029 | core_ops_attention | [A,B,D] | A |
| I-MOEPROP-028 | core_ops_attention | [C,D] | C |
| I-RMSPROP-027 | core_ops_attention | [A,B] | A |
| I-SPARSE-022 | core_ops_attention | [B,D] | B |
| J-DISAG-029 | llm_inference | [A,C] | A |
| J-FAIRTHR-030 | llm_inference | [A,B,D] | A |
| J-OOM-028 | llm_inference | [B,C,D] | B |
| J-PAGEDDES-024 | llm_inference | [A,C,D] | A |
| J-SPECPROP-023 | llm_inference | [B,D] | B |
| J-TVL-027 | llm_inference | [A,C] | A |
| K-PKG-027 | runtime_deploy | [C] | A |
| L-ASYNC-007 | profiling_debug | [B] | A |
| L-CACHE-025 | profiling_debug | [D] | A |
| L-DETERM-017 | profiling_debug | [B,D] | B |
| L-DYNREG-013 | profiling_debug | [A,C,D] | A |
| L-E2E-020 | profiling_debug | [A] | A |
| L-GOLDEN-009 | profiling_debug | [C] | B |
| L-IRDUMP-028 | profiling_debug | [D] | B |
| L-NAN-015 | profiling_debug | [B] | A |
| L-OCC-022 | profiling_debug | [B] | A |
| L-PCTL-019 | profiling_debug | [D] | A |
| L-ROOFLINE-021 | profiling_debug | [D] | A |
| L-SHAPECOV-012 | profiling_debug | [C] | A |
| L-STREAM-008 | profiling_debug | [A] | A,B,C,D |
