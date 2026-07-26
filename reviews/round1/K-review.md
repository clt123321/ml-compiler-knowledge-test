# Module K — Primary Review (Round 1)

- Reviewer: primary-review-3
- Reviewed at: 2026-07-27
- Total questions: 30
- Answer agreement rate: 30/30 (100%)
- PASS: 30, MINOR: 0, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0 (all `version_sensitive` questions carry `frameworkVersionScope` + `verifiedAt`)
- Hardware conditions sufficient: 30/30
- Explanation label mismatches: 0

## Summary

Module K ("Runtime, model interchange, and deployment") is the cleanest module of this batch — **30/30 PASS**, zero issues. The domain covers ABI stability, allocators, AOT vs JIT, AOTInductor, compiler/runtime boundary, cold start + compilation cache, cross compilation, custom operators, dispatcher/executor, external libraries, CPU fallback, heterogeneous execution, IREE, ONNX (format vs runtime, shape inference, IR-version vs opset-version), packaging/serialization, device placement, kernel registry, dynamic shapes, StableHLO, CUDA streams/events, host/device sync, TensorRT (builder/engine/plan), TVM Relax VM, and bytecode VM design.

Every question correctly separates **compile-time-vs-runtime responsibilities**, **compiler-vs-runtime boundaries**, and **stable principles vs version-sensitive implementation details**.

## Compiler-vs-runtime boundary check (the specific focus of this batch)

The module correctly captures the boundary in multiple angles:

| Question | Boundary correctly stated? |
|---|---|
| K-BOUND-001 | Yes — compiler emits kernels + lowered artifact with fixed plan; runtime dispatches, allocates, handles shape branches. |
| K-DISPATCH-002 | Yes — dispatcher routes based on (op, device, dtype, layout, autograd key). |
| K-REGISTRY-006 | Yes — registry maps (op, device, dtype, layout, …) to callable, consulted at run time. |
| K-CUSTOM-012 | Yes — author provides schema + kernel + backward; runtime does no auto-differentiation or auto-schema. |
| K-AOT-004 | Yes — AOT compiles ahead; JIT compiles lazily on first call. |
| K-AOTI-022 | Yes — AOTInductor produces self-contained .so, no Python/Inductor at runtime. |
| K-AOTIRT-023 | Yes — C-ABI entry with device pointers; bundles Triton/CUDA kernels; Inductor NOT required at runtime. |
| K-TRT-019 | Yes — builder produces plan, runtime deserializes + executes. Builder ≠ runtime. |
| K-TRTBUILD-021 | Yes — 8 min is build cost (offline), not per-inference — canonical misdiagnosis trap. |
| K-VM-003 / K-TVMRT-024 | Yes — VM expresses host-side control flow around precompiled kernels. |
| K-IREE-025 | Yes — MLIR compilation pipeline (compiler) + VM + HAL (runtime). |
| K-STHLO-018 | Yes — StableHLO is a portable IR, not a runtime engine. |

**ONNX-related batch (K-ONNX-014, K-ONNXSHAPE-016, K-ONNXVER-017, K-OPSET-015)** correctly separates:
- ONNX = serialization format for a graph of standardized ops with a versioned opset (K-ONNX-014).
- ONNX shape inference is per-op via schemas, supports symbolic dims (K-ONNXSHAPE-016). No overclaim that all shapes are concrete.
- IR version = file/graph format layout; opset version = operator semantics — canonical distinction (K-ONNXVER-017).
- Opset version encodes per-op schema semantics; consumer must support declared opset (K-OPSET-015).

**TensorRT plan portability (K-TRTPLAN-020)** correctly captures the version-sensitive constraints:
- Shape ranges baked in at build (out-of-range → rebuild).
- Compute capability specific (sm_80 plan not guaranteed on sm_90).
- Not backward/forward compatible across TRT major versions.
- Plan is self-contained (no ONNX needed at runtime) — B correctly rejected.

**CUDA runtime (K-STREAM-009, K-SYNC-010, K-ALLOC-008)** correctly captures:
- Stream = in-order queue; event = sync marker recorded on a stream.
- streamSynchronize blocks on that stream; deviceSynchronize drains all.
- Caching allocator amortizes synchronous cudaMalloc/Free cost.
- K-SYNC-010 correctly rejects the "MemcpyAsync guaranteed overlap without pinned memory" overclaim.

## ABI / packaging (K-ABI-005, K-PKG-027)

- K-ABI-005: standard practice = expose C ABI (extern "C", POD, opaque handles). Explicitly rejects the "C++ STL is layout-compatible across compilers" myth.
- K-PKG-027: complete package = graph + weights + signatures + preprocessing/postprocessing metadata + schema version.

## Cross compilation & heterogeneous execution (K-CROSS-028, K-HET-029, K-PLACE-007, K-FALLBACK-011)

- K-CROSS-028: correctly captures PTX/SPIR-V as deferred final lowering; autotuning without target needs static/measured tables.
- K-HET-029: NPU restricted op coverage → asymmetric partitioning; explicit transfers between subgraphs.
- K-PLACE-007: minimize host↔device transitions on critical path; alternation in hot loop dominates latency.
- K-FALLBACK-011: canonical D2H → CPU op → H2D round-trip cost.

## Cold start / dynamic shapes (K-COLD-030, K-SHAPE-026)

- K-COLD-030: correctly separates 4 cold-start phases (process init, model load, JIT compile, warmup), each with own mitigation. Correctly rejects "cached and fresh must be bitwise identical" overclaim.
- K-SHAPE-026: bucketing trade-off; symbolic dim descriptors; min/opt/max ranges. Correctly rejects "fully-dynamic == fully-static in cost" overclaim.

## Version-sensitive coverage

| Question | Framework scope | verifiedAt | Verdict |
|---|---|---|---|
| K-AOTI-022 | PyTorch 2.3 ~ 2.5 | 2026-07-26 | Correctly scoped |
| K-AOTIRT-023 | PyTorch 2.3 ~ 2.5 | 2026-07-26 | Correctly scoped |
| K-IREE-025 | IREE 2024+ | 2026-07-26 | Correctly scoped |
| K-TVMRT-024 | TVM Unity (Relax, 2024) | 2026-07-26 | Correctly scoped |

All other 26 questions correctly declared `stable_principle` (ABI concepts, allocator, dispatcher, ONNX format, standard runtime concepts, standard CUDA API, standard TensorRT deployment flow — none of which are version-fragile).

## Sources

All 30 questions cite Tier 1 sources (official PyTorch docs, ONNX spec, CUDA best practices, TensorRT dev guide, IREE MLIR docs, TVM docs, LLVM refs, standard textbooks). No Tier 3 unique-support cases.

## Recommendation

Module K is clean and ready to promote to Round 2 verification without any repair. All 30 questions can move to `agent_reviewed` after Round 2 confirmation.

## Top 3 most severe

None. All 30 questions PASS with zero issues. This is the cleanest module of the four-module batch.
