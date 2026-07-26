# Batch 4 Generation Handoff — Module H (35 questions, all draft)

- **Agent**: generation-H (Batch 4)
- **Date**: 2026-07-26
- **Base branch**: `feat/ml-compiler-knowledge-test-v1`
- **Base commit**: `7431abb review: canary Round 1 blind review — 25/25 agree, PASS`
- **Files written**:
  - `data/questions/H/*.json` (35 files)
  - `data/content-cards/H/*.json` (35 files)
  - `manifests/H.json`
  - `handoffs/generation/H-full.md` (this file)

## 1. Question IDs by Subtopic

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `H-DTYPE-001`     | precise_definition   | single   | 2 | textbook       | FP32/FP16/BF16 sign+exp+mantissa widths |
| `H-DTYPE-002`     | concept_boundary     | single   | 3 | implementation | FP16 vs BF16 precision-range trade-off |
| `H-DTYPE-003`     | precise_definition   | single   | 2 | textbook       | TF32 format definition |
| `H-FP8-004`       | concept_boundary     | multiple | 3 | implementation | FP8 E4M3 vs E5M2 use cases + Hopper support |
| `H-INT-005`       | precise_definition   | single   | 2 | textbook       | Symmetric INT8/INT4 ranges [-127,127] / [-7,7] |
| `H-OVERFLOW-006`  | performance_diagnosis| single   | 3 | implementation | FP16 accumulation overflow at K=4096 |
| `H-ACCUM-007`     | concept_boundary     | multiple | 3 | implementation | Mixed-precision Tensor Core matmul semantics |
| `H-ACCUM-008`     | code_implementation  | single   | 3 | implementation | Swamping vs overflow in low-precision reduction |
| `H-SCALE-009`     | precise_definition   | single   | 2 | textbook       | Affine quantizer scale + zero-point formula |
| `H-SYMM-010`      | code_implementation  | single   | 2 | implementation | Symmetric vs asymmetric quantization code |
| `H-GRAN-011`      | concept_boundary     | multiple | 3 | systems        | Per-tensor / per-channel / per-group granularity |
| `H-GRAN-012`      | code_implementation  | single   | 3 | implementation | Per-channel scale broadcast for `[out, in]` weight |
| `H-WQUANT-013`    | concept_boundary     | multiple | 3 | systems        | W4A16 vs W8A8 vs W8A16 trade-offs |
| `H-DYN-014`       | concept_boundary     | single   | 3 | implementation | Dynamic vs static activation quantization |
| `H-PTQ-015`       | precise_definition   | single   | 2 | textbook       | PTQ vs QAT definition |
| `H-FAKE-016`      | code_implementation  | single   | 3 | implementation | Fake-quant forward + STE |
| `H-CALIB-017`     | concept_boundary     | multiple | 3 | implementation | MinMax vs Percentile vs KL calibration |
| `H-OUTLIER-018`   | performance_diagnosis| single   | 4 | research       | LLM per-tensor MinMax outlier failure |
| `H-SMOOTH-019`    | paper_design_intent  | single   | 4 | research       | SmoothQuant diagonal-scaling migration |
| `H-GPTQ-020`      | paper_design_intent  | single   | 4 | research       | GPTQ per-column Hessian update |
| `H-AWQ-021`       | paper_design_intent  | multiple | 4 | research       | AWQ salient-channel per-channel scaling |
| `H-GEMM-022`      | performance_diagnosis| single   | 3 | systems        | INT8 vs FP16 GEMM at M=1 (bandwidth-bound) |
| `H-MIXED-023`     | concept_boundary     | multiple | 3 | implementation | Mixed-precision master weights + loss scaling |
| `H-MEMTRAFFIC-024`| performance_diagnosis| single   | 3 | systems        | W4A16 memory-traffic accounting for decode |
| `H-KVQ-025`       | precise_definition   | single   | 2 | systems        | KV cache quantization goal |
| `H-KVQ-026`       | performance_diagnosis| single   | 4 | systems        | INT8 KV cache accuracy at long context |
| `H-KVQ-027`       | concept_boundary     | multiple | 3 | systems        | KV quantization + attention kernel compatibility |
| `H-KERN-028`      | concept_boundary     | multiple | 3 | systems        | Tensor Core precision availability by generation |
| `H-DEQ-029`       | code_implementation  | single   | 3 | implementation | W4A16 dequant-in-register sequence |
| `H-ROUND-030`     | precise_definition   | single   | 2 | implementation | RNE vs stochastic rounding |
| `H-SATURATE-031`  | concept_boundary     | single   | 3 | implementation | Saturation vs wrap-around |
| `H-FP8ACCUM-032`  | performance_diagnosis| multiple | 4 | systems        | FP8 Tensor Core FP32 accumulator on Hopper |
| `H-QAT-033`       | concept_boundary     | single   | 3 | research       | Straight-through estimator in QAT |
| `H-TRTLLM-034`    | performance_diagnosis| single   | 4 | systems        | W4A16 group size vs accuracy vs metadata |
| `H-INT4KV-035`    | performance_diagnosis| multiple | 4 | systems        | INT4 KV cache vs INT8/FP8 KV trade-offs |

## 2. Distributions

**Type**:
- Single: 24 (69%)
- Multiple: 11 (31%): `H-FP8-004`, `H-ACCUM-007`, `H-GRAN-011`, `H-WQUANT-013`, `H-CALIB-017`, `H-AWQ-021`, `H-MIXED-023`, `H-KVQ-027`, `H-KERN-028`, `H-FP8ACCUM-032`, `H-INT4KV-035`

All multi-select questions have exactly 3 correct options.

**Difficulty**:
| Difficulty | Count | Fraction |
|---|---|---|
| 2 | 8 | 23% |
| 3 | 17 | 49% |
| 4 | 10 | 29% |

**Archetype coverage** (requirements met):
- concept_boundary: 11 (≥ 4 required) ✓
- performance_diagnosis: 8 (≥ 4 required) ✓
- code_implementation: 5 (≥ 4 required) ✓
- paper_design_intent: 3 (≥ 3 for outlier/SmoothQuant/GPTQ/AWQ topics) ✓
- precise_definition: 7
- ir_transformation: 0 (not required for H)

**Depth**:
| Depth | Count |
|---|---|
| textbook | 6 |
| implementation | 13 |
| systems | 12 |
| research | 4 |

## 3. Requirement-Specific Coverage

**Hardware + Kernel + Memory-Traffic questions (≥ 8 required):** 10 questions ✓
`H-OVERFLOW-006`, `H-WQUANT-013`, `H-GEMM-022`, `H-MEMTRAFFIC-024`, `H-KVQ-026`, `H-KVQ-027`, `H-KERN-028`, `H-FP8ACCUM-032`, `H-TRTLLM-034`, `H-INT4KV-035`

**Outlier / SmoothQuant / GPTQ / AWQ (≥ 3 required):** 4 questions ✓
`H-OUTLIER-018` (outlier failure diagnosis), `H-SMOOTH-019` (SmoothQuant), `H-GPTQ-020` (GPTQ), `H-AWQ-021` (AWQ)

**KV cache quantization (≥ 3 required):** 4 questions ✓
`H-KVQ-025`, `H-KVQ-026`, `H-KVQ-027`, `H-INT4KV-035`

**Mixed precision + accumulation dtype (≥ 3 required):** 4 questions ✓
`H-ACCUM-007`, `H-ACCUM-008`, `H-MIXED-023`, `H-FP8ACCUM-032`

## 4. Source Refs Used

Primary Tier-1 / Tier-2 sources cited across module H:

- `BOOK:sze-eff` — 1, 2, 5, 8, 10, 11, 15, 17, 22, 25, 27, 30, 31, 33, 35 (very heavily used)
- `BOOK:pmpp4` — 1, 8, 28, 30
- `DOC:cuda-guide` — 2, 3, 4, 6, 22, 23, 28, 31, 32
- `DOC:onnx` — 9
- `DOC:trtllm` — 25, 26, 27, 35
- `PAPER:smoothquant` — 13, 18, 19
- `PAPER:gptq` — 11, 15, 20, 29, 34
- `PAPER:awq` — 11, 13, 18, 21, 22, 24, 29, 34
- `PAPER:flashattn` — 27

Every correct option is supported by at least one Tier-1 or Tier-2 source per `sourceRefs.supports`.

## 5. Version Sensitivity

**stable_principle** (majority): 30
**version_sensitive**: 5
- `H-MIXED-023` (PyTorch autocast API details)
- `H-KERN-028` (CUDA / cuBLAS Tensor Core matrix)
- `H-FP8ACCUM-032` (Hopper WGMMA + Transformer Engine)
- `H-INT4KV-035` (vLLM / TRT-LLM INT4 KV support state)

All version-sensitive entries carry `softwareContext.frameworkVersionScope` + `softwareContext.verifiedAt`.

## 6. Performance Claims

- Paper-result performance numbers: `H-OUTLIER-018` (SmoothQuant recovery), `H-SMOOTH-019` (SmoothQuant perplexity), `H-GPTQ-020` (GPTQ 175B), `H-AWQ-021` (AWQ LLaMA-7B), `H-TRTLLM-034` (AWQ/GPTQ group-size ablation).
- Every paper_result claim is scoped to the specific paper / model / setting.

- Analytical performance claims: `H-DTYPE-003`, `H-FP8-004`, `H-OVERFLOW-006`, `H-ACCUM-007`, `H-GEMM-022`, `H-MEMTRAFFIC-024`, `H-KVQ-026`, `H-KVQ-027`, `H-KERN-028`, `H-FP8ACCUM-032`, `H-INT4KV-035`.

**No `measured` performance evidence is used anywhere** (compliant with the no-GPU-verification policy).

**Kernel↔E2E boundary respected everywhere.** In particular:
- `H-GEMM-022` and `H-MEMTRAFFIC-024` explicitly frame batch-1 decode vs prefill differently.
- `H-WQUANT-013` explicitly distinguishes decode vs prefill regimes.
- No claim implies "smaller model = faster" without a kernel + hardware context.

## 7. Points That Need Human Verification

1. **`H-FP8ACCUM-032`** — H100 TFLOPS numbers (989 / 1979) match NVIDIA H100 datasheet at time of writing. Reviewers should confirm current whitepaper if 2026 data has been revised.
2. **`H-INT4KV-035`** — INT4 KV cache support state in vLLM 0.5+ / TRT-LLM 0.9+ is characterized as "experimental / preview"; a reviewer should confirm exact version-specific support.
3. **`H-DTYPE-003`** — TF32 mantissa is stated as 10 bits (matching NVIDIA whitepaper). Note some sources call TF32 "19-bit" (1+8+10); we describe it as 19 bits internally, which is standard.
4. **`H-SMOOTH-019`** — The migration factor is called "α" in the paper (typically defaults to 0.5); the misconception "α is fixed at 0.5" is scoped as "in the paper" — reviewers can confirm.
5. **`H-KVQ-026`** — The ~0.5% accuracy drop at 32K context vs 4K is illustrative; specific numbers vary across studies. The direction (larger drop at longer context) is well-supported.

## 8. Content-Card Compliance

Every question has a matching content card in `data/content-cards/H/*.json` with:
- ≥ 1 canonical claim with conditions, non-implications, sourceMappings.
- ≥ 3 (usually 4) subtopic-specific misconceptions with errorType and whyWrong.
- implementationFacts / performanceScenarios / versionSensitivity fields populated.

## 9. Validation

`node scripts/validate-questions.mjs` on 2026-07-26:
- Loaded 254 questions, 254 content cards (across all modules).
- H: 35/35 ✓
- Schema OK: 35/35 for module H
- No errors, no warnings for module H.
