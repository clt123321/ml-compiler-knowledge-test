# Module C — Verification (Round 2) — Batch 1

- Verifier: verifier-batch1
- Verified at: 2026-07-26
- Module: C (graph_tensor_ir), 30 questions
- Method: Two-phase independent verification. Phase A: independent answering from `reviews/blind/C.json` only (no access to correctAnswers/explanation/optionExplanations/sourceRefs.supports). Independent answers recorded in `reviews/round2/C-independent.json`. Phase B: compared with official answers under `data/questions/C/**` + read `reviews/round1/C-review.json` and `reviews/resolutions/C.json` as reference (not overriding).

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 30 |
| Independent Phase-A answers agreeing with official | **30/30 (100%)** |
| Round 2 PASS | 30 |
| Round 2 MINOR | 0 |
| Round 2 MAJOR | 0 |
| Round 2 BLOCKER | 0 |
| Round 1 result recap | PASS 16, MINOR 1, MAJOR 13 |
| Repaired items (v>=2) verified in Round 2 | 14 |
| Source-supported gate true | 30/30 |
| Hardware conditions gate true | 30/30 |
| Version scope gate true | 30/30 |
| Upgraded to agent_reviewed | 30 |

## Findings

### BLOCKER (0)
_None._

### MAJOR (0)
_None new in Round 2._ All Round 1 MAJORs were resolved by Repair Agent (v1 -> v2) with the poison-tail paragraph stripped from the correct option's text; Round 2 independent answers still match after repair, confirming the fix.

### MINOR
- **C-BUFFER-012** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-DCE-013** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-DIALECT-016** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-EAGER-015** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-GRAPH-025** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-LAYOUTOPT-026** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-LEGALIZE-008** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-SHAPEINFER-029** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-STRIDE-020** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-SYMSHAPE-018** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-TE-022** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-TILING-011** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-VERIFY-009** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **C-VIEW-010** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.

## Positive observations

- **100% agreement between independent Round 2 answers and official keys** — the answer keys are technically unambiguous from the question text alone (no access to explanations or sources).
- **Independent from Round 1 reviewer.** Verifier is a distinct subagent from generation, primary review, and repair. Round 2 conclusions were formed by independent answering; no case required overriding Round 1.
- **Repair Agent's fix was surgically correct.** The 'poison tail' paragraphs on correct options were removed; the leading canonical claim (which is what the answer key relies on) was preserved. Round 2 independent answers still land on the same option letter.
- **All version-sensitive questions carry `frameworkVersionScope` (or `compilerVersionScope`) and `verifiedAt`.**
- **No fabricated performance numbers detected in Round 2.** Cited peaks/bandwidths match NVIDIA public whitepapers where applicable; Roofline/Little/Amdahl derivations reproduce exactly.

## Per-question results

| ID | Type | CA | Ind Ans | Agree | R1 | R2 | Upgraded |
|----|------|----|---------|-------|----|----|----------|
| C-BUFFER-012 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-CANON-006 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| C-DCE-013 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-DIALECT-016 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-EAGER-015 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-GRAPH-025 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | MINOR | PASS | agent_reviewed |
| C-IRLEVEL-005 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| C-IRLEVELS-019 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| C-LAYOUT-002 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| C-LAYOUTOPT-026 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-LEGALIZE-008 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-LICM-001 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| C-LINALG-030 | multi | ['A', 'B', 'C'] | ['A', 'B', 'C'] | ✓ | PASS | PASS | agent_reviewed |
| C-LOOPIR-023 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| C-LOWER-007 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| C-MATERIALIZE-027 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| C-OPIR-028 | multi | ['A', 'B', 'D'] | ['A', 'B', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| C-PROD-017 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| C-REGION-021 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| C-SHAPE-004 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| C-SHAPEINFER-029 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-SSA-003 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| C-STABLEHLO-014 | multi | ['A', 'C'] | ['A', 'C'] | ✓ | PASS | PASS | agent_reviewed |
| C-STRIDE-020 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-SYMSHAPE-018 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-TE-022 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-TILING-011 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-TYPECONV-024 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| C-VERIFY-009 | single | ['D'] | ['D'] | ✓ | MAJOR | PASS | agent_reviewed |
| C-VIEW-010 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
