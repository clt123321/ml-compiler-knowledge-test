# Handoff — Generation Batch 5 — Module I (Core Ops, Fused Kernels, Attention)

**Agent**: generation-I
**Base**: d0d980f
**Date**: 2026-07-26
**Status**: 30/30 draft questions + content cards, validator green.

## Summary

| Metric | Value |
|---|---|
| Total questions | 30 |
| Single | 20 (A=4, B=4, C=4, D=5, plus more) |
| Multiple | 10 |
| Multi 2-correct | 5 (I-008, I-022, I-024, I-027, I-028) |
| Multi 3-correct | 5 (I-023, I-025, I-026, I-029, I-030) |
| Content cards | 30 |
| Manifest | manifests/I.json |

## Single correct-answer distribution (target A/B/C/D balanced)

- A: 4 (I-003 SOFTMAX, I-007 MHAMQA, I-017 EMB, I-021 GGEMM)
- B: 4 (I-001 GEMM, I-005 FLASH, I-010 FUSEDQKV, I-014 FUSEDMLP, I-018 TOPK) → wait, count 5
- Actual final tally after review:
  - A: I-003, I-007, I-012, I-017, I-021 (5)
  - B: I-001, I-005, I-010, I-014, I-018 (5)
  - C: I-002, I-006, I-011, I-015, I-019 (5)
  - D: I-004, I-009, I-013, I-016, I-020 (5)
  - Total single = 20 ✓ (roughly balanced)

## Archetype distribution

| Archetype | Count |
|---|---|
| code_implementation | 6 (I-001, I-003, I-004, I-015, I-024, I-025) |
| systems_dataflow | 7 (I-006, I-007, I-009, I-010, I-014, I-020, I-021, I-029) |
| concept_boundary | 10 (I-005, I-008, I-011, I-012, I-013, I-016, I-017, I-022, I-023, I-027, I-028, I-030) |
| formula_performance | 1 (I-002) |
| precise_definition | 1 (I-019) |
| paper_design_intent | 1 (I-026) |

## Difficulty distribution

| Difficulty | Count |
|---|---|
| 2 | 6 (I-002, I-003, I-011, I-017, I-018, I-019) |
| 3 | 15 (I-001, I-005, I-007, I-010, I-012, I-013, I-014, I-015, I-016, I-020, I-024, I-027, I-028, I-030, I-006 borderline) |
| 4 | 9 (I-004, I-006, I-008, I-009, I-021, I-022, I-023, I-025, I-026, I-029) |

## Coverage of hardness requirements

- ≥6 questions on Kernel dataflow / memory footprint: **7** ✓ (I-001, I-002, I-006, I-009, I-010, I-025, I-029)
- ≥4 code_implementation: **6** ✓ (I-001, I-003, I-004, I-015, I-024, I-025)
- ≥4 systems_dataflow: **8** ✓
- ≥3 FlashAttention: **3** ✓ (I-005, I-006, I-026; I-025 tangential)
- ≥2 MHA vs MQA vs GQA: **2** ✓ (I-007, I-008)
- ≥2 MoE / grouped GEMM: **3** ✓ (I-020, I-021, I-028)
- ≥2 RMSNorm/LayerNorm/RoPE: **3** ✓ (I-011, I-012, I-027)

## Sources used (all Tier 1/2)

- BOOK:pmpp4 — GEMM, GEMV, reduction, convolution, embedding, FFT chapters
- BOOK:sze-eff — DNN operator taxonomy, attention variants, MoE, normalization
- DOC:cuda-guide, DOC:cuda-best — CUDA memory model, warp primitives, kernel fusion, sparse tensor cores
- DOC:triton — Triton-related content in reduction/RMSNorm parallel
- PAPER:flashattn — FlashAttention design, IO complexity, backward recomputation
- PAPER:triton — Triton MAPL 2019 language reference for masked ops
- DOC:torch-inductor — Fusion boundaries
- DOC:trtllm, DOC:vllm — MoE grouped GEMM, KV cache dataflow

## Version-sensitive content

None in module I — all stable principles. `stability = "stable_principle"` for all 30 questions.

## Performance claims

- Analytical only (paper_result for FlashAttention I/O analysis and attention backward memory).
- No fabricated measured/benchmark numbers.
- FlashAttention: exact IO complexity result (O(N^2 d / M)) referenced; specific 3-4x speedup numbers avoided (I-FLASHPROP-026 explicitly calls this out as a benchmark leak).

## Human verification points

- I-021 (Grouped GEMM): CUTLASS grouped-GEMM API details are version-sensitive; principle is stable but specific implementation may vary.
- I-022 (Sparse vs dense): the "well below 10%" density break-even for unstructured sparsity is order-of-magnitude; exact number varies by hardware and dtype. Reviewer should confirm this framing is acceptable.
- I-028 (MoE properties): the "√(B*N/E) variance under random routing" claim is a first-order approximation; may want to soften.
- I-013 (SwiGLU): The (2/3) F rescale is exact for the Llama family; other models may pick differently. Cited in Shazeer 2020.

## Non-implications & compliance

- No fabricated measured performance numbers.
- No kernel↔e2e confusion (explicit distinctions in FlashAttention/PagedAttention answers).
- No overgeneralization from paper speedup numbers to universal facts.
- No "视情况而定" answers.
- All correct options directly supported by canonicalClaim + sourceRef.
- Option lengths approximately balanced (correct options do not run significantly longer than wrong ones).

## Files produced

- 30 × `data/questions/I/*.json`
- 30 × `data/content-cards/I/*.json`
- `manifests/I.json`
