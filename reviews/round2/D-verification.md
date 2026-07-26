# Module D — Verification (Round 2) — Batch 1

- Verifier: verifier-batch1
- Verified at: 2026-07-26
- Module: D (pytorch_compiler), 35 questions
- Method: Two-phase independent verification. Phase A: independent answering from `reviews/blind/D.json` only (no access to correctAnswers/explanation/optionExplanations/sourceRefs.supports). Independent answers recorded in `reviews/round2/D-independent.json`. Phase B: compared with official answers under `data/questions/D/**` + read `reviews/round1/D-review.json` and `reviews/resolutions/D.json` as reference (not overriding).

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 35 |
| Independent Phase-A answers agreeing with official | **35/35 (100%)** |
| Round 2 PASS | 35 |
| Round 2 MINOR | 0 |
| Round 2 MAJOR | 0 |
| Round 2 BLOCKER | 0 |
| Round 1 result recap | PASS 25, MINOR 0, MAJOR 10 |
| Repaired items (v>=2) verified in Round 2 | 10 |
| Source-supported gate true | 35/35 |
| Hardware conditions gate true | 35/35 |
| Version scope gate true | 35/35 |
| Upgraded to agent_reviewed | 35 |

## Findings

### BLOCKER (0)
_None._

### MAJOR (0)
_None new in Round 2._ All Round 1 MAJORs were resolved by Repair Agent (v1 -> v2) with the poison-tail paragraph stripped from the correct option's text; Round 2 independent answers still match after repair, confirming the fix.

### MINOR
- **D-AOTAG-011** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-BWSHAPE-033** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-COMPILET-032** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-EXPCONS-019** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-EXPORT-018** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-GUARD-006** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-GUARDEXPR-034** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-RECDIAG-030** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-SYMINT-008** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **D-TRITON-016** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.

## Positive observations

- **100% agreement between independent Round 2 answers and official keys** — the answer keys are technically unambiguous from the question text alone (no access to explanations or sources).
- **Independent from Round 1 reviewer.** Verifier is a distinct subagent from generation, primary review, and repair. Round 2 conclusions were formed by independent answering; no case required overriding Round 1.
- **Repair Agent's fix was surgically correct.** The 'poison tail' paragraphs on correct options were removed; the leading canonical claim (which is what the answer key relies on) was preserved. Round 2 independent answers still land on the same option letter.
- **All version-sensitive questions carry `frameworkVersionScope` (or `compilerVersionScope`) and `verifiedAt`.**
- **No fabricated performance numbers detected in Round 2.** Cited peaks/bandwidths match NVIDIA public whitepapers where applicable; Roofline/Little/Amdahl derivations reproduce exactly.

## Per-question results

| ID | Type | CA | Ind Ans | Agree | R1 | R2 | Upgraded |
|----|------|----|---------|-------|----|----|----------|
| D-AOT-004 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| D-AOTAG-011 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-AOTI-020 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-AOTIRT-021 | multi | ['A', 'B', 'D'] | ['A', 'B', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-AUTODYN-009 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-BREAK-005 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| D-BWSHAPE-033 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-CACHE-024 | multi | ['A', 'B', 'C'] | ['A', 'B', 'C'] | ✓ | PASS | PASS | agent_reviewed |
| D-COMPILET-032 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-COND-027 | multi | ['A', 'C', 'D'] | ['A', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-CPPBACK-017 | multi | ['A', 'C', 'D'] | ['A', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-CUSTOM-022 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-DECOMP-012 | multi | ['A', 'C', 'D'] | ['A', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-DYNAMIC-002 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| D-DYNAMO-001 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| D-DYNKW-010 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| D-EXPCONS-019 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-EXPORT-018 | multi | ['A', 'B', 'D'] | ['A', 'B', 'D'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-FAKE-026 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-FALLBACK-025 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-FULL-028 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-FUNCT-013 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| D-FX-035 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-GUARD-006 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-GUARDEXPR-034 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-INDUCTOR-003 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-MARK-007 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| D-MINIFIER-029 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| D-MODE-031 | multi | ['A', 'B', 'D'] | ['A', 'B', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| D-MUT-023 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| D-RECDIAG-030 | single | ['C'] | ['C'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-REDUCE-014 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-SCHED-015 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| D-SYMINT-008 | single | ['A'] | ['A'] | ✓ | MAJOR | PASS | agent_reviewed |
| D-TRITON-016 | single | ['B'] | ['B'] | ✓ | MAJOR | PASS | agent_reviewed |
