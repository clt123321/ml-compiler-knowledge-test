# Module C — Primary Review (Round 1) — Batch 1

- Reviewer: primary-review-batch1
- Reviewed at: 2026-07-26
- Module: C (graph_tensor_ir), 30 questions
- Method: Two-phase blind review. Phase A: independent answering from `reviews/blind/C.json` only. Phase B: compared with official answers under `data/questions/C/**`.

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 30 |
| Independent answers agreeing with official | **30/30 (100%)** |
| PASS | 16 |
| MINOR | 1 |
| MAJOR | 13 |
| BLOCKER | 0 |
| Source-supported correct options | 30/30 |
| Version-sensitivity | 1/30 (C-STABLEHLO-014 correctly scoped) |

## Systemic issue: self-contradicting correct options ("poison tails")

**13 out of 30 (43%) correct options in module C contain a self-contradicting "poison tail".** Each such option opens with a correct canonical claim (matching Tier 1 sources), then adds a paragraph starting with a phrase such as *"Under this reading, …"*, *"In this account, …"*, *"In this framing, …"*, or *"In this description, …"* that presents contradictory (wrong) content — often lifted from what would otherwise be a distractor option.

Example (C-BUFFER-012, correct option C):
> "Tensor form has value semantics (immutable SSA values; each op produces a fresh tensor); memref form has reference semantics (ops write into named buffers). Bufferization assigns buffers and inserts allocations/copies as needed to preserve semantics. **Under this reading, the bufferization pass is unnecessary and is included in MLIR only for symmetry with earlier prototype dialects rather than to resolve any real semantic difference between the two levels.**"

The leading claim is canonical (MLIR bufferization semantics). The trailing sentence contradicts it. A knowledgeable reviewer identifies the leading claim as correct and ignores the tail, but a partially informed reader could be confused into rejecting the option on the strength of the tail alone.

### Affected questions (13)

C-BUFFER-012, C-DCE-013, C-DIALECT-016, C-EAGER-015, C-LAYOUTOPT-026, C-LEGALIZE-008, C-SHAPEINFER-029, C-STRIDE-020, C-SYMSHAPE-018, C-TE-022, C-TILING-011, C-VERIFY-009, C-VIEW-010.

### Why this is MAJOR (not BLOCKER)

- The **answer is not ambiguous** in isolation of the tail — leading claims match Tier 1 sources; wrong options are still clearly wrong.
- **Correctness is preserved** (100% independent-agreement, all Tier 1 supports present).
- However, the pattern qualifies as a `weak_distractor` / option-quality defect per REVIEW_GUIDE.md §3 MAJOR: it **damages option clarity, blurs the correct/incorrect boundary within a single option**, and creates a difficulty inflation not backed by real technical distinction.

### Recommended repair

Systematically strip the "Under this reading…" / "In this account…" / "In this framing…" / "In this description…" trailing block from every correct option in module C. The wrong-option content is already carried in dedicated distractor options; duplicating it inside the correct option adds no informational value and only introduces confusion. This is a template-level regeneration fix, not a per-question rewrite.

## Findings by severity

### BLOCKER (0)
_None._

### MAJOR (13)

All 13 are the same `weak_distractor_self_contradicting_option` pattern described above. See per-question table below.

### MINOR (1)

1. **C-GRAPH-025** — `explanation_label_mismatch`. The explanation says "Option C is wrong: whether an edge is materialized in memory is a codegen/scheduling decision" but C is in the correct-answer set {B, C, D}. This is a shuffle-mislabel: the explanation was written pre-shuffle and refers to the old option A content ("every edge materialized"). Suggested repair: relabel wrong-option references in the explanation.

## Positive observations

- **100% answer agreement.** All 30 questions are unambiguously solvable from the technical content (even in the presence of poison tails, the leading claims of correct options are unambiguously the canonical descriptions).
- **All Tier 1 sources cover every correct option** (per `sourceRefs.supports`).
- **StableHLO version-sensitive question (C-STABLEHLO-014) is correctly scoped** with `frameworkVersionScope` and `verifiedAt` per AGENTS.md §9.
- **Position bias (single-choice):** A=5, B=9, C=7, D=3 out of 24 singles — well balanced.
- **Multi-select distribution:** 1 with 2 correct, 5 with 3 correct — acceptable.
- **No fabricated performance data** (module C is IR theory).
- **No kernel-vs-end-to-end conflation.**

## Per-question results

| ID | Type | CA | My Ans | Agree | Result |
|----|------|----|--------|-------|--------|
| C-BUFFER-012 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| C-CANON-006 | single | [C] | [C] | ✓ | PASS |
| C-DCE-013 | single | [B] | [B] | ✓ | MAJOR (poison tail) |
| C-DIALECT-016 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| C-EAGER-015 | single | [B] | [B] | ✓ | MAJOR (poison tail) |
| C-GRAPH-025 | multi | [B,C,D] | [B,C,D] | ✓ | MINOR (label mismatch) |
| C-IRLEVEL-005 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| C-IRLEVELS-019 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| C-LAYOUT-002 | single | [B] | [B] | ✓ | PASS |
| C-LAYOUTOPT-026 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| C-LEGALIZE-008 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| C-LICM-001 | single | [B] | [B] | ✓ | PASS |
| C-LINALG-030 | multi | [A,B,C] | [A,B,C] | ✓ | PASS |
| C-LOOPIR-023 | single | [D] | [D] | ✓ | PASS |
| C-LOWER-007 | single | [B] | [B] | ✓ | PASS |
| C-MATERIALIZE-027 | single | [D] | [D] | ✓ | PASS |
| C-OPIR-028 | multi | [A,B,D] | [A,B,D] | ✓ | PASS |
| C-PROD-017 | single | [C] | [C] | ✓ | PASS |
| C-REGION-021 | single | [A] | [A] | ✓ | PASS |
| C-SHAPE-004 | single | [C] | [C] | ✓ | PASS |
| C-SHAPEINFER-029 | single | [B] | [B] | ✓ | MAJOR (poison tail) |
| C-SSA-003 | single | [B] | [B] | ✓ | PASS |
| C-STABLEHLO-014 | multi | [A,C] | [A,C] | ✓ | PASS |
| C-STRIDE-020 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| C-SYMSHAPE-018 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| C-TE-022 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| C-TILING-011 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| C-TYPECONV-024 | single | [B] | [B] | ✓ | PASS |
| C-VERIFY-009 | single | [D] | [D] | ✓ | MAJOR (poison tail) |
| C-VIEW-010 | single | [B] | [B] | ✓ | MAJOR (poison tail) |

## Verdict

**Module C should undergo a template-level Repair before Round 2 (Verification).** The poison-tail pattern affects 43% of correct options and is systemic (not per-question). A single Repair pass that strips the trailing "Under this reading / In this account / In this framing / In this description" block from every correct option in module C should resolve all 13 MAJORs at once, since the answers themselves are already correct and the wrong-option content is already carried in dedicated distractor options.

Per `docs/REVIEW_GUIDE.md §3`: MAJOR count = 13 exceeds the > 3 threshold that "requires a generator fix". Recommend the Repair Agent apply the tail-strip transformation and only then promote to Round 2.
