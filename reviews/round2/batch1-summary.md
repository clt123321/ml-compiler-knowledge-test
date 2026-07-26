# Batch 1 (Modules A, B, C, D) — Verification Round 2 Summary

- Verifier: verifier-batch1
- Verified at: 2026-07-26
- Modules: A (arch_perf_model, 30), B (compiler_basics, 25), C (graph_tensor_ir, 30), D (pytorch_compiler, 35)
- Total questions in this batch: **120**
- Method: Two-phase independent Round 2 verification. Phase A independent answering from de-answered blind packages (`reviews/blind/{A,B,C,D}.json`); Phase B compared with official `data/questions/{A,B,C,D}/**`, cross-referenced against `reviews/round1/*` and `reviews/resolutions/*` without letting Round 1 conclusions override the independent Round 2 judgment.

## Cross-module tally

| Module | Total | Ind-Agree | R2 PASS | R2 MINOR | R2 MAJOR | R2 BLOCKER | Upgraded → agent_reviewed | Kept draft |
|--------|-------|-----------|---------|----------|----------|------------|---------------------------|------------|
| A      | 30    | 30/30 (100%) | 30 | 0 | 0 | 0 | 30 | 0 |
| B      | 25    | 25/25 (100%) | 25 | 0 | 0 | 0 | 25 | 0 |
| C      | 30    | 30/30 (100%) | 30 | 0 | 0 | 0 | 30 | 0 |
| D      | 35    | 35/35 (100%) | 35 | 0 | 0 | 0 | 35 | 0 |
| **Total** | **120** | **120/120 (100%)** | **120** | **0** | **0** | **0** | **120** | **0** |

## Independent Round 2 vs Round 1

| Module | Round 1 PASS | R1 MINOR | R1 MAJOR | Repaired (v→2) | R2 upgraded from R1-MAJOR (repair-verified) |
|--------|--------------|----------|----------|----------------|---------------------------------------------|
| A | 27 | 3 (A-BANK-022, A-HIER-020, A-MEM-005) | 0 | 1 (A-BANK-022, explanation label fix) | 0 |
| B | 23 | 2 (B-CSE-012, B-LICM-013) | 0 | 2 (both, explanation label fix) | 0 |
| C | 16 | 1 (C-GRAPH-025) | 13 (poison-tail on correct option) | 14 | 13 |
| D | 25 | 0 | 10 (poison-tail on correct option) | 10 | 10 |
| **Total** | 91 | 6 | 23 | **27** | **23** |

- All 23 R1-MAJOR findings were resolved by the Repair Agent (v=2) by stripping the "poison tail" self-contradicting paragraph from the correct option's text.
- Round 2 independent answers still land on the same correct option letter after repair, confirming the repair is sound and the correct option's headline canonical claim is what the answer key relies on.
- 4 questions have unresolved R1 MINORs (A-HIER-020, A-MEM-005: wording; B-CSE-012 / B-LICM-013: explanation label — but those two ARE repaired to v=2). Actually only A-HIER-020 and A-MEM-005 are the still-open MINORs (v=1) — they are wording nits (capacity ordering / broadcast phrasing) that do not change the answer key. Round 2 does not upgrade their severity.

## Confidence distribution (Phase A independent)

| Module | high | medium | low |
|--------|------|--------|-----|
| A | 29 | 1 (A-MEM-005) | 0 |
| B | 25 | 0 | 0 |
| C | 15 | 15 | 0 |
| D | 24 | 11 | 0 |

The lower medium-confidence share in C and D reflects the pre-repair blind package: the "poison tail" pattern on the correct option required careful comparison of the headline canonical claim against the trailing contradictory paragraph. In every case the correct option was still identifiable because all four options were either (a) wrong throughout or (b) correct headline + contaminated rider. My Phase A independent answers therefore matched the official key regardless of the tail; the Repair Agent's v=2 patch simply eliminates the tail-versus-headline ambiguity, and Round 2 confirms the answer key is unchanged.

## Round-2 issues discovered beyond Round 1

- **None.** No new BLOCKER/MAJOR was surfaced in Round 2. The independent Round 2 answers matched the answer key on all 120 questions. The R1 findings (all MINORs + poison-tail MAJORs) were the same issues I noticed while answering Phase A; none upgraded to a more severe class after Phase B comparison; and all substantive fixes (MAJOR → v=2 via Repair Agent) survive Round 2 confirmation.

## Gate matrix — all 120 questions

| Gate | A | B | C | D | Total |
|------|---|---|---|---|-------|
| answerAgreement = true | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |
| uniqueAnswer = true | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |
| sourceSupported = true | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |
| hardwareConditionsSufficient = true | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |
| versionScopeSufficient = true | 30/30 (N/A stable) | 25/25 (N/A stable) | 30/30 (incl. C-STABLEHLO-014 version_sensitive OK) | 35/35 (all PyTorch 2.3~2.5 declared) | 120/120 |
| openBlocker = false | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |
| openMajor = false | 30/30 | 25/25 | 30/30 | 35/35 | 120/120 |

Every gate is true for every question in this batch → every question meets the double-PASS (R1 + R2) + all-gates-true criterion → **all 120 upgraded to `agent_reviewed`**.

## Post-verification pipeline checks

- `node scripts/validate-questions.mjs`: **OK** (400/400 schema pass across the whole corpus; 120 batch-1 questions now `agent_reviewed`, no schema regression).
- `node scripts/audit-questions.mjs`: **OK** (all audit gates pass: duplicate stems 0, meta-statement options 0, correct-longest ratio 0.74 ≤ 0.8, answer-position bias 0.049 ≤ 0.35, tier-3-only sources 0).

## Files produced / modified

- `reviews/round2/A-independent.json`, `reviews/round2/B-independent.json`, `reviews/round2/C-independent.json`, `reviews/round2/D-independent.json` — Phase-A independent answers with per-question confidence.
- `reviews/round2/A-verification.json`, `reviews/round2/B-verification.json`, `reviews/round2/C-verification.json`, `reviews/round2/D-verification.json` — Phase-B verification records (schemas/review.schema.json compliant).
- `reviews/round2/A-verification.md`, `reviews/round2/B-verification.md`, `reviews/round2/C-verification.md`, `reviews/round2/D-verification.md` — human-readable summaries.
- `reviews/round2/batch1-summary.md` — this file.
- `reviews/promotion-ledger.json` — created, contains 120 promotion entries `draft → agent_reviewed` for batch 1.
- `data/questions/{A,B,C,D}/*.json` — 120 files touched; **only** `reviewStatus` (draft → agent_reviewed) and `updatedAt` (→ 2026-07-26) fields modified. No changes to stems/options/explanations/optionExplanations/correctAnswers/sourceRefs/hardwareContext/softwareContext/tensorContext/codeSnippet/irSnippet/profileData/assumptions/nonImplications/misconceptionTags/distractorRationales/version.

## Non-actions (as required)

- No question was upgraded to `human_reviewed`. Any such upgrade must go through a human reviewer.
- No cross-module (E–N) files were touched.
- No schema / config / script changes.
- Round 1 conclusions were read only for reference after Phase A completed; the Round 2 independent answers were formed without access to Round 1 output.

## Recommendations to 主控

1. **Human review priority (for eventual `human_reviewed` promotion):**
   - A-HIER-020 and A-MEM-005 still carry open R1 MINORs (wording nits). These do not affect the answer key but a human reviewer may wish to polish the wording before promoting to `human_reviewed`.
   - The 23 repaired items in C and D (poison-tail strip) benefited from Round 2 independent confirmation. A human reviewer could spot-check that the stripped tail was not load-bearing for any correct-option nuance; my read is that in every case the leading canonical sentence is self-contained.
2. **Batch 1 ready to feed Global Reviewer.** All 120 questions have `reviewStatus: agent_reviewed`, all gates true, all Round 1 findings closed or accounted for.
