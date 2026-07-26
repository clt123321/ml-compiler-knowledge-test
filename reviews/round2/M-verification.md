# Module M — Round 2 Verification Report

**Reviewer:** verification-agent-4 (Batch 4)
**Date:** 2026-07-27
**Scope:** 15 questions in `data/questions/M/`
**Method:** Stage A blind independent answering → Stage B comparison with official answers, sources, and Round 1 record.

## Stage A — Independent Answer Agreement

**15 / 15 (100%)** blind independent answers match the official `correctAnswers` field on all questions, all multi-select sets matched exactly.

| id | blind answer | official | agree |
|---|---|---|---|
| M-A2A-004 | D | D | ✓ |
| M-AR-001 | B | B | ✓ |
| M-BOUNDARY-014 | A,B,C | A,B,C | ✓ |
| M-BUCKET-006 | D | D | ✓ |
| M-COST-002 | C | C | ✓ |
| M-COSTAG-011 | A,C,D | A,C,D | ✓ |
| M-COSTMODEL-010 | C | C | ✓ |
| M-GSPMD-012 | D | D | ✓ |
| M-GSPMD-013 | A | A | ✓ |
| M-MESH-008 | A | A | ✓ |
| M-OVERLAP-005 | B,C | B,C | ✓ |
| M-PIPE-015 | B | B | ✓ |
| M-RS-003 | D | D | ✓ |
| M-SHARD-009 | C,D | C,D | ✓ |
| M-SPMD-007 | B,C,D | B,C,D | ✓ |

## Gate Verification

For every question:
- `sourceSupported = true` — all `sourceRefs` are Tier 1/2 (GSPMD paper, Hennessy & Patterson Ch.6, StableHLO doc, CUDA guide) with explicit locators and `supports` fields matching the correct options.
- `hardwareConditionsSufficient = true` — `hardwareContext` (vendor / architecture / device / requiredFeatures) is either explicitly generic (concept-level) or sufficiently specified when NCCL/GPU dependence matters (M-OVERLAP-005 pins NVIDIA + async streams; M-COST-002 requires symmetric BW; M-COSTMODEL-010 specifies α, β).
- `versionScopeSufficient = true` — every M question uses `softwareContext.stability = "stable_principle"`, which is correct: SPMD partitioning, collective semantics, α+βS cost model, and the GSPMD design intent are all stable principles independent of a specific PyTorch/XLA version.

## Distributed-Specific Checks

Per Batch 4 special-attention items:

1. **Collective semantics (M-A2A-004, M-AR-001, M-RS-003, M-COST-002, M-COSTAG-011)** — All-to-All / AllReduce / AllGather / ReduceScatter definitions, the identity AllReduce = ReduceScatter + AllGather, and the ring cost 2·(N-1)/N·S/BW are all standard and correctly stated. `M-COSTAG-011` correctly identifies (N-1)/N per-rank cost for both AG and RS.
2. **SPMD abstraction (M-BOUNDARY-014, M-GSPMD-012, M-GSPMD-013, M-MESH-008, M-SHARD-009, M-SPMD-007)** — clean separation between compiler responsibilities (insert collectives per sharding; emit reshards) and runtime responsibilities (algorithm choice, chunk sizes, fault tolerance). Device Mesh is correctly framed as a logical named-axis grid decoupled from physical topology. GSPMD annotations are correctly framed as hints that propagate.
3. **Reshard semantics (M-SHARD-009)** — correct answer set (C,D): sharded→replicated = AllGather; partial-sum→replicated = AllReduce. Correctly rejects (A) local-reshape-only for a cross-axis reshard and (B) AllReduce for replicated→sharded (which is a local slice).
4. **Overlap preconditions (M-OVERLAP-005)** — correctly picks distinct-stream + no-early-consumer, and correctly rejects the "dedicated comm core required" myth (A) and the anti-overlap serialization (D).
5. **Pipeline bubble (M-PIPE-015)** — canonical (P-1)/(P+M-1) formula, with the correct trade-off (more activations in flight or recomputation).

## Issues

Two MINOR style/clarity notes carried over from Round 1 (M-BOUNDARY-014 option-D wording; M-BUCKET-006 option-C "averages"; M-COSTMODEL-010 KB vs KiB). None affects correctness or blocks promotion; they are recorded in `M-verification.json` for future stylistic tightening only. No new issues were introduced by Round 2.

## Result

**15 / 15 PASS** — All 15 M questions satisfy all five promotion gates. All are recommended for promotion to `agent_reviewed`.
