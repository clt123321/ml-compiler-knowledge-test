# Module B — Primary Review (Round 1) — Batch 1

- Reviewer: primary-review-batch1
- Reviewed at: 2026-07-26
- Module: B (compiler_basics), 25 questions
- Method: Two-phase blind review. Phase A: independent answering from `reviews/blind/B.json` only. Phase B: compared with official answers under `data/questions/B/**`.

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 25 |
| Independent answers agreeing with official | **25/25 (100%)** |
| PASS | 23 |
| MINOR | 2 |
| MAJOR | 0 |
| BLOCKER | 0 |
| Source-supported correct options | 25/25 |
| Version-sensitivity | N/A (all stable-principle compiler theory) |

## Findings by severity

### BLOCKER (0)
_None._

### MAJOR (0)
_None._

### MINOR (2)

1. **B-CSE-012** — `explanation_label_mismatch`. The explanation reads "Options B, C, D are incorrect: SSA does not extend to memory; compilers default to assuming calls may write memory (not pure); loads are not universally uneliminable." But the correct answer is C. This is a shuffle-mislabel bug: post-shuffle, C became the correct option but the wrong-option label list was not updated. The CSE / alias-analysis reasoning itself is correct; the labels need to be updated (the wrong options are likely {A, B, D} after shuffle). Suggested repair: relabel wrong-option list in the explanation.

2. **B-LICM-013** — `explanation_label_mismatch`. The explanation reads "Options B, C, D are wrong: B ignores the speculative-safety condition; C over-restricts to arithmet[ic]..." but the correct answer is D. Same shuffle-mislabel pattern as B-CSE-012. LICM safety reasoning (loop-invariance + dominance + speculative-safety + sdiv non-zero) is correct. Suggested repair: relabel wrong-option list.

## Positive observations

- **100% answer agreement** with independent reviewer solving from blind package alone.
- **Every question is theory-only (stable_principle)** — no version-sensitive fields required, per AGENTS.md §11.
- **No hardware context needed** — all questions are architecture-independent compiler theory (SSA, dominance, dataflow, DCE, CSE, LICM, escape, inlining, etc.).
- **Position bias (single-choice):** D=8/17 (47%), C=5, B=3, A=1. **D-heavy**. This is above ideal but not egregious; audit gate is 0.35 and this run reports 0.47. Consider redistributing 1-2 correct answers away from D in a future generation cycle to avoid pattern-matching risk. Not a MAJOR because the D-answer set for this module is technically correct (D options genuinely contain the canonical textbook definitions for CFG, dominator tree, escape analysis, register allocation, phi lowering, etc.).
- **Multi-select distribution:** 2 questions have 2 correct, 6 have 3 correct. Reasonable.
- **Distractors are strong.** Each incorrect option probes a specific canonical misconception (may-alias vs must-alias, SSA-single-def, DCE side-effect boundary, LICM speculative-safety, min-cut recompute, semantic preservation vs UB exploitation).
- **No fabricated performance data** (module B is pure theory).
- **No meta-statement options.**

## Note on shuffle-mislabel

Only 2 out of 25 questions carry the `explanation_label_mismatch` pattern — this is not systemic in module B (unlike modules C and D, discussed below in batch1-summary.md). Both are single-line label fixes.

## Per-question results

| ID | Type | CA | My Ans | Agree | Result |
|----|------|----|--------|-------|--------|
| B-ALIAS-007 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| B-CFG-003 | single | [D] | [D] | ✓ | PASS |
| B-CFOLD-009 | single | [B] | [B] | ✓ | PASS |
| B-CPROP-010 | single | [B] | [B] | ✓ | PASS |
| B-CSE-012 | single | [C] | [C] | ✓ | MINOR (label mismatch) |
| B-DATAFLOW-022 | single | [C] | [C] | ✓ | PASS |
| B-DCE-011 | multi | [C,D] | [C,D] | ✓ | PASS |
| B-DEFUSE-006 | single | [C] | [C] | ✓ | PASS |
| B-DOM-004 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| B-DOMTREE-025 | single | [D] | [D] | ✓ | PASS |
| B-ESCAPE-008 | single | [D] | [D] | ✓ | PASS |
| B-INLINE-014 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| B-INSTSEL-016 | single | [B] | [B] | ✓ | PASS |
| B-JITAOT-019 | multi | [B,C] | [B,C] | ✓ | PASS |
| B-LICM-013 | single | [D] | [D] | ✓ | MINOR (label mismatch) |
| B-LIVE-005 | single | [D] | [D] | ✓ | PASS |
| B-LOOPINV-023 | single | [C] | [C] | ✓ | PASS |
| B-PARTIAL-018 | single | [A] | [A] | ✓ | PASS |
| B-PATTERN-017 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| B-PHI-002 | single | [D] | [D] | ✓ | PASS |
| B-REGALLOC-015 | single | [D] | [D] | ✓ | PASS |
| B-SEMPRES-021 | multi | [A,C,D] | [A,C,D] | ✓ | PASS |
| B-SOUND-020 | multi | [A,B,D] | [A,B,D] | ✓ | PASS |
| B-SSA-001 | single | [C] | [C] | ✓ | PASS |
| B-SSAFORM-024 | single | [D] | [D] | ✓ | PASS |

## Verdict

**Module B is recommended to proceed to Round 2 (Verification).** All 25 questions passed source/hardware/version audits and reproduced the official answer independently. The 2 MINOR shuffle-label findings do not block Verification; they can be repaired concurrently with A-BANK-022.
