# Module D — Primary Review (Round 1) — Batch 1

- Reviewer: primary-review-batch1
- Reviewed at: 2026-07-26
- Module: D (pytorch_compiler), 35 questions
- Method: Two-phase blind review. Phase A: independent answering from `reviews/blind/D.json` only. Phase B: compared with official answers under `data/questions/D/**`.

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 35 |
| Independent answers agreeing with official | **35/35 (100%)** |
| PASS | 25 |
| MINOR | 0 |
| MAJOR | 10 |
| BLOCKER | 0 |
| Source-supported correct options | 35/35 |
| Version-sensitivity | 35/35 correctly scoped (PyTorch 2.3–2.5, verifiedAt = 2026-07-26) |

## Systemic issue 1: self-contradicting correct options ("poison tails")

**10 out of 35 (29%) correct options in module D contain the same "poison tail" pattern documented in Module C's review.** Each such correct option opens with a canonical PyTorch 2.3–2.5 description, then adds a paragraph starting with *"Under this reading, …"*, *"In this account, …"*, *"In this framing, …"*, or *"In this description, …"* that contradicts the leading claim by presenting distractor content (usually the exact wrong claim from another option).

Example (D-AOTAG-011, correct option C):
> "AOTAutograd captures a joint forward+backward graph by re-running the forward under a tracer that records both directions, then partitions it into forward and backward subgraphs handed to Inductor for compilation. **In this framing, AOTAutograd traces only the forward graph; the backward is always executed eagerly through PyTorch's autograd engine op-by-op, and no fused or compiled backward is produced under any torch.compile configuration.**"

The trailing paragraph is exactly option B's (incorrect) content. Same repair recommendation as module C: strip the trailing block from every correct option in module D.

### Affected questions (10)

D-AOTAG-011, D-BWSHAPE-033, D-COMPILET-032, D-EXPCONS-019, D-EXPORT-018, D-GUARD-006, D-GUARDEXPR-034, D-RECDIAG-030, D-SYMINT-008, D-TRITON-016.

## Systemic issue 2: multi-select distribution is 100% 3-correct

**All 8 multi-select questions in module D have exactly 3 correct options; 0 have 2 correct.** The orchestrator explicitly flagged this and asked reviewer opinion.

**Reviewer opinion:** The 100%-3-correct distribution is a distributional bias but does NOT threaten answer correctness. Each 3-correct answer set is technically justified — for example, D-AOTIRT-021 correctly has {A,B,D} because the runtime-migration option (C) is genuinely wrong; D-DECOMP-012 correctly has {A,C,D} because "every ATen op fully decomposed" is genuinely wrong. Forcing artificial 2-correct sets would either (a) require dropping one currently-correct claim and thereby lose test coverage of a real principle, or (b) require inventing a fourth correct claim that would rarely be canonical.

**Reviewer recommendation:** Do **not** aggressively convert 3-correct to 2-correct in module D. The bias in cardinality is real but not answer-correctness-affecting. If future generations produce a mix (some 2-correct, some 3-correct, some 4-correct) that would be preferred, but retrofitting this batch is not worth the correctness risk. Note this in the generation config for the next module set.

## Findings by severity

### BLOCKER (0)
_None._

### MAJOR (10)

All 10 are the `weak_distractor_self_contradicting_option` (poison-tail) pattern. Same repair as module C.

### MINOR (0)

_None._

## Positive observations

- **100% answer agreement.** All 35 questions are unambiguously solvable from the technical content — even in the presence of the poison tails, the leading canonical claims of correct options match PyTorch 2.3–2.5 official documentation.
- **All 35 questions carry `frameworkVersionScope = "PyTorch 2.3 ~ 2.5"` and `verifiedAt = "2026-07-26"`, `stability = "version_sensitive"`** — perfectly compliant with AGENTS.md §9. This is a strong showing for a version-sensitive module.
- **Tier 1 source coverage:** every correct option is supported by a Tier 1 source (PyTorch official docs / release notes / design docs) per `sourceRefs.supports`.
- **Position bias (single-choice):** A=6, B=12, C=6, D=3 out of 27 singles. B-heavy (44%) but not extreme (audit gate 0.35). Consider redistributing 1-2 correct answers away from B in the next generation.
- **No fabricated benchmark numbers.** All performance claims (compile-time cost, kernel counts) match documented Inductor/Triton behavior.
- **No kernel-vs-end-to-end conflation.** D-COMPILET-032 and D-INDUCTOR-003 correctly distinguish per-step kernel time from wall-clock end-to-end time.
- **No meta-statement options.**
- **Compile-log-based diagnostic questions (D-DYNAMIC-002, D-GUARD-006, D-DYNAMO-001, D-RECDIAG-030, D-AUTODYN-009, D-GUARDEXPR-034)** provide realistic `TORCH_LOGS` snippets that a reader could reproduce; the answer key is uniquely determinable from the log content.

## Per-question results

| ID | Type | CA | My Ans | Agree | Result |
|----|------|----|--------|-------|--------|
| D-AOT-004 | single | [A] | [A] | ✓ | PASS |
| D-AOTAG-011 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| D-AOTI-020 | single | [B] | [B] | ✓ | PASS |
| D-AOTIRT-021 | multi | [A,B,D] | [A,B,D] | ✓ | PASS |
| D-AUTODYN-009 | single | [B] | [B] | ✓ | PASS |
| D-BREAK-005 | single | [C] | [C] | ✓ | PASS |
| D-BWSHAPE-033 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| D-CACHE-024 | multi | [A,B,C] | [A,B,C] | ✓ | PASS |
| D-COMPILET-032 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| D-COND-027 | multi | [A,C,D] | [A,C,D] | ✓ | PASS |
| D-CPPBACK-017 | multi | [A,C,D] | [A,C,D] | ✓ | PASS |
| D-CUSTOM-022 | single | [B] | [B] | ✓ | PASS |
| D-DECOMP-012 | multi | [A,C,D] | [A,C,D] | ✓ | PASS |
| D-DYNAMIC-002 | single | [D] | [D] | ✓ | PASS |
| D-DYNAMO-001 | single | [D] | [D] | ✓ | PASS |
| D-DYNKW-010 | single | [C] | [C] | ✓ | PASS |
| D-EXPCONS-019 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| D-EXPORT-018 | multi | [A,B,D] | [A,B,D] | ✓ | MAJOR (poison tail) |
| D-FAKE-026 | single | [B] | [B] | ✓ | PASS |
| D-FALLBACK-025 | single | [B] | [B] | ✓ | PASS |
| D-FULL-028 | single | [B] | [B] | ✓ | PASS |
| D-FUNCT-013 | single | [A] | [A] | ✓ | PASS |
| D-FX-035 | multi | [B,C,D] | [B,C,D] | ✓ | PASS |
| D-GUARD-006 | single | [B] | [B] | ✓ | MAJOR (poison tail) |
| D-GUARDEXPR-034 | single | [B] | [B] | ✓ | MAJOR (poison tail) |
| D-INDUCTOR-003 | single | [B] | [B] | ✓ | PASS |
| D-MARK-007 | single | [A] | [A] | ✓ | PASS |
| D-MINIFIER-029 | single | [C] | [C] | ✓ | PASS |
| D-MODE-031 | multi | [A,B,D] | [A,B,D] | ✓ | PASS |
| D-MUT-023 | single | [D] | [D] | ✓ | PASS |
| D-RECDIAG-030 | single | [C] | [C] | ✓ | MAJOR (poison tail) |
| D-REDUCE-014 | single | [B] | [B] | ✓ | PASS |
| D-SCHED-015 | single | [B] | [B] | ✓ | PASS |
| D-SYMINT-008 | single | [A] | [A] | ✓ | MAJOR (poison tail) |
| D-TRITON-016 | single | [B] | [B] | ✓ | MAJOR (poison tail) |

## Verdict

**Module D should undergo the same template-level Repair as module C before Round 2 (Verification).** The poison-tail pattern affects 29% of correct options and is the same systemic issue seen in module C. A single Repair pass (identical transformation: strip the trailing "Under this reading / In this account / In this framing / In this description" block from every correct option) will resolve all 10 MAJORs at once.

Per `docs/REVIEW_GUIDE.md §3`: MAJOR count = 10 exceeds the > 3 threshold that "requires a generator fix". The generation-time template for modules C and D should be updated so future generations do not inject the contradictory tails into correct options.

The multi-select 100%-3-correct distribution (0 with 2 correct) is a distributional flag but not answer-correctness-affecting — it is documented here for future generation calibration but does **not** require Repair.
