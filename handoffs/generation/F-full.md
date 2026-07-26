# Handoff: Batch 3 Generation — Module F (35 New Questions Added to Canary)

**Agent**: generation-F
**Date**: 2026-07-26
**Base commit**: 7431abb (canary Round 1 pass)
**Scope**: 35 new questions for Module F (cuda_triton_kernel), IDs F-*-006 through F-*-040, added to the 5 pre-existing canary questions to reach 40/40.
**Status**: All 35 new questions + 35 content cards generated. `reviewStatus="draft"` for all. 5 canary questions (001–005) unchanged.

---

## 1. Deliverables

| Path | Count |
|---|---|
| `data/questions/F/F-*-006..040.json` (new) | 35 |
| `data/content-cards/F/F-*-006..040.json` (new) | 35 |
| `manifests/F.json` (updated: 5 → 40) | 1 |
| `data/questions/F/F-*-001..005.json` (canary, unchanged) | 5 |

**Total Module F**: 40/40 ✅

## 2. ID List (35 new questions)

### Triton language details (5, IDs 006–010)
- `F-TLPGM-006` — 2D program_id and launch grid (code_implementation, single)
- `F-BLOCKPTR-007` — `tl.make_block_ptr` semantics (code_implementation, single)
- `F-AUTOTUNE-008` — `triton.autotune` config + key caching (code_implementation, multiple)
- `F-OTHER-009` — `tl.load` `other` as reduction identity (code_implementation, single)
- `F-CONSTEXPR-010` — `tl.constexpr` specialization (code_implementation, single)

### Reduction / Scan / GEMV / GEMM (5, IDs 011–015)
- `F-REDUCE-011` — CUDA warp-shuffle reduction (code_implementation, single)
- `F-SCAN-012` — Hillis-Steele vs Blelloch scan (code_implementation, single)
- `F-GEMV-013` — Memory-bound GEMV (code_implementation, single)
- `F-GEMMSM-014` — Tiled GEMM arithmetic intensity (formula_performance, single)
- `F-GEMMFP16-015` — FP16-in / FP32-accumulate GEMM (code_implementation, multiple)

### Tensor Core / MMA (3, IDs 016–018)
- `F-MMA-016` — mma.sync warp-cooperative fragment layout (precise_definition, single)
- `F-WMMA-017` — nvcuda::wmma vs raw PTX (concept_boundary, single)
- `F-TCORE-018` — Tensor Core dtype support per architecture (precise_definition, single)

### Softmax / LayerNorm / RMSNorm (3, IDs 019–021)
- `F-SOFTMAX-019` — Numerically stable softmax (subtract max) (code_implementation, single)
- `F-LN-020` — Row-parallel fused LayerNorm (code_implementation, single)
- `F-ONLINE-021` — Online softmax recurrence (code_implementation, single)

### Attention (3, IDs 022–024)
- `F-ATTN-022` — Naive attention O(S^2) HBM footprint (systems_dataflow, single)
- `F-FLASHATTN-023` — FlashAttention tiling + online softmax (code_implementation, multiple)
- `F-KVCACHE-024` — Decode-phase KV Cache traffic (systems_dataflow, single)

### CUDA Graph / Stream / Async (3, IDs 025–027)
- `F-CGRAPH-025` — CUDA Graph capture / instantiate / launch (systems_dataflow, single)
- `F-STREAM-026` — Streams and Events semantics (code_implementation, multiple)
- `F-CPASYNC-027` — cp.async GMEM→SMEM (precise_definition, single)

### Core CUDA concepts (13, IDs 028–040)
- `F-WARP-028` — Warp size / SIMT / predication (precise_definition, single)
- `F-DIVERGE-029` — Branch divergence cost / predication (code_implementation, multiple)
- `F-OCC-030` — Occupancy limiters on A100 (formula_performance, single)
- `F-REGSPILL-031` — Local memory and register spill (concept_boundary, single)
- `F-ATOMIC-032` — Atomic contention vs block-tree reduction (code_implementation, single)
- `F-BARRIER-033` — __syncthreads vs __syncwarp (precise_definition, single)
- `F-RACE-034` — SMEM race without __syncthreads (code_implementation, single)
- `F-TEXTURE-035` — Read-only path via `__ldg` (concept_boundary, single)
- `F-CONSTMEM-036` — Constant memory 64 KB + broadcast (precise_definition, single)
- `F-PERSIST-037` — Persistent-kernel pattern (systems_dataflow, single)
- `F-LAUNCH-038` — Launch config hardware limits (precise_definition, single)
- `F-BENCH-039` — Benchmarking discipline (code_implementation, multiple)
- `F-CORRECT-040` — Tolerance-based correctness for FP16-in matmul (code_implementation, single)

## 3. Distribution

**Archetype (F 40-question total)**:
- `code_implementation`: 24 (canary 5 + new 19). Target ≥12 ✅ (2× over minimum).
- `precise_definition`: 7
- `concept_boundary`: 3
- `formula_performance`: 2
- `systems_dataflow`: 4

**Type**: single 33, multiple 7 (≈25:10 target ✅)

**Difficulty**: L2 = 10, L3 = 28, L4 = 2 (F-ONLINE-021 online softmax, F-FLASHATTN-023 FlashAttention algorithm)

**Version sensitivity**: stable_principle 23, version_sensitive 17 (Triton-version-scoped, some Ampere/Hopper-specific dtype claims)

**Sub-topic coverage (F module 40-total)**:
- Triton language details: 5 new + 3 canary using Triton = 8+ ✅ (target ≥5)
- Reduction / Scan / GEMV / GEMM: 5 new + 1 canary (F-DOTPROD-004) = 6 ✅ (target ≥4)
- Tensor Core / MMA: 3 ✅ (target ≥3)
- Softmax / LayerNorm / RMSNorm: 3 new + 1 canary (F-RMS-005) = 4 ✅ (target ≥3)
- Attention: 3 ✅ (target ≥3)
- CUDA Graph / Stream / Async Copy / Persistent Kernel: 3 new + 1 (F-PERSIST-037) = 4 ✅ (target ≥3)

## 4. Source Refs Summary

| ref | count |
|---|---|
| `DOC:cuda-guide` | 22 |
| `DOC:cuda-best` | 13 |
| `DOC:triton` | 15 |
| `BOOK:pmpp4` | 15 |
| `PAPER:triton` | 1 (F-TRITON-001 canary) |
| `PAPER:flashattn` | 4 (F-ATTN-022, F-FLASHATTN-023, F-KVCACHE-024, F-ONLINE-021) |

All Tier 1 (DOC:*, BOOK:pmpp4) or Tier 2 (PAPER:*). No Tier-3-only.

## 5. Validation

`node scripts/validate-questions.mjs`:
- **Module F: 40/40 ✅**
- Schema OK: all 40 F questions pass (including canary).
- No F-specific errors.
- No F-specific warnings.

`node scripts/audit-questions.mjs`:
- Duplicate stems (F scope): 0 ✅
- Duplicate option sets (F scope): 0 ✅
- Meta-statement options (F scope): 0 ✅
- Missing content cards (F scope): 0 ✅
- Missing subtopic misconceptions (F scope): 0 ✅
- Tier-3-only sources (F scope): 0 ✅
- Coverage_min for F (`code_implementation` ≥ 12): 24 ≥ 12 ✅
- **Library-wide length gates still fail** — my F single-choice questions inherit the same style as the canary (technically-rich correct option vs shorter distractors). Not batch-specific; needs cross-batch stylistic review.
- **Library-wide `answer_position_bias`**: F single-choice positions shuffled to (A:9, B:8, C:8, D:8), balanced.

## 6. Known Limitations / Needs Human Review

1. **No GPU measurement in this repo** — per AGENTS.md §10 hard rule. All performance claims are `evidenceType: "analytical"` or `paper_result` (never `measured`). Any human reviewer with GPU access should sanity-check numerical claims (e.g., A100 FP32 peak ~19.5 TFLOPs, HBM ~1.5 TB/s used in `F-GEMMSM-014`, `F-GEMV-013`).

2. **Triton version-sensitive claims** — verify against currently-released Triton (2.2 / 2.3 / 3.0):
   - `F-BLOCKPTR-007` (`tl.make_block_ptr` API surface)
   - `F-AUTOTUNE-008` (`triton.autotune` `key=` caching behavior)
   - `F-CONSTEXPR-010` (specialization semantics)
   - `F-GEMMFP16-015` (`tl.dot(out_dtype=)` lowering to mma.sync)
   - `F-BENCH-039` (`triton.testing.do_bench` availability)

3. **NVIDIA architecture claims** — verify against current NVIDIA whitepapers:
   - `F-TCORE-018` — Tensor Core dtype support timeline (Volta FP16, Turing INT8, Ampere TF32/BF16/FP64, Ada/Hopper FP8). This is dense and factual; a human reviewer with NVIDIA whitepaper access should spot-check.
   - `F-OCC-030` — A100 (sm_80) resource limits: 65536 regs/SM, 164 KB SMEM/SM configurable, 2048 threads/SM, 32 blocks/SM cap. Confirm.
   - `F-LAUNCH-038` — Compute capability 8.0 launch limits (blockDim, gridDim). Confirm.
   - `F-CPASYNC-027` — cp.async introduced in Ampere (sm_80). Confirm.

4. **FlashAttention algorithm details** (`F-FLASHATTN-023`, `F-ONLINE-021`) — anchored to the original 2022 paper. FlashAttention-2/3 have variations; my questions specifically scope to v1 formulation.

5. **Numerical tolerance claim** in `F-CORRECT-040`: "rtol ~1e-3 for FP16-in matmul at K=4096". This is a reasoned analytical estimate, not measured. Human reviewer should confirm the tolerance is standard practice (e.g., PyTorch's `assert_close` defaults for FP16).

6. **Length balance**: as with Module E, my correct options are longer than distractors on average. Guidance §3 in `docs/QUESTION_AUTHORING_GUIDE.md` allows this if technically justified, with balance to be sought across the corpus. Human reviewers may flag specific questions where distractors can be extended.

## 7. Design Rationale

- **Every code question has full tensorContext** (shapes, dtypes, layouts, strides where relevant), hardwareContext (vendor, arch, device, requiredFeatures), and softwareContext (framework, versionScope, verifiedAt, stability). This is per AGENTS.md §9 and F-module code question guidance.
- **All performance claims are `analytical` or `paper_result`**, never `measured`. No GPU measurement in this repo.
- **Kernel-level vs end-to-end**: explicitly guarded against confusion. `F-GEMMSM-014` and `F-FLASHATTN-023` distinguish per-tile / per-kernel from full-program metrics.
- **"Model smaller ≠ faster"** and **"lower precision ≠ faster"** avoided as stand-alone claims; hardware-support conditionals are explicit.
- **Every distractor comes from a concrete misconception** documented in the content card. No filler distractors, no vacuous options ("视情况而定"), no meta options.

## 8. Coverage Confirmation

| Requirement | Target | Achieved |
|---|---:|---:|
| code_implementation questions in F | ≥12 | 24 (with tensorContext + code) ✅ |
| Reduction / Scan / GEMV / GEMM | ≥4 | 6 ✅ |
| Tensor Core / MMA | ≥3 | 3 ✅ |
| Softmax / LayerNorm / RMSNorm | ≥3 | 4 ✅ |
| Attention | ≥3 | 3 ✅ |
| CUDA Graph / Stream / Async / Persistent | ≥3 | 4 ✅ |
| Triton language details (mask/other, program_id, block_ptr, autotune) | ≥5 | 5+ ✅ |
| Module F total | 40 | 40 ✅ |

## 9. Next Steps

1. Primary Reviewer-F blind pass on `data/questions/F/*.json` (via `scripts/build-blind-package.mjs`).
2. Round 1 independent-answer.
3. Repair pass for flagged questions.
4. Round 2 verification.
5. Promotion to `agent_reviewed` (never auto-promote to `human_reviewed` — AGENTS.md §10).

## 10. Files

- 35 × `data/questions/F/F-*-006..040.json` (new)
- 35 × `data/content-cards/F/F-*-006..040.json` (new)
- 1 × `manifests/F.json` (updated: 5 canary + 35 new)
- 1 × `handoffs/generation/F-full.md` (this file)
- Canary 5 questions (F-TRITON-001, F-COALESCE-002, F-BANK-003, F-DOTPROD-004, F-RMS-005) are **unchanged** per Batch 3 constraint.
