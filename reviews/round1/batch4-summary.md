# Batch 4 — Primary Review Summary (Modules M + N)

- **Reviewer**: primary-review-4
- **Modules**: M (distributed, 15 questions) + N (paper_design, 10 questions)
- **Total**: 25 questions
- **Date**: 2026-07-27
- **Independence**: reviewer is not the generation Agent; Phase A executed strictly on `reviews/blind/{M,N}.json` before opening `data/questions/**` or `data/content-cards/**`.

## Headline

| Module | # | Agreement | PASS | MINOR | MAJOR | BLOCKER | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|
| **M** | 15 | 15/15 (100%) | 15 | 0 (3 with MINOR notes) | 0 | 0 | **No repair needed** |
| **N** | 10 | 10/10 (100%) | 10 | 0 (2 with MINOR notes) | 0 | 0 | **No repair needed** |
| **Total** | **25** | **25/25 (100%)** | **25** | **0** | **0** | **0** | **Proceed to Round 2** |

All 25 questions are eligible to proceed to Round 2 (Verification) without repair. The 5 MINOR notes documented in the per-module review files are stylistic tightenings only and do not gate promotion.

## Module M priorities — check-list

| Priority (from brief) | Coverage | Correctness |
|---|---|---|
| AllReduce / AllGather / ReduceScatter / All-to-All semantics | M-AR-001, M-RS-003, M-A2A-004 | ✅ all correct |
| SPMD / Device Mesh abstraction | M-SPMD-007, M-MESH-008 | ✅ correct; Mesh framed as logical named-axis grid |
| Communication cost model | M-COST-002, M-COSTAG-011, M-COSTMODEL-010 | ✅ α + βS regimes correct; ring identities correct; performanceClaim.hardwareDependent=false for analytical results |
| GSPMD design intent | M-GSPMD-012, M-GSPMD-013 | ✅ propagation-and-reshard-insertion; annotations-as-hints |

## Module N priorities — paper_design accuracy audit

All 10 questions are `archetype: paper_design_intent` or `concept_boundary` (research-judgement). Three-principle enforcement:

### 1. Conclusions must have scope

| Question | Scope binding |
|---|---|
| N-FLASH-006 | Explicitly scopes to FlashAttention v1; performanceClaim.hardwareDependent=true with GPU + seq-length + head-dim scope |
| N-GSPMD-008 | Direct teaching that speedups are conditioned on hardware/software/workload/baseline |
| N-PYT2-009 | frameworkVersionScope=PyTorch 2.x as reported in paper; verifiedAt=2026-07-26 |
| N-QUANT-010 | D binds wall-clock speedup to efficient dequant-GEMM kernel availability on target hardware; C binds accuracy claims to model/task/calibration |
| N-VLLM-007 | nonImplications state throughput numbers do not generalize to arbitrary hardware / workloads |

**Result**: no unscoped absolute claim detected.

### 2. Peak vs geomean discipline

N-GSPMD-008 is *the* peak-vs-geomean question. Its structure:
- B (correct): peak > geomean in general; peak overstates typical
- D (wrong): peak == geomean interchangeable

Correctly encoded. No other N question quotes a peak number as if it were the geomean.

### 3. Single-paper conclusion ≠ domain consensus

- N-QUANT-010 explicitly rejects combining SmoothQuant + GPTQ + AWQ into "universal claims" (option B rejected; options A/C accepted).
- N-GSPMD-008 C explicitly rejects transferring paper numbers as general property of the technique without additional justification.

**Result**: no single-paper result generalized to a domain-wide claim.

### Additional discipline checks

| Check | Result |
|---|---|
| Kernel-level speedup written as e2e? | **No.** N-PYT2-009 exists to teach the opposite. |
| Compile time ignored? | **No.** N-TVM-002 / N-ANSOR-003 surface tuning wall-clock as a trade-off. |
| FP16 vs FP32 conflation? | **N/A** — no N question makes precision-dependent claims. |
| Shape/hardware conditioning present where needed? | **Yes.** N-FLASH-006 A binds speedup to memory-bound regime; N-VLLM-007 nonImplications acknowledge hardware dependency. |
| Do论文数字被跨平台泛化? | **No.** No cross-platform generalization of a specific paper's speedup number. |

### Paper-specific accuracy — spot check

- **FlashAttention (N-FLASH-006)**: correctly does NOT claim backward stores N×N; recomputation from softmax statistics is properly encoded. Option B (stores N×N) is a distractor and correctly wrong. ✅
- **vLLM PagedAttention (N-VLLM-007)**: correctly frames as KV-cache memory management, not FLOPs reduction and not KV-cache elimination. ✅
- **TVM (N-TVM-002)**: correctly attributes measurement-based cost model to hard-to-model microarchitectural effects, not to reproducibility. ✅
- **Ansor (N-ANSOR-003)**: task scheduler correctly restricted to autotuning-budget allocation, not runtime dispatch. ✅
- **GSPMD (N-GSPMD-008)**: the question is about paper-number interpretation discipline, not a specific GSPMD number — a clean and correct framing. ✅
- **SmoothQuant / GPTQ / AWQ (N-QUANT-010)**: correctly separates memory-footprint reduction from wall-clock speedup and binds wall-clock to kernel availability. ✅
- **PyTorch 2 (N-PYT2-009)**: correctly identifies the kernel-vs-e2e Amdahl bound. ✅
- **Halide (N-HALIDE-001)**, **MLIR (N-MLIR-004)**, **Triton (N-TRITON-005)**: canonical paper design-intent framings; distractors are plausible-but-clearly-wrong. ✅

## Sources

All source refs across M+N resolve in `references/SOURCE_REGISTRY.json`:
- Books: `BOOK:hp6`
- Papers: `PAPER:gspmd`, `PAPER:halide`, `PAPER:tvm`, `PAPER:ansor`, `PAPER:mlir`, `PAPER:triton`, `PAPER:flashattn`, `PAPER:vllm`, `PAPER:smoothquant`, `PAPER:gptq`, `PAPER:awq`, `PAPER:pytorch2`
- Official docs: `DOC:cuda-guide`, `DOC:stablehlo`, `DOC:mlir-langref`, `DOC:torch-compile`

All are Tier 1 (books/official docs) or Tier 2 (peer-reviewed papers). No Tier-3-only anchoring of the unique correct answer.

## Answer position distribution

Across the 25 questions:
- Single-choice questions land on A(4), B(3), C(3), D(6) — reasonably spread; no answer letter dominates.
- Multi-choice questions use varied correct-set sizes (2 or 3 out of 4 options).

## Files produced

- `reviews/round1/M-independent.json` — Phase A blind answers, 15 items
- `reviews/round1/N-independent.json` — Phase A blind answers, 10 items
- `reviews/round1/M-review.json` — schema-conformant review records, 15 items
- `reviews/round1/N-review.json` — schema-conformant review records, 10 items
- `reviews/round1/M-review.md` — human-readable module M report
- `reviews/round1/N-review.md` — human-readable module N report
- `reviews/round1/batch4-summary.md` — this file
- `handoffs/review/batch4.md` — main-controller handoff

## Recommendation to main controller

1. **Do not schedule repair for M or N** — no BLOCKER, no MAJOR, no MINOR requiring fix.
2. **Advance batch 4 directly to Round 2 (Verification)** with a Verifier who is not primary-review-4 nor the generation Agent for M/N.
3. The 5 MINOR stylistic notes (M-COSTMODEL-010, M-BUCKET-006, M-BOUNDARY-014, N-FLASH-006, N-PYT2-009) can be aggregated into a low-priority polish backlog and addressed opportunistically; they are non-blocking for `agent_reviewed` promotion.
