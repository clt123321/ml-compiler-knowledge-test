# Module A — Verification (Round 2) — Batch 1

- Verifier: verifier-batch1
- Verified at: 2026-07-26
- Module: A (arch_perf_model), 30 questions
- Method: Two-phase independent verification. Phase A: independent answering from `reviews/blind/A.json` only (no access to correctAnswers/explanation/optionExplanations/sourceRefs.supports). Independent answers recorded in `reviews/round2/A-independent.json`. Phase B: compared with official answers under `data/questions/A/**` + read `reviews/round1/A-review.json` and `reviews/resolutions/A.json` as reference (not overriding).

## Cross-question tally

| Metric | Value |
|--------|-------|
| Total questions | 30 |
| Independent Phase-A answers agreeing with official | **30/30 (100%)** |
| Round 2 PASS | 30 |
| Round 2 MINOR | 0 |
| Round 2 MAJOR | 0 |
| Round 2 BLOCKER | 0 |
| Round 1 result recap | PASS 27, MINOR 3, MAJOR 0 |
| Repaired items (v>=2) verified in Round 2 | 1 |
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
- **A-BANK-022** — `round1_repair_verified`. Round 1 flagged MAJOR (poison-tail on correct option); Repair Agent stripped the trailing self-contradicting paragraph (v1->v2). Round 2 independent answer confirms the correct option's headline claim; repair is sound. No open issues.
- **A-HIER-020** — `wording`. Round 1 MINOR wording finding still open (not blocking): Option C's per-SM capacity ordering 'HBM > L2 > SMEM > RF' has RF and SMEM in the wrong strict order on A100 (RF 256 KB > SMEM up to 192 KB). The overall intent (HBM/L2 dwarfs on-c. Round 2 confirms correctness of answer key and does not upgrade severity.
- **A-MEM-005** — `wording`. Round 1 MINOR wording finding still open (not blocking): Option C 'in one cycle to the whole warp' slightly simplifies the CUDA Programming Guide's canonical broadcast description ('as fast as a register read'). Consistent with the canar. Round 2 confirms correctness of answer key and does not upgrade severity.

## Positive observations

- **100% agreement between independent Round 2 answers and official keys** — the answer keys are technically unambiguous from the question text alone (no access to explanations or sources).
- **Independent from Round 1 reviewer.** Verifier is a distinct subagent from generation, primary review, and repair. Round 2 conclusions were formed by independent answering; no case required overriding Round 1.
- **All version-sensitive questions carry `frameworkVersionScope` (or `compilerVersionScope`) and `verifiedAt`.**
- **No fabricated performance numbers detected in Round 2.** Cited peaks/bandwidths match NVIDIA public whitepapers where applicable; Roofline/Little/Amdahl derivations reproduce exactly.

## Per-question results

| ID | Type | CA | Ind Ans | Agree | R1 | R2 | Upgraded |
|----|------|----|---------|-------|----|----|----------|
| A-AMDAHL-008 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| A-ARITH-001 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| A-ARITH-002 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-BANK-022 | single | ['D'] | ['D'] | ✓ | MINOR | PASS | agent_reviewed |
| A-BATCH-028 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| A-BW-006 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| A-CACHE-010 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| A-COAL-009 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| A-CPUGPU-027 | multi | ['A', 'B', 'C'] | ['A', 'B', 'C'] | ✓ | PASS | PASS | agent_reviewed |
| A-DIVERG-021 | multi | ['B', 'C'] | ['B', 'C'] | ✓ | PASS | PASS | agent_reviewed |
| A-ENERGY-016 | multi | ['A', 'B'] | ['A', 'B'] | ✓ | PASS | PASS | agent_reviewed |
| A-HIER-020 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | MINOR | PASS | agent_reviewed |
| A-ILP-030 | multi | ['A', 'C', 'D'] | ['A', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| A-INTENSE-019 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-LAUNCH-015 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| A-LITTLE-004 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-MEM-005 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | MINOR | PASS | agent_reviewed |
| A-NVLINK-014 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| A-OCC-003 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-PARA-024 | multi | ['A', 'B', 'D'] | ['A', 'B', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| A-PCIE-013 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
| A-PEAK-018 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-POWER-029 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| A-REGSPILL-025 | single | ['C'] | ['C'] | ✓ | PASS | PASS | agent_reviewed |
| A-RIDGE-007 | single | ['B'] | ['B'] | ✓ | PASS | PASS | agent_reviewed |
| A-SIMT-011 | multi | ['A', 'B'] | ['A', 'B'] | ✓ | PASS | PASS | agent_reviewed |
| A-STREAM-026 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| A-TC-023 | single | ['D'] | ['D'] | ✓ | PASS | PASS | agent_reviewed |
| A-THROUGH-017 | multi | ['B', 'C', 'D'] | ['B', 'C', 'D'] | ✓ | PASS | PASS | agent_reviewed |
| A-WARP-012 | single | ['A'] | ['A'] | ✓ | PASS | PASS | agent_reviewed |
