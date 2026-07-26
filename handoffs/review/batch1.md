# Handoff to Repair Agent — Batch 1 (Modules A, B, C, D)

- From: primary-review-batch1
- Date: 2026-07-26
- Batch scope: 120 questions (A: 30, B: 25, C: 30, D: 35)

## Summary

- **0 BLOCKER**, **23 MAJOR**, **6 MINOR** across 120 questions.
- **100% independent-answer agreement.** All answer keys are technically correct — this batch has no answer-key errors.
- All MAJOR findings come from a **single systemic template issue** ("poison tail" on correct options in modules C and D) that can be repaired by a **template-level transformation applied to all affected questions at once**.
- MINOR findings are 4 explanation-label-mismatch bugs from the post-shuffle rewriting and 2 wording nits.

## Recommended Repair actions, in order

### 1. Template-level fix: strip "poison tail" from correct options in modules C and D (highest priority)

**Affected questions (23 total):**
- Module C (13): C-BUFFER-012, C-DCE-013, C-DIALECT-016, C-EAGER-015, C-LAYOUTOPT-026, C-LEGALIZE-008, C-SHAPEINFER-029, C-STRIDE-020, C-SYMSHAPE-018, C-TE-022, C-TILING-011, C-VERIFY-009, C-VIEW-010
- Module D (10): D-AOTAG-011, D-BWSHAPE-033, D-COMPILET-032, D-EXPCONS-019, D-EXPORT-018, D-GUARD-006, D-GUARDEXPR-034, D-RECDIAG-030, D-SYMINT-008, D-TRITON-016

**Transformation:** In each affected question's correct option text, remove the trailing paragraph beginning with any of:
- `"Under this reading, "`
- `"Under this framing, "`
- `"Under this account, "`
- `"Under this description, "`
- `"In this reading, "`
- `"In this framing, "`
- `"In this account, "`
- `"In this description, "`

The paragraph runs from the marker phrase to the end of the option text.

**Do NOT touch:** wrong options (leaving their poison tails in place is fine; only the correct-option contradiction matters for option clarity). Note: my analysis shows the same phrasing appears in wrong options too (43 in C, 48 in D), but those are legitimate distractor content — do not strip them from wrong options unless a follow-up review specifically requests it.

**Also do NOT touch:**
- `correctAnswers`
- `learningObjective`
- `sourceRefs`
- `hardwareContext`
- `softwareContext.frameworkVersionScope`, `softwareContext.verifiedAt`

**Bump `version` by 1 and set `updatedAt` = today, `reviewStatus = "draft"` on each modified question**, per REVIEW_GUIDE.md §7.

**Record in `reviews/resolutions/C.json` and `reviews/resolutions/D.json`** per REVIEW_GUIDE.md §7 with:
```json
{
  "id": "C-BUFFER-012",
  "finding": "MAJOR: correct option C contains self-contradicting 'poison tail' starting with 'Under this reading, ...'",
  "resolution": "strip trailing 'Under this reading ...' paragraph from correct option text",
  "diff": ["options[C].text"],
  "priorVersion": 1,
  "newVersion": 2
}
```

### 2. Explanation-label-mismatch fixes (4 questions)

Post-shuffle, four explanations still reference the pre-shuffle option letters:

- **A-BANK-022** — explanation text says "Option D is wrong" but D is CA. Rewrite the wrong-option references to current shuffled labels (likely "Option A/B/C are wrong" after shuffle; verify against the current option text order).
- **B-CSE-012** — explanation says "Options B, C, D are incorrect" but C is CA. Relabel to current wrong options.
- **B-LICM-013** — explanation says "Options B, C, D are wrong" but D is CA. Relabel to current wrong options.
- **C-GRAPH-025** — explanation says "Option C is wrong" but C is in CA {B, C, D}. Relabel to the current position of the "every edge materialized" wrong option (likely A after shuffle).

The correct-answer content itself is unchanged; only the internal `explanation` and `optionExplanations` fields need updated option-letter references. Bump `version`, set `updatedAt`, and log in `reviews/resolutions/{A,B,C}.json`.

### 3. Wording MINORs (optional — low-priority polish, not required for promotion)

- **A-HIER-020** — soften option C's per-SM ordering to avoid claiming strict SMEM > RF. Rewrite from "Capacity ordering (largest to smallest): HBM → L2 → shared memory (per SM) → register file (per SM)" to something like "Aggregate HBM and L2 vastly exceed the per-SM on-chip storage tiers (shared memory and register file)". Preserve the exclusion-of-A logic that lets the reader still uniquely pick {B, C, D}.
- **A-MEM-005** — soften option C's "one cycle to the whole warp" to the CUDA Programming Guide's "as fast as a register read" formulation. Already noted in canary review.

These MINORs are optional — the questions are correctly answerable as-is.

## What NOT to do

Per AGENTS.md §2 and §7, the Repair Agent must not:

- Change any `correctAnswers`.
- Change any `learningObjective`.
- Modify PASS questions not listed above.
- Cross module boundaries beyond A, B, C, D.
- Change `sourceRefs` (all correct options are already Tier 1 supported).
- Auto-promote `reviewStatus` to `agent_reviewed` — that is Round 2's decision after verification.

## Post-Repair validation checklist for main controller

Before promoting to Round 2:

1. `node scripts/validate-questions.mjs` — schema-level validation.
2. `node scripts/audit-questions.mjs` — audit gates (position bias, correct-length ratios, source coverage).
3. Confirm `version` bumped and `updatedAt` set on every touched question.
4. Confirm `reviews/resolutions/{A,B,C,D}.json` present with diff entries.
5. Confirm the poison-tail regex `(Under this (reading|framing|account|description)|In this (reading|account|framing|description))` no longer matches any **correct** option in modules C or D (run the check I used in review; expected result: 0/30 for C, 0/35 for D).
6. Confirm the explanation-label-mismatch scan reports 0 label conflicts for the 4 fixed questions.

## Multi-select cardinality note (informational, not for Repair)

Module D has 0 two-correct multi-select questions (all 8 multi are 3-correct). This is a distributional flag but does not block Round 2 — each 3-correct answer set is technically justified. Recommend flagging this for next-cycle generation-config tuning, not for this Repair.
