# Batch 3 Primary Review — Handoff to Main Controller

- Agent: primary-review-3 (Primary Reviewer 3, independent subagent)
- Handoff date: 2026-07-27
- Modules covered: I (core ops attention), J (LLM inference), K (runtime/deploy), L (profiling/debug/correctness)
- Total questions reviewed: 120
- Blind stage completed first: `reviews/round1/{I,J,K,L}-independent.json`
- Compare stage completed: `reviews/round1/{I,J,K,L}-review.json` + `{I,J,K,L}-review.md`
- Batch summary: `reviews/round1/batch3-summary.md`

## Files written (authorized scope)

- `reviews/round1/I-independent.json`
- `reviews/round1/J-independent.json`
- `reviews/round1/K-independent.json`
- `reviews/round1/L-independent.json` (5 canary + 25 new)
- `reviews/round1/I-review.json` (30 items)
- `reviews/round1/I-review.md`
- `reviews/round1/J-review.json` (30 items)
- `reviews/round1/J-review.md`
- `reviews/round1/K-review.json` (30 items)
- `reviews/round1/K-review.md`
- `reviews/round1/L-review.json` (30 items — canary preserved with primary-review-canary reviewer)
- `reviews/round1/L-review.md`
- `reviews/round1/batch3-summary.md`
- `handoffs/review/batch3.md` (this file)

**No writes to** `data/**`, `schemas/**`, `config/**`, `docs/**`, `references/**`, or any other module (A-H, M, N).

## Result summary

| Module | Total | Agree | PASS | MINOR | MAJOR | BLOCKER | Verdict |
|--------|-------|-------|------|-------|-------|---------|---------|
| I | 30 | 28 (93%) | 22 | 7 | 1 | 0 | Ready for R2 with 1 substantive fix |
| J | 30 | 30 (100%) | 24 | 6 | 0 | 0 | Ready for R2, post-shuffle cleanup |
| K | 30 | 30 (100%) | 30 | 0 | 0 | 0 | Ready for R2 as-is |
| L | 30 | 28 (93%) | 27 | 3 | 0 | 0 | Ready for R2 with 3 minor fixes |
| **Total** | **120** | **116 (96.7%)** | **103** | **16** | **1** | **0** | **Ready for R2** |

## Substantive repair candidates (4 items)

1. **I-SPARSE-022** (MAJOR — uniqueness dispute) — Option C on structured 2:4 sparsity is factually correct as scoped. Decision required: (a) accept C into correctAnswers → {B, C, D}, or (b) tighten C to be cleanly wrong.
2. **L-ROOFLINE-021** (MINOR — arithmetic wording) — Correct option D says "0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)". True AI is 2 FLOPs / 8 bytes = 0.25 FLOP/byte. Roofline conclusion unaffected. Recommended: fix option text.
3. **L-DYNREG-013** (MINOR — uniqueness dispute) — Option B's conditional statement is arguably correct as a general principle. Recommend: tighten B to make it obviously wrong.
4. **L-DETERM-017** (MINOR — uniqueness dispute) — Option A's CUDA_VISIBLE_DEVICES example is imprecise. Recommend: replace with clearer multi-GPU example (making A cleanly correct → update official to {A, B, D}).

## Systemic post-shuffle cleanup (13 items)

The shuffle repair (commit 082f09f) re-labeled options and correctAnswers but did NOT rewrite the letter-references inside `explanation` prose. `correctAnswers[]` remains authoritative and self-consistent; only the explanation readability is degraded.

Affected questions (all MINOR `explanation_label_mismatch`):
- **Module I (8)**: I-ATTBACK-025, I-EPILOGUE-024, I-FLASHPROP-026, I-FUSEDPROP-030, I-KVDF-029, I-MOEPROP-028, I-RMSPROP-027, I-SPARSE-022
- **Module J (6)**: J-DISAG-029, J-FAIRTHR-030, J-OOM-028, J-PAGEDDES-024, J-SPECPROP-023, J-TVL-027

Suggest a one-shot script pass to rewrite explanation prose using post-shuffle letter positions and update `optionExplanations` dict keys.

## Focus-area findings (per task brief)

### vLLM / SGLang / TRT-LLM version scoping (J module)
- All 10 J questions that reference specific serving-stack behavior are correctly `version_sensitive` with `frameworkVersionScope` + `verifiedAt: 2026-07-26`.
- The stability-boundary is drawn correctly: architectural principles (prefill/decode boundary, TP AllReduce, PagedAttention abstraction, spec-dec correctness) → `stable_principle`; specific implementations (vLLM 0.4+ chunked prefill, vLLM 0.2+ PagedAttention kernel, TRT-LLM 0.9+ prefix caching, current-stable schedulers) → `version_sensitive`.
- **No version-scope violations.**

### FlashAttention / attention correctness (I module)
- 6 attention questions (FLASH, FLASHIO, FLASHPROP, ATTBACK, ONLINESM, MHAMQA) all have correct kernel dataflow and memory footprint. Backward recompute from (m,l), online softmax two-partial rescale, HBM I/O O(N²d/M), MQA/GQA KV footprint proportional to H_kv (not to attention compute FLOPs).
- **No kernel-vs-e2e conflation.** I-FLASHPROP-026 correctly rejects the "uniform 3-4x speedup" overclaim as a distractor.
- **No fabricated benchmarks.** Only algorithmic properties and analytical results.

### ONNX / Runtime boundary (K module)
- 4 ONNX-format questions correctly separate format-vs-runtime (K-ONNX-014), shape inference role (K-ONNXSHAPE-016), IR-version vs opset-version (K-ONNXVER-017), and opset compatibility contract (K-OPSET-015).
- 3 AOT-artifact questions correctly separate compile-time from run-time (K-AOT-004, K-AOTI-022, K-AOTIRT-023) — AOTInductor artifact does NOT require Inductor at runtime; K-AOTIRT-023 correctly rejects the "requires full PyTorch binary distribution" overclaim.
- 3 TensorRT questions correctly separate builder from runtime (K-TRT-019), avoid the 8-min-build-vs-per-inference misdiagnosis (K-TRTBUILD-021), and enumerate real portability constraints (K-TRTPLAN-020).

### Profiler / analytical data (L module)
- **Zero `measured` performance claims** across 30 questions. All profileData is either `analytical` or has no perf claim. No BLOCKER on the measured-without-GPU gate.
- Hypothetical profile numbers are internally consistent with the analytical models invoked (Amdahl, roofline, HBM BW / latency, launch-overhead accounting).
- L-E2E-020 explicitly tests the "kernel speedup → e2e speedup" misconception via Amdahl arithmetic.

## Round 2 readiness

- **Module K**: Ready as-is. Suggest promotion of all 30 to `agent_reviewed` after Round 2 confirms.
- **Module J**: Ready after post-shuffle explanation cleanup (script). All 30 answer keys correct.
- **Module L**: Ready with 3 MINOR item fixes recommended (option-text tightening in L-DYNREG-013 / L-DETERM-017 / L-ROOFLINE-021). Answer keys correct.
- **Module I**: Ready after I-SPARSE-022 decision (MAJOR — either accept C or tighten C) + post-shuffle explanation cleanup. 29 answer keys correct.

**Overall: batch3 is safe for Round 2 verification.** No BLOCKER. One MAJOR is a uniqueness dispute where the option itself is not wrong. All other findings are MINOR (mostly explanation-prose drift).

## Notes on independence

- Stage A: Read only `reviews/blind/{I,J,K,L}.json`. Did NOT read `data/questions/**` or `data/content-cards/**` during Stage A.
- Stage B: Read `data/questions/{I,J,K,L}/*.json` for correctAnswers comparison; did NOT modify any question data.
- Independent answers written before comparing to official — 116/120 pre-match, 4 disagreements documented as MINOR/MAJOR with rationale (I-ATTBACK-025 B, I-SPARSE-022 C, L-DYNREG-013 B, L-DETERM-017 A).

## Suggested next action for main controller

1. Convene a Repair Agent (NOT the batch3 generator, NOT primary-review-3) to address 4 substantive items + 13 explanation cleanups.
2. Once Repair completes, run Round 2 Verification on the 120-item batch3.
3. Modules K, J (post-cleanup), L (post-3-fixes), I (post-SPARSE-022 decision + cleanup) can proceed to `agent_reviewed` promotion after Round 2 double-PASS.
