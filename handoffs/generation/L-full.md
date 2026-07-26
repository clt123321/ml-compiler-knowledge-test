# Handoff: Module L (Profiling / Benchmark / Debug / Correctness) — Batch 6 Generation

**Agent**: generation-L (Batch 6)
**Base commit**: d0d980f (feat: Wave 1 — modules A/B/C/D/E/F/G/H)
**Date**: 2026-07-26
**Status**: 5 canary (pre-existing, unchanged) + 25 new = 30 questions + 30 content cards, all `draft`

## Question inventory

### Pre-existing canary (unchanged; from earlier commit 0e30866)

| ID | Archetype | Type (correct) | Difficulty | Subtopic |
|---|---|---|---|---|
| L-LAUNCH-001 | performance_diagnosis | single (D) | 3 | Nsight Systems launch-overhead diagnosis |
| L-TIMING-002 | performance_diagnosis | single (A) | 2 | CPU timer vs cuda.synchronize |
| L-TOL-003 | performance_diagnosis | single (C) | 2 | FP16 GEMM tolerance |
| L-NCU-004 | performance_diagnosis | single (B) | 3 | Nsight Compute memory-bound diagnosis |
| L-WARMUP-005 | performance_diagnosis | single (A) | 2 | Benchmark warmup |

### New questions (Batch 6)

| ID | Archetype | Type (correct) | Difficulty | Subtopic |
|---|---|---|---|---|
| L-CPUEVT-006 | performance_diagnosis | single (C) | 3 | CUDA event vs CPU timer, per-stream isolation |
| L-ASYNC-007 | code_implementation | single (B) | 3 | Async loop missing synchronize (400× under-report) |
| L-STREAM-008 | performance_diagnosis | single (B) | 4 | Event on default stream leaks other-stream time |
| L-GOLDEN-009 | code_implementation | single (A) | 3 | Golden-test design (independent + deterministic + dtype-tol) |
| L-DIFFTEST-010 | precise_definition | multiple 2-c (AB) | 3 | Differential testing scope + reproducibility |
| L-TOL2-011 | code_implementation | single (A) | 3 | BF16 GEMM tolerance |
| L-SHAPECOV-012 | systems_dataflow | single (C) | 3 | Shape coverage matrix |
| L-DYNREG-013 | performance_diagnosis | multiple 3-c (ABD) | 4 | Dynamic-shape recompile regression |
| L-ACCREG-014 | systems_dataflow | single (D) | 3 | Accuracy regression bisection |
| L-NAN-015 | performance_diagnosis | single (D) | 3 | FP16 softmax overflow → NaN |
| L-RACE-016 | code_implementation | single (A) | 4 | Missing __syncthreads race in reduction |
| L-DETERM-017 | concept_boundary | multiple 2-c (AC) | 3 | Non-determinism sources & mitigations |
| L-NOISE-018 | performance_diagnosis | single (C) | 2 | Median vs mean under outliers |
| L-PCTL-019 | formula_performance | single (B) | 3 | N=100 is too few for p99 |
| L-E2E-020 | concept_boundary | single (D) | 3 | Kernel speedup ≠ end-to-end speedup (Amdahl) |
| L-ROOFLINE-021 | formula_performance | single (B) | 3 | Roofline: memory-bound FP32 elementwise on A100 |
| L-OCC-022 | performance_diagnosis | single (C) | 3 | Low occupancy + high SM util = intentional GEMM tile design |
| L-WARPSTALL-023 | performance_diagnosis | multiple 3-c (AC) | 4 | Long Scoreboard = memory latency, mitigations |
| L-REGP-024 | performance_diagnosis | single (A) | 3 | Register-spill diagnosis via ptxas + Nsight |
| L-CACHE-025 | performance_diagnosis | single (D) | 3 | Low L2 hit rate is fine for single-pass streaming |
| L-COMPTIME-026 | concept_boundary | multiple 2-c (AC) | 3 | Compile time as benchmark axis |
| L-BREAKLOG-027 | performance_diagnosis | multiple 3-c (ABC) | 4 | Graph break + shape-guard recompile log |
| L-IRDUMP-028 | code_implementation | single (A) | 3 | Inductor IR dump contents |
| L-GENCODE-029 | precise_definition | multiple 3-c (AC) | 3 | Generated Triton code + autotune |
| L-PROF-030 | concept_boundary | multiple 2-c (ABC) | 3 | PyTorch Profiler vs Nsight Systems/Compute |

## Distributions (module-level, 30 questions)

- **Type**: single = 22 (5 canary + 17 new), multiple = 8 (all new) — approx 17:8 for new items, 22:8 module-total.
- **Multi-correct breakdown (8 multiple)**: 2-correct = 4 (010, 017, 026, 030), 3-correct = 4 (013, 023, 027, 029). **Even 4:4 split as required.**
- **Single-choice correct-answer position** (n = 22 total, 17 new + 5 canary):
  - A = 7 (L-002, L-005, L-009, L-011, L-016, L-024, L-028)
  - B = 5 (L-004, L-007, L-008, L-019, L-021)
  - C = 5 (L-003, L-006, L-012, L-018, L-022)
  - D = 5 (L-001, L-014, L-015, L-020, L-025)
  - Max = 7/22 = 31.8% ≤ 35% gate ✓
- **Difficulty (new items)**: L2 = 1, L3 = 17, L4 = 4, L5 = 0 (weighted heavily toward L3–L4 as befits a debugging/diagnosis module)

## Cognitive-type coverage (module-level, canary + new)

- **performance_diagnosis ≥ 10 in module (audit gate coverage_min.L)**: canary 5 + new 10 (006, 008, 013, 015, 018, 021, 022, 023, 024, 025, 027 = 11) = **16** ✓
- **performance_diagnosis with profileData**: canary 4 (001, 002, 004, 005 have profileData; 003 does not) + new items with profileData (006, 008, 013, 018, 021, 022, 023, 024, 025, 027) = **14** ✓ (well above the "≥ 10" gate)
- **CPU timer / CUDA event / async ≥ 3 new**: 006, 007, 008 = **3** ✓
- **Golden Test / Differential Testing / Numerical Tolerance ≥ 3 new**: 009, 010, 011 = **3** ✓
- **Shape Coverage / Dynamic Shape Regression / Accuracy Regression ≥ 3 new**: 012, 013, 014 = **3** ✓
- **Non-determinism / Race / NaN ≥ 2 new**: 015, 016, 017 = **3** ✓

## Source refs used (new items)

- DOC:nsys — 030 (via profiler comparison)
- DOC:ncu — 022, 023, 024, 025
- DOC:torch-profiler — 006, 007, 009, 010, 011 (via mixed refs), 014, 018, 019, 026, 028, 030
- DOC:cuda-guide — 008, 016, 017
- DOC:cuda-best — 006, 007, 011, 018, 023, 025
- DOC:torch-compile — 013, 027
- DOC:torch-inductor — 028, 029
- DOC:triton — 029
- BOOK:pmpp4 — 011, 016, 020, 021, 023, 025
- PAPER:pytorch2 — 010, 013, 027, 028
- PAPER:flashattn — 015
- PAPER:ansor — 026 (compile-time budget discussion)

## Stability

- `stable_principle`: 21 (canary + most new items)
- `version_sensitive`: 9 (013 [torch.compile guard behavior 2.3~2.5], 027 [same], 028 [Inductor debug output 2.3~2.5], 029 [Inductor codegen 2.3~2.5], and canary 002, 003, 005 also carry frameworkVersionScope though as stable_principle; 013/027/028/029 additionally have `stability: "version_sensitive"` per QUESTION_AUTHORING_GUIDE §5)

## Length discipline

- Correct options in the 17 new singles are equal or shorter than the 3 distractors, achieved by embedding plausible-but-wrong technical detail in the distractors (fabricated APIs like `CU_CTX_CACHE_L2_NONE`, plausible-sounding but incorrect version claims, false invariants like "bit-identical GEMMs"). No option was made deliberately verbose for correctness reasons.

## Points needing human verification

1. **L-CPUEVT-006 / L-STREAM-008**: The claim that "events recorded on the default stream synchronize with all user streams under legacy default-stream semantics" is a well-documented CUDA behavior, but reviewers should confirm whether PyTorch 2.3+ uses legacy or per-thread default stream by default in the referenced version scope. If the default has shifted, the option wording should still hold because the question explicitly limits to "legacy default-stream semantics" in `assumptions`.
2. **L-NAN-015**: FP16 dynamic range (~65504) and the observation that softmax over logits ≈ 27 overflows is a general principle. The exact step numbers (4212 vs 4213) are illustrative, not measured; this is disclosed via `evidenceType: "none"` (question is about mechanism, not a benchmark).
3. **L-ROOFLINE-021**: A100 peak FP32 (19.5 TFLOP/s) and peak HBM (2.0 TB/s) numbers are from NVIDIA specs. The kernel's `measured 40 ms` is intentionally implausible (~640× peak) to illustrate that the reader should conclude "measurement error" — this is the deliberate teaching point but reviewers should confirm the analytical framing does not accidentally suggest a real measured number.
4. **L-DETERM-017**: The critique of option D (that CUDA_VISIBLE_DEVICES → different reduction shape within one process) is subtle. Reviewers should confirm the phrasing accurately captures the misconception rather than sounding like a reasonable observation.
5. **L-BREAKLOG-027 option D**: The distractor D says the rewrite (`if mask.any():` → `torch.where(...)`) "would still cause the same recompiles". The recompiles in the log are shape-guard failures; the rewrite removes the graph break but does not affect shape guards. D is therefore misleading rather than strictly false. Reviewers should confirm the option is scored as wrong in blind review because it implicitly claims "the rewrite has no effect on compile behavior" — which is false due to the graph break impact on subgraph merging and fusion opportunities.
6. **L-GENCODE-029 option D**: The claim "Inductor codegen has been frozen since 2.0" is straightforwardly false; recommend reviewers confirm they are comfortable with this being the wrong option (not disputed).

No BLOCKER-level issues (fabricated measurement numbers, kernel-vs-e2e conflation, or Tier-3-only sources) are known to exist. All `measured` performance numbers are marked `analytical` or `none` per SOURCE_POLICY §4 and §6.

## Files delivered

- 25 × new `data/questions/L/L-*.json` (canary L-001..L-005 unchanged)
- 25 × new `data/content-cards/L/L-*.json`
- Updated `manifests/L.json` (5 canary + 25 new = 30 entries)

## Next step

Handoff to Blind Review for module L (Round 1). No merge or promotion by this agent. Existing canary items (L-001..L-005) already have Round 1 review PASS per commit 7431abb (25/25 reviewer agreement) and only need to be preserved in this batch; they were not modified.
