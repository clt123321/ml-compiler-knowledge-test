# Batch 3 Primary Review Summary — Modules I, J, K, L

- Reviewer: primary-review-3 (canary items L-001..L-005 originally by primary-review-canary)
- Reviewed at: 2026-07-27
- Total questions: 120 (30 × 4 modules)
- Blind stage: `reviews/blind/{I,J,K,L}.json` read; answers written to `reviews/round1/{I,J,K,L}-independent.json` without touching data/questions
- Compare stage: `data/questions/{I,J,K,L}` cross-checked against independent answers, sources, hardware/version scope, and post-shuffle explanation prose

## Aggregate results

| Module | # | Agree | PASS | MINOR | MAJOR | BLOCKER |
|--------|---|-------|------|-------|-------|---------|
| I | 30 | 28 (93.3%) | 22 | 7 | 1 | 0 |
| J | 30 | 30 (100%) | 24 | 6 | 0 | 0 |
| K | 30 | 30 (100%) | 30 | 0 | 0 | 0 |
| L | 30 | 28 (93.3%) | 27 | 3 | 0 | 0 |
| **Total** | **120** | **116 (96.7%)** | **103** | **16** | **1** | **0** |

**No BLOCKER anywhere.** One MAJOR (uniqueness dispute on I-SPARSE-022). All other non-PASS items are MINOR — most (13/16) are the systemic post-shuffle `explanation_label_mismatch` pattern, which does not affect answer correctness (the `correctAnswers` array is the source of truth; only the human-readable explanation prose has letter-reference drift).

## Per-module top 3 most severe

### Module I (attention / core ops)
1. **I-SPARSE-022** — **MAJOR** — Option C ("Structured 2:4 sparsity yields real speedup on supported dtypes") is factually correct as scoped; official rejects it as "oversells without conditions" but the option itself provides the condition. Uniqueness disputable → repair suggests either updating official to {B, C, D} or tightening option C to be cleanly wrong.
2. **I-ATTBACK-025** — MINOR — explanation_label_mismatch + I marginally missed option B ("FA backward FLOPs strictly larger; speedup ENTIRELY from HBM reduction dominating") on my independent answer. Official is defensible.
3. **I-EPILOGUE-024 / I-FLASHPROP-026 / I-FUSEDPROP-030 / I-KVDF-029 / I-MOEPROP-028 / I-RMSPROP-027** — MINOR — same `explanation_label_mismatch` pattern (post-shuffle prose drift).

### Module J (LLM inference systems)
1. **J-DISAG-029** — MINOR — explanation_label_mismatch.
2. **J-FAIRTHR-030** — MINOR — explanation_label_mismatch.
3. **J-OOM-028** — MINOR — explanation_label_mismatch.

(J-PAGEDDES-024, J-SPECPROP-023, J-TVL-027 also MINOR label-mismatch. **All 30 correct answers agreed with independent answers — 100% agreement.**)

### Module K (runtime / deployment)
No non-PASS. **30/30 PASS — cleanest module of the batch.** No repair needed.

### Module L (profiling / debug / correctness)
1. **L-ROOFLINE-021** — MINOR — Option D's AI wording "0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)" — the arithmetic is off by 2x (true AI = 2 FLOPs / 8 bytes = 0.25). Roofline diagnosis (memory-bound, expected ~62 µs, measured 40 ms indicates issue) is correct regardless.
2. **L-DYNREG-013** — MINOR — Option B (conditional/general statement about cache_size_limit thrashing) — reads as correct in general but official rejects it for the current 8-shape state. Uniqueness disputable.
3. **L-DETERM-017** — MINOR — Option A's CUDA_VISIBLE_DEVICES example is imprecise; the general "determinism only for identical execution configurations" claim is canonical. Uniqueness disputable.

## Focus areas requested by task brief

### vLLM / SGLang / TRT-LLM version-sensitive coverage (J module)
- All 10 J questions dealing with specific serving-stack behavior are correctly marked `version_sensitive` with `frameworkVersionScope` (vLLM 0.4+ / SGLang / TRT-LLM 0.9+) and `verifiedAt: 2026-07-26`.
- Stable architectural principles (prefill compute-bound / decode BW-bound, TP AllReduce, PP layer partition, TPOT/TTFT definitions, PagedAttention abstraction, spec dec correctness) are correctly marked `stable_principle`.
- The separation "PagedAttention abstraction is stable" (J-PAGED-006) vs "vLLM 0.2+ specific kernel implementation" (J-PAGEDATT-020, J-PAGEDDES-024) is exactly right.
- **Verdict: version-sensitive scoping is uniformly correct in Module J.**

### FlashAttention / attention correctness (I module)
- I-FLASH-005, I-FLASHIO-006, I-FLASHPROP-026, I-ATTBACK-025, I-ONLINESM-004, I-MHAMQA-007, I-GQA-008, I-KVCACHE-009, I-KVDF-029: all have correct kernel dataflow and memory footprint descriptions.
- HBM I/O complexity O(N²d/M), backward recompute from (m,l) statistics, online softmax rescaling both partials, KV footprint scaling with H_kv, MQA/GQA SMEM reuse across query heads — all standard results correctly stated.
- **No conflation of kernel-level and end-to-end speedup.** FLASHPROP-026 explicitly uses the "3-4x uniform speedup" overclaim as a distractor.
- **No fabricated benchmark numbers.** Only algorithmic/analytical results.

### ONNX / Runtime boundary (K module)
- K-ONNX-014 (ONNX = format), K-ONNXSHAPE-016 (per-op via schemas, symbolic dims allowed), K-ONNXVER-017 (IR-version vs opset-version distinction), K-OPSET-015 (opset = per-op schema semantics): all correctly separate the interchange format from the consumer runtime.
- K-BOUND-001, K-DISPATCH-002, K-REGISTRY-006, K-VM-003, K-TVMRT-024, K-IREE-025, K-AOT-004, K-AOTI-022, K-AOTIRT-023: correctly draw the compile-vs-run split.
- K-TRT-019, K-TRTBUILD-021, K-TRTPLAN-020: correctly separate offline build cost from per-inference runtime; explicitly tests the "8 min = per-call" misdiagnosis trap.

### Profiler / analytical performance claims (L module)
- **All 30 L questions have `evidenceType != "measured"`** (either `analytical` or no perf claim). Zero MEASURED_WITHOUT_GPU violations.
- Hypothetical profileData (1000 kernels × 20 µs = 20 ms; 26 GB @ 2 TB/s ≈ 13 ms; per-token KV 128 KB @ 46 GB → 376K tokens; expected roofline 128 MB / 2 TB/s ≈ 64 µs; etc.) all check internally consistent with the analytical models invoked.
- No conflation of kernel-level and end-to-end speedup (L-E2E-020 explicitly tests this misconception via Amdahl's law).
- No fabricated benchmark numbers.

## Systemic issue: explanation_label_mismatch (post-shuffle drift)

13 of the 16 non-PASS items are this single MINOR pattern. It arose because the shuffle pass (commit 082f09f) re-labeled option letters in `options[]` and `correctAnswers[]` but did not rewrite the letter-references inside the `explanation` prose. Example (I-ATTBACK-025):

```text
explanation: "A is correct: naive backward keeps ... C is correct: FlashAttention's backward recomputes ..."
options: A = FlashAttention avoids storing P (correct)
         B = extra recomputation makes FLOPs strictly larger (correct)
         C = naive backward stores P (correct)
         D = no way to avoid materializing P (wrong)
correctAnswers: [A, B, C]
```

The prose still calls the correctness verdict on the pre-shuffle labels. **Correctness of the answer key is not affected** — the `correctAnswers` array is authoritative. Only the readability of the explanation for human reviewers/learners is degraded.

**Suggested repair path**: a script pass that walks each question, extracts the letter→text mapping, and rewrites the explanation prose to use post-shuffle letters. Also update `optionExplanations` dict keys. This is a one-shot cleanup — not per-module repair.

Affected questions (13):
- I-ATTBACK-025, I-EPILOGUE-024, I-FLASHPROP-026, I-FUSEDPROP-030, I-KVDF-029, I-MOEPROP-028, I-RMSPROP-027, I-SPARSE-022
- J-DISAG-029, J-FAIRTHR-030, J-OOM-028, J-PAGEDDES-024, J-SPECPROP-023, J-TVL-027

## Non-shuffle-related repair candidates

Only 4 questions have substantive (not shuffle-related) issues:

1. **I-SPARSE-022** — MAJOR — Uniqueness dispute on option C. Recommend either updating correctAnswers to {B, C, D} (accept 2:4 speedup as a real claim) or tightening C to make it obviously wrong (e.g., remove the "on supported dtypes" clause).
2. **L-ROOFLINE-021** — MINOR — Arithmetic wording in the correct option D. Recommend changing "0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)" to "0.25 FLOP/byte (2 FLOPs / 8 bytes per element = 4 read + 4 write)". Roofline conclusion is unaffected.
3. **L-DYNREG-013** — MINOR — Uniqueness dispute on option B. Recommend tightening B to a specific state-claim ("cache is currently thrashing" — obviously wrong under the data) rather than a conditional ("workloads with more shapes WOULD trigger churn").
4. **L-DETERM-017** — MINOR — Uniqueness dispute on option A. Recommend replacing the CUDA_VISIBLE_DEVICES example with a clearer multi-GPU allocation example (making A cleanly correct → update official to {A, B, D}) OR sharpening to be obviously wrong.

## Repair recommendation

**No repair required before Round 2 Verification.** Every one of the 120 questions has:
- Answer key that a competent independent reviewer either agrees with or has only MINOR uniqueness disputes (never a wrong-answer BLOCKER).
- Tier 1 or Tier 2 source support.
- Correct hardware-context declaration.
- Correct version-scope declaration (`stable_principle` vs `version_sensitive` with `frameworkVersionScope` + `verifiedAt`).
- No `measured` performance claim without GPU verification.
- No kernel-vs-end-to-end speedup conflation.

The 4 substantive items above can be addressed in a batched Repair phase; the 13 post-shuffle explanation-label mismatches should be cleaned by a script pass. Neither blocks Round 2.

## Recommendation for Round 2

- **Module K**: Promote all 30 questions directly. Zero issues.
- **Module J**: Promote all 30 after 6 explanation_label_mismatch cleanups (MINOR).
- **Module L**: Promote 27 PASS directly; L-DYNREG-013, L-DETERM-017, L-ROOFLINE-021 need minor option-text tightening before Verification — but their answer keys are correct.
- **Module I**: Promote 22 PASS + 7 MINOR (post-cleanup) directly; **I-SPARSE-022 needs decision (accept C or tighten C)** before Verification.

**Overall: batch3 is READY FOR ROUND 2** with the caveat that I-SPARSE-022 needs a Repair-side decision. No blocking safety issues.
