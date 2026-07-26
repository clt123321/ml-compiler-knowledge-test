# Batch 1 Primary Review — Summary

- Reviewer: primary-review-batch1
- Reviewed at: 2026-07-26
- Round: Round 1 (Primary, independent blind review)
- Modules: **A** (arch_perf_model, 30 q), **B** (compiler_basics, 25 q), **C** (graph_tensor_ir, 30 q), **D** (pytorch_compiler, 35 q) — total **120 questions**
- Method: Two-phase — Phase A independent answering from `reviews/blind/{A,B,C,D}.json` alone (no access to `data/questions/**`, `data/content-cards/**`, `explanation`, `optionExplanations`, `sourceRefs.supports`, or `correctAnswers`). Independent answers written to `reviews/round1/{A,B,C,D}-independent.json` first. Phase B: after all four independent-answer files were finalized, official questions were read and compared.

## Cross-module tallies

| Module | Total | Agreement | PASS | MINOR | MAJOR | BLOCKER | Src Supported | Version Scope OK | HW Cond OK |
|--------|-------|-----------|------|-------|-------|---------|---------------|------------------|------------|
| A      | 30    | 30/30     | 27   | 3     | 0     | 0       | 30/30         | N/A (stable)     | 30/30      |
| B      | 25    | 25/25     | 23   | 2     | 0     | 0       | 25/25         | N/A (stable)     | 25/25      |
| C      | 30    | 30/30     | 16   | 1     | 13    | 0       | 30/30         | 1/1 scoped       | 30/30      |
| D      | 35    | 35/35     | 25   | 0     | 10    | 0       | 35/35         | 35/35 scoped     | 35/35      |
| **Total** | **120** | **120/120 (100%)** | **91** | **6** | **23** | **0** | **120/120** | all applicable OK | **120/120** |

- Independent-answer disagreements: **0**
- BLOCKER: **0**
- MAJOR: **23** (all one pattern: `weak_distractor_self_contradicting_option`, concentrated in C and D)
- MINOR: **6** (4 `explanation_label_mismatch` from shuffle; 2 wording nits already flagged in canary review)

## Top-3 most severe findings per module

### Module A (worst 3, all MINOR)
1. **A-BANK-022** — explanation says "Option D is wrong" but D is CA. Shuffle-mislabel.
2. **A-HIER-020** — option C claims strict per-SM ordering "SMEM > RF" which is false on A100 (RF 256 KB > SMEM 192 KB). Answer still selectable by exclusion, but wording could be tightened.
3. **A-MEM-005** — option C says "one cycle to the whole warp" for constant broadcast (slight simplification of the CUDA Programming Guide's "as fast as a register read"). Already noted in canary review.

### Module B (worst 2, both MINOR)
1. **B-CSE-012** — explanation says "Options B, C, D are incorrect" but C is CA. Shuffle-mislabel.
2. **B-LICM-013** — explanation says "Options B, C, D are wrong" but D is CA. Shuffle-mislabel.

### Module C (worst 3, all MAJOR from the same systemic pattern)
1. **C-BUFFER-012** — correct option C has poison tail claiming bufferization is unnecessary (contradicts its own leading claim).
2. **C-SHAPEINFER-029** — correct option B has poison tail claiming shape inference only succeeds with fully static shapes (contradicts its own leading claim).
3. **C-STRIDE-020** — correct option A has poison tail claiming offset formula uses shape dims not strides (contradicts the correct arithmetic in its leading claim).

### Module D (worst 3, all MAJOR from the same systemic pattern)
1. **D-AOTAG-011** — correct option C has poison tail claiming AOTAutograd only traces forward, exactly duplicating option B's wrong content.
2. **D-SYMINT-008** — correct option A has poison tail claiming SymInt is a GPU runtime tensor for autograd (contradicts the leading correct definition).
3. **D-GUARD-006** — correct option B has poison tail claiming the log is misattributed and no stride guard should fire (contradicts B's own leading claim).

## Systemic issues observed

### 1. `weak_distractor_self_contradicting_option` (poison tail) — MAJOR, systemic in C and D

23 out of 60 correct options in modules C and D (13/30 in C = 43%, 10/35 in D = 29%) end with a paragraph starting with **"Under this reading, …"**, **"In this account, …"**, **"In this framing, …"**, or **"In this description, …"** that presents wrong content contradicting the option's own leading canonical claim. The wrong content is typically identical to what another (correctly labeled wrong) option already says.

- **Correctness:** the answer key is still correct — leading claims match Tier 1 sources.
- **Confusion:** the tail damages option clarity, blurs the correct/incorrect boundary within a single option, and creates artificial difficulty inflation.
- **Recommended fix (single-transformation, template-level):** strip every trailing "Under this reading …" / "In this account …" / "In this framing …" / "In this description …" block from every correct option in modules C and D. The wrong-option content is already carried in dedicated distractor options; duplicating it inside the correct option adds no informational value.
- **Occurrence in modules A and B: zero.** This is not a template issue for those modules.

### 2. `explanation_label_mismatch` after shuffle — MINOR, 4 questions

Shuffle-answer-position ran successfully on option `id`s and `correctAnswers`, but explanation text and optionExplanations still reference pre-shuffle option letters in 4 cases:

- **A-BANK-022** ("Option D is wrong" — D is CA)
- **B-CSE-012** ("Options B, C, D are incorrect" — C is CA)
- **B-LICM-013** ("Options B, C, D are wrong" — D is CA)
- **C-GRAPH-025** ("Option C is wrong" — C is in CA {B,C,D})

Recommended fix: rewrite the four affected explanation blocks to reference current shuffled labels. This is 4 per-question rewrites, not a template fix.

### 3. Position-bias (single-choice) — INFO, not MAJOR

After shuffle, single-choice correct-option distribution per module:

| Module | A | B | C | D | Singles | Max/Singles | ≤ Gate 0.35? |
|--------|---|---|---|---|---------|-------------|-----|
| A | 6 | 6 | 2 | 6 | 20 | 6/20 = 0.30 | ✓ |
| B | 1 | 3 | 5 | 8 | 17 | 8/17 = 0.47 | ✗ |
| C | 5 | 9 | 7 | 3 | 24 | 9/24 = 0.375 | slightly over |
| D | 6 | 12 | 6 | 3 | 27 | 12/27 = 0.444 | ✗ |

Modules B and D exceed the audit `answer_position_bias_max = 0.35` gate. This is not answer-correctness-affecting (every single-choice answer is uniquely correct on technical grounds), but should be addressed by another shuffle pass or by conscious redistribution in the next generation. Not counted as MAJOR because it does not affect uniqueness or correctness — it is a distributional / anti-pattern-matching concern.

### 4. Multi-select cardinality (module D) — INFO, not MAJOR

Module D's 8 multi-select questions are **all 3-correct**, 0 are 2-correct. The orchestrator flagged this. Reviewer opinion: leave as-is for this batch. Each 3-correct answer set is technically justified; forcing 2-correct sets would either drop a real principle or invent an artificial fourth correct claim. Track this as a target for future generation calibration.

## Canary MINOR carry-over

The canary review (`reviews/round1/canary-summary.md`) flagged 4 MINORs on the first 5-question sample. Two of those (A-MEM-005 broadcast wording, D-DYNAMIC-002 automatic-dynamic default) also appear in the batch-1 sample and are treated as MINOR in this review:
- A-MEM-005 wording MINOR is preserved (same finding).
- D-DYNAMIC-002 was checked; the explicit assumption "no automatic dynamic promotion overrides" is still present and sufficient — kept as PASS in this batch review since the assumption already handles the version-boundary concern.

## Gate check per `config/review-policy.yaml`

| Gate | Threshold | A | B | C | D | Overall |
|------|-----------|---|---|---|---|---------|
| blocker_max (canary was 0) | ≤ 0 | 0 | 0 | 0 | 0 | ✓ PASS |
| major_max per module | ≤ 3 (canary) / ≤ 15 (guideline) | 0 | 0 | **13** | **10** | ✗ FAIL for C, D |
| independent_answer_disagreement | ≤ 2 (canary) | 0 | 0 | 0 | 0 | ✓ PASS |
| unsupported_source_max | ≤ 0 | 0 | 0 | 0 | 0 | ✓ PASS |
| meta_statement_options_max | ≤ 0 | 0 | 0 | 0 | 0 | ✓ PASS |
| pass_min per module (advisory) | ≥ 15 (canary) | 27 | 23 | 16 | 25 | ✓ PASS |
| version_scope on version_sensitive q's | 100% | N/A | N/A | 1/1 | 35/35 | ✓ PASS |
| Tier 1 support on correct options | 100% | 30/30 | 25/25 | 30/30 | 35/35 | ✓ PASS |

## Verdict per module

- **Module A: PROCEED TO ROUND 2** (Verification). 27/30 PASS, 3 MINOR — MINORs can be addressed during Repair concurrently with Round 2.
- **Module B: PROCEED TO ROUND 2**. 23/25 PASS, 2 MINOR — same treatment as A.
- **Module C: REPAIR FIRST, then Round 2.** 13 MAJORs from a single systemic template issue (poison tail on correct options). Recommend a **single template-level Repair pass** that strips the trailing "Under this reading …" / "In this account …" / "In this framing …" / "In this description …" block from every correct option in module C. All 13 MAJORs resolve at once; no per-question re-answering needed since answers are already correct.
- **Module D: REPAIR FIRST, then Round 2.** Same treatment as C — 10 MAJORs from the same systemic pattern. Same template-level Repair transformation. In addition, note (do not block) the multi-select-cardinality distribution for future generation calibration.

## Overall batch-1 recommendation

**Do not promote batch-1 questions from any module to `agent_reviewed` before the systemic Repair on modules C and D is applied.** Modules A and B could theoretically be promoted independently, but recommend running them through Round 2 alongside repaired C and D for coherent batch handling.

The 100% independent-answer agreement (120/120) and zero BLOCKER count give high confidence in the technical correctness of the answer key. All defects are option-quality / label-hygiene issues, not answer errors.

## Handoff

- Round 1 outputs:
  - `reviews/round1/{A,B,C,D}-independent.json` (Phase A blind answers)
  - `reviews/round1/{A,B,C,D}-review.json` (Phase B per-question record, schema-compliant)
  - `reviews/round1/{A,B,C,D}-review.md` (Phase B per-module report)
  - `reviews/round1/batch1-summary.md` (this file)
- Suggestions for Repair Agent: see `handoffs/review/batch1.md`.
