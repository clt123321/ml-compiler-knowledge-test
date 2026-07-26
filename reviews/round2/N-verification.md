# Module N — Round 2 Verification Report

**Reviewer:** verification-agent-4 (Batch 4)
**Date:** 2026-07-27
**Scope:** 10 questions in `data/questions/N/`
**Method:** Stage A blind independent answering → Stage B comparison with official answers, sources, content cards, and Round 1 record.

## Stage A — Independent Answer Agreement

**10 / 10 (100%)** blind independent answers match the official `correctAnswers` on every question.

| id | blind answer | official | agree |
|---|---|---|---|
| N-ANSOR-003 | A,B | A,B | ✓ |
| N-FLASH-006 | A,C,D | A,C,D | ✓ |
| N-GSPMD-008 | B,C | B,C | ✓ |
| N-HALIDE-001 | C | C | ✓ |
| N-MLIR-004 | C | C | ✓ |
| N-PYT2-009 | C | C | ✓ |
| N-QUANT-010 | A,C,D | A,C,D | ✓ |
| N-TRITON-005 | D | D | ✓ |
| N-TVM-002 | B | B | ✓ |
| N-VLLM-007 | A | A | ✓ |

## Paper-Design-Intent Discipline (Batch 4 Special Attention)

All 10 questions in Module N are `archetype: paper_design_intent` (or the closely-related scope-discipline `concept_boundary` variants N-GSPMD-008 and N-QUANT-010). I verified each against the four risks called out for this module.

### 1. Paper conclusion scope

Every paper claim is scoped to what the paper actually establishes:
- **N-HALIDE-001** — algorithm/schedule separation as a design choice, not as a correctness prerequisite; A/B/D fabricate stronger claims that the paper does not make.
- **N-MLIR-004** — multi-level lowering with shared infrastructure, not "single universal IR" (A), not "replaces LLVM" (D). Correct scope.
- **N-TRITON-005** — tile-level programming with automatic per-thread lowering; explicitly rejects the CUDA-superset overclaim (B).
- **N-TVM-002** — measurement + learned cost model motivation; explicitly rejects the "analytical model is always superior" overclaim (D).
- **N-ANSOR-003** — task-scheduler motivation (uneven marginal gain); rejects the false 10%-per-task floor rule (D) and the runtime-dispatcher confusion (C).
- **N-VLLM-007** — PagedAttention as a KV-cache fragmentation fix; rejects the FLOP-reduction (B) and cache-elimination (C) overclaims.

### 2. Peak vs geomean (N-GSPMD-008)

Directly tested. Correct answer set (B, C):
- B captures "peak > geomean; summarizing by peak overstates typical benefit."
- C captures "results are conditioned on that paper's HW/SW/workload/baseline."
- Rejects A (baseline-independence overclaim) and D (peak = geomean).

### 3. Kernel-level vs e2e speedup (N-PYT2-009)

Directly tested. Correct answer C invokes Amdahl's law + graph breaks + non-compiled subgraphs to explain why 3× kernel ≠ 3× model. Rejects the identical-speedup fallacy (B) and the "no speedup ever" nihilism (A).

### 4. Single-paper vs domain consensus (N-QUANT-010)

Directly tested by having the correct set (A, C, D) all be scope-limiting statements:
- A: ablation ≠ head-to-head superiority.
- C: extending to "LLMs in general" requires more evaluation.
- D: wall-clock speedup depends on efficient dequantized-GEMM kernel availability.
- Explicitly rejects B (universal ≥3× e2e from 4-bit) — a canonical overclaim.

## FlashAttention (N-FLASH-006) Deep-Check

Since N-FLASH-006 is `hardwareDependent=true` and involves the most-frequently-mis-cited paper, I did an extra check:
- Framework version scope: `softwareContext.framework = "FlashAttention (v1)"` — explicit, both in the JSON and in the stem.
- Option A: kernel-level "largest in memory-bound regime" — correct per §5.
- Option B (INCORRECT): "backward reuses the stored N×N attention matrix" — the paper is explicit that the backward does NOT store N×N; it recomputes softmax from stored log-sum-exp / running-max statistics. Content card `canonicalClaims[0]` and misconception #4 explicitly document this. Correctly excluded from the answer set.
- Option C: block-wise tiling + online softmax + Θ(N²·d/M) HBM traffic — matches paper §3.
- Option D: exactness up to floating-point ordering — matches paper.

Result: correct as authored. No hazard of e2e-vs-kernel-level or v1-vs-v2 confusion.

## Gate Verification

For every question:
- `sourceSupported = true` — Tier-1 or Tier-2 primary references only (PAPER:ansor, PAPER:flashattn, PAPER:gspmd, PAPER:halide, PAPER:mlir + DOC:mlir-langref, PAPER:pytorch2 + DOC:torch-compile, PAPER:smoothquant / PAPER:gptq / PAPER:awq, PAPER:triton, PAPER:tvm + PAPER:ansor, PAPER:vllm). All have explicit locators and `supports` fields matching the correct options.
- `hardwareConditionsSufficient = true` — pinned HW where meaningful (N-FLASH-006 pins NVIDIA + on-chip SRAM feature; N-PYT2-009 pins NVIDIA GPU; N-TRITON-005 pins CUDA-capable GPU; N-VLLM-007 pins GPU-serving context). Concept-level questions are correctly `generic`.
- `versionScopeSufficient = true` — N-PYT2-009 uses `version_sensitive` with a scoped `frameworkVersionScope` and `verifiedAt`; all others are `stable_principle` because they test paper-level design intent that does not change with implementation version.

## Issues

Three MINOR notes carried over / re-confirmed:
- N-FLASH-006: a stylistic FlashAttention-2 nonImplication would be nice-to-have. Non-blocking.
- N-PYT2-009: `version_sensitive` label is defensive but appropriate. Non-blocking.
- N-QUANT-010: scope discipline is exactly what this question tests, and it is done correctly.

No new issues found in Round 2. No Round 1 finding was overlooked or under-severed.

## Result

**10 / 10 PASS** — All 10 N questions satisfy all five promotion gates. All are recommended for promotion to `agent_reviewed`.
