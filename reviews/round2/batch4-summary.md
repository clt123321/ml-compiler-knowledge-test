# Batch 4 — Round 2 Verification Summary

**Reviewer:** verification-agent-4 (Round 2)
**Date:** 2026-07-27
**Batch scope:** Module M (distributed) — 15 questions; Module N (paper_design) — 10 questions. Total: **25 questions**.
**Prior stage:** Batch 4 Primary Review (Round 1) reported 25/25 PASS with no Repair records.

## Stage A — Independent (blind) answers

I answered all 25 questions using only `reviews/blind/{M,N}.json` (stems, options, hardware/software context, assumptions), without reading `data/questions/**` answers or explanations, and without consulting the Round 1 record. Results are in:

- `reviews/round2/M-independent.json` (15 answers, all high-confidence)
- `reviews/round2/N-independent.json` (10 answers, all high-confidence)

## Stage B — Comparison against official answers

After Stage A was locked, I read the official `correctAnswers`, `sourceRefs`, `softwareContext`, `hardwareContext`, `performanceClaim`, and `data/content-cards/{M,N}/**`, plus `reviews/round1/{M,N}-review.json`.

### Independent-answer agreement

| Module | Questions | Blind answers matching official | Rate |
|---|---:|---:|---:|
| M | 15 | 15 | 100% |
| N | 10 | 10 | 100% |
| **Total** | **25** | **25** | **100%** |

Every multi-select set matched exactly (order-independent).

### Round 2 verification result

| Module | Questions | Round 2 PASS | Round 2 MINOR (informational) | Round 2 MAJOR | Round 2 BLOCKER |
|---|---:|---:|---:|---:|---:|
| M | 15 | 15 | 3 (all Round-1 style/clarity, non-blocking) | 0 | 0 |
| N | 10 | 10 | 3 (all Round-1 scope/version-scope, non-blocking) | 0 | 0 |

### Promotion gate check

For every question:

- `answerAgreement`: true
- `sourceSupported`: true (Tier-1/2 primary sources: GSPMD, Ansor, TVM, Triton, MLIR, Halide, FlashAttention, vLLM, SmoothQuant/GPTQ/AWQ, PyTorch 2, Hennessy & Patterson Ch. 6, StableHLO / MLIR / torch.compile / CUDA docs — all with explicit locators and `supports` lists that align with the correct options)
- `hardwareConditionsSufficient`: true (GPU-specific claims pinned to NVIDIA + relevant feature; conceptual questions correctly `generic`)
- `versionScopeSufficient`: true (all `stable_principle` except N-PYT2-009 which is correctly `version_sensitive` with `frameworkVersionScope` + `verifiedAt`)
- `round1Pass` + `round2Pass`: both true

## Batch 4 special-attention findings

The task called out two module-specific risk classes; both are covered:

### 1. Module N — paper_design_intent rigor

All 10 N questions are paper-design or scope-discipline questions. Each of the four specifically-called-out risks is addressed by at least one question:

- **Paper conclusion scope** — every paper claim is scoped to what the paper actually establishes (Halide separation as a design choice, MLIR shared infrastructure not "single IR", Triton tile-level abstraction not "CUDA superset", TVM measurement-driven not "always superior to analytical", Ansor task scheduler motivation not "10% floor", vLLM PagedAttention as fragmentation fix not "FLOP reduction").
- **Peak vs geomean** — directly tested in N-GSPMD-008 with the correct answer set (B, C) covering both the peak/geomean gap and the conditioning of paper numbers on stack/HW/workload.
- **Kernel-level vs e2e speedup** — directly tested in N-PYT2-009 with an Amdahl-based reasoning frame for the correct answer.
- **Single-paper vs domain consensus** — directly tested in N-QUANT-010 with the correct set (A, C, D) rejecting the universal "≥3× e2e from 4-bit" overclaim.

Additionally, the FlashAttention question (N-FLASH-006) is explicitly scoped to v1 in both stem and `softwareContext.framework`, and correctly refutes the common misconception that the backward reuses a stored N×N matrix.

### 2. Module M — collective semantics & SPMD abstraction

- All-to-All / AllReduce / AllGather / ReduceScatter definitions are correct.
- Ring-AllReduce cost 2·(N-1)/N · S / BW is derived correctly, and the identity AllReduce = ReduceScatter + AllGather is directly tested.
- Compiler / runtime boundary is correctly separated (compiler inserts collectives per sharding; runtime picks algorithm/chunks/lanes; runtime handles fault tolerance).
- Device Mesh is correctly framed as a logical named-axis grid decoupled from physical topology.
- Reshard collectives (sharded↔replicated, partial-sum→replicated) are correctly enumerated in M-SHARD-009.
- Pipeline bubble (P-1)/(P+M-1) and its trade-off (activations vs recomputation) are correct.
- SPMD vs MPMD boundary is correctly drawn in M-SPMD-007.

## Promotions

**25 / 25** questions in Batch 4 pass both Round 1 and Round 2 with all five gate fields true. All are promoted:

```
draft → agent_reviewed
```

`reviewStatus` and `updatedAt` (2026-07-27) have been rewritten on every question JSON in `data/questions/M/*.json` and `data/questions/N/*.json`. A new `reviews/promotion-ledger.json` file has been created with 25 entries (id, from, to, by, at, evidence).

Nothing is promoted to `human_reviewed` — that boundary is reserved for human confirmation.

## Round 1 gaps

**None found.** All three MINOR notes carried over from Round 1 (M-BOUNDARY-014 option-D wording, M-BUCKET-006 option-C phrasing, M-COSTMODEL-010 KB vs KiB) were re-confirmed as non-correctness issues. No Round 1 finding was under-severed. No new BLOCKER, MAJOR, or previously-missed issue was found in Round 2.

## Post-checks

- `node scripts/validate-questions.mjs` → **OK, 400/400 schema-valid**.
- Module counts unchanged: M=15/15, N=10/10.
- No cross-module writes, no writes to `schemas/`, `config/`, `docs/`, `references/`, `scripts/`, or content cards.
