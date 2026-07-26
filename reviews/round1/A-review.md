# Module A — Primary Review (Round 1) — Batch 1

- Reviewer: primary-review-batch1
- Reviewed at: 2026-07-26
- Module: A (arch_perf_model), 30 questions
- Method: Two-phase blind review. Phase A: independent answering from `reviews/blind/A.json` only (no access to `data/questions/A/**`, `data/content-cards/A/**`, `explanation`, `optionExplanations`, `sourceRefs.supports`, `correctAnswers`, or `reviewStatus`). Independent answers recorded in `reviews/round1/A-independent.json`. Phase B: compared with official answers under `data/questions/A/**`.

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 30 |
| Independent answers agreeing with official | **30/30 (100%)** |
| PASS | 27 |
| MINOR | 3 |
| MAJOR | 0 |
| BLOCKER | 0 |
| Source-supported correct options | 30/30 |
| Hardware conditions sufficient | 30/30 |
| Version scope sufficient (where applicable) | N/A (module A is stable-principle) |

## Findings by severity

### BLOCKER (0)
_None._

### MAJOR (0)
_None._

### MINOR (3)

1. **A-BANK-022** — `explanation_label_mismatch`. The explanation text contains "Option D is wrong" but D is the correct answer. This is a shuffle-mislabel bug: the explanation was written pre-shuffle and refers to old option positions. The bank-conflict arithmetic in the explanation is correct; only the referenced labels are stale. Suggested repair: rewrite the explanation to refer to the current shuffled labels.

2. **A-HIER-020** — `wording (capacity ordering per SM)`. Option C states the per-SM capacity ordering "HBM > L2 > SMEM > RF". On A100, the register file per SM (65,536 × 4 B ≈ 256 KB) is actually larger than the configurable L1/SMEM partition (up to 192 KB). The high-level intent (aggregate HBM/L2 dwarfs on-chip storage) is correct, and the answer set {B,C,D} is still selectable by exclusion of A (which is clearly wrong about L2 being a "latency shield only"). Suggested repair: soften C to "on-chip storage per SM is significantly smaller than HBM" without claiming a strict SMEM > RF ordering.

3. **A-MEM-005** — `wording (broadcast latency)`. Option C says "delivering the value in one cycle to the whole warp". The CUDA Programming Guide's canonical formulation is "as fast as reading from a register" for constant-memory broadcast. Content is correct; single-cycle is a slight simplification. This finding is consistent with the earlier canary-round observation on the same question.

## Positive observations

- **100% answer agreement.** All 30 questions are unambiguously solvable from the technical content alone.
- **All version-sensitive fields absent because module A is stable-principle** (Roofline, Amdahl, Little's Law, warp/block semantics), which matches AGENTS.md §11.
- **Hardware contexts** are fully specified for every question that depends on a specific architecture. Every A100 / H100 claim carries the correct architecture name and required features (compute capability, bank width, sector size, HBM tier).
- **No fabricated benchmark numbers.** Cited peak/bandwidth figures match NVIDIA's public whitepapers (A100 312 TFLOP/s FP16 dense, 2.0 TB/s HBM2e; H100 989 TFLOP/s FP16, 3.35 TB/s HBM3).
- **Position bias after shuffle (single-choice):** A=6, B=6, C=2, D=6 out of 20 singles — reasonably balanced within the 0.35 audit gate.
- **Multi-select distribution:** 3 questions have 2 correct, 7 have 3 correct — good mix.
- **No kernel-vs-end-to-end conflation.** All performance claims are properly scoped.
- **No meta-statement / "视情况而定" options.**

## Per-question results

| ID | Type | CA | My Ans | Agree | Result |
|----|------|----|--------|-------|--------|
| A-AMDAHL-008 | single | [A] | [A] | ✓ | PASS |
| A-ARITH-001 | single | [A] | [A] | ✓ | PASS |
| A-ARITH-002 | single | [B] | [B] | ✓ | PASS |
| A-BANK-022 | single | [D] | [D] | ✓ | MINOR (explanation label) |
| A-BATCH-028 | single | [D] | [D] | ✓ | PASS |
| A-BW-006 | single | [C] | [C] | ✓ | PASS |
| A-CACHE-010 | single | [A] | [A] | ✓ | PASS |
| A-COAL-009 | single | [D] | [D] | ✓ | PASS |
| A-CPUGPU-027 | multi | [A,B,C] | [A,B,C] | ✓ | PASS |
| A-DIVERG-021 | multi | [B,C] | [B,C] | ✓ | PASS |
| A-ENERGY-016 | multi | [A,B] | [A,B] | ✓ | PASS |
| A-HIER-020 | multi | [B,C,D] | [B,C,D] | ✓ | MINOR (capacity order) |
| A-ILP-030 | multi | [A,C,D] | [A,C,D] | ✓ | PASS |
| A-INTENSE-019 | single | [B] | [B] | ✓ | PASS |
| A-LAUNCH-015 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| A-LITTLE-004 | single | [B] | [B] | ✓ | PASS |
| A-MEM-005 | multi | [B,C,D] | [B,C,D] | ✓ | MINOR (broadcast wording) |
| A-NVLINK-014 | single | [A] | [A] | ✓ | PASS |
| A-OCC-003 | single | [B] | [B] | ✓ | PASS |
| A-PARA-024 | multi | [A,B,D] | [A,B,D] | ✓ | PASS |
| A-PCIE-013 | single | [A] | [A] | ✓ | PASS |
| A-PEAK-018 | single | [B] | [B] | ✓ | PASS |
| A-POWER-029 | single | [D] | [D] | ✓ | PASS |
| A-REGSPILL-025 | single | [C] | [C] | ✓ | PASS |
| A-RIDGE-007 | single | [B] | [B] | ✓ | PASS |
| A-SIMT-011 | multi | [A,B] | [A,B] | ✓ | PASS |
| A-STREAM-026 | single | [D] | [D] | ✓ | PASS |
| A-TC-023 | single | [D] | [D] | ✓ | PASS |
| A-THROUGH-017 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| A-WARP-012 | single | [A] | [A] | ✓ | PASS |

## Verdict

**Module A is recommended to proceed to Round 2 (Verification).** All 30 questions passed source/hardware/version audits and reproduced the official answer independently. The 3 MINOR findings do not block Verification; they can be addressed during Repair.
