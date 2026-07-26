# Module I — Primary Review (Round 1)

- Reviewer: primary-review-3
- Reviewed at: 2026-07-27
- Total questions: 30
- Answer agreement rate: 28/30 (93.3%)
- PASS: 22, MINOR: 7, MAJOR: 1, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0
- Hardware conditions sufficient: 30/30

## Summary

Module I ("core ops attention") covers GEMM/GEMV, softmax, RMSNorm/LayerNorm, RoPE, MHA/MQA/GQA, FlashAttention (v1/v2), online softmax, KV cache dataflow, MoE routing/properties, grouped GEMM, sparse/2:4 sparsity, sampling and top-k. Answers are grounded in Tier 1 sources (PMPP4, FlashAttention paper, Llama papers, MoE literature). All 30 questions have hardware context declared, and all questions are correctly marked as `stable_principle`.

The **only substantive quality issue** is I-SPARSE-022 where the "structured 2:4 sparsity" distractor (option C) is factually correct as stated — the option itself qualifies "on supported dtypes" — which is exactly the caveat the official explanation says is missing. This makes the answer key disputable.

The **systemic pattern** is `explanation_label_mismatch` on 7 multiple-choice questions where the explanation prose still uses pre-shuffle letter labels (e.g., "A is correct..." while correctAnswers={B,C}). All MINOR — the correctAnswers arrays are the source of truth and remain consistent; only the label-references in the human-readable explanation are drifted.

## Answer disagreements

### I-ATTBACK-025: MINOR
- Independent: [A, C]
- Official: [A, B, C]
- I marginally missed B ("extra recomputation makes FLOPs strictly larger; speedup ENTIRELY from HBM reduction dominating extra compute"). Under FlashAttention's I/O-aware framing this is a defensible correct statement; the word "entirely" is arguable but the intent matches Dao et al. Not a BLOCKER — official is defensible.

### I-SPARSE-022: MAJOR (uniqueness dispute)
- Independent: [B, C, D]
- Official: [B, D]
- Option C: "Structured 2:4 sparsity (Ampere) preserves tensor-core throughput at half the FLOP cost of the equivalent dense GEMM; it is a hardware-native format supported by cuSPARSELt / cuBLAS sparse APIs and yields real speedup on supported dtypes."
- This is factually correct — 2:4 is a real Ampere feature with cuSPARSELt / cuBLAS support (FP16, BF16, INT8), and the option scopes "on supported dtypes". The official explanation rejects it as "oversells 'yields real speedup' without conditions", but the option's own text supplies the condition. The answer uniqueness is disputable.
- Repair suggestion: either accept C into the correct set → {B, C, D}, or tighten option C to make it cleanly wrong (e.g., "…yields real speedup on any dtype and any density" — an obvious overclaim).

## Explanation label mismatches (MINOR — post-shuffle drift)

- I-ATTBACK-025, I-EPILOGUE-024, I-FLASHPROP-026, I-FUSEDPROP-030, I-KVDF-029, I-MOEPROP-028, I-RMSPROP-027, I-SPARSE-022

In each case, the `explanation` prose still uses pre-shuffle letter references (e.g., "A is correct, B is wrong") while the shuffled `correctAnswers` array uses different letters. The correctAnswers array is the source of truth (options are re-labeled in place); the mismatch only affects human readability of the explanation. Suggested repair: post-shuffle pass that rewrites the explanation label references to match the new positions.

## Highlights

- FlashAttention family (I-FLASH-005, I-FLASHIO-006, I-FLASHPROP-026, I-ATTBACK-025) is well-grounded. HBM I/O analysis O(N²d/M), backward recompute from (m,l) statistics, exact-attention property, forward FLOP unchanged — all standard results, correctly stated.
- MHA/MQA/GQA family (I-MHAMQA-007, I-GQA-008) correctly distinguishes KV footprint (which shrinks with H_kv) from attention compute FLOPs (which stay ~H*N²*d because Q heads are unchanged). The GQA correctness (uptraining vs full retrain, canonical H/8 or H/4 groups) is well-captured.
- KV cache dataflow (I-KVCACHE-009, I-KVDF-029) accurately distinguishes prefill (write once + causal reads) from decode (1 write + full cache read per step).
- MoE (I-MOEROUT-020, I-MOEPROP-028) correctly captures top-k routing, param-flop leverage, and imbalance.
- Online softmax (I-ONLINESM-004) reproduces the canonical Milakov-Gimelshein rescale-both-partials rule exactly.
- Grouped GEMM (I-GGEMM-021) correctly describes CUTLASS grouped-GEMM design for MoE variable-length expert batches.
- SwiGLU (I-SWIGLU-013) correctly identifies the 3-linear structure and the 2/3 F practice.
- FFT (I-FFT-023) — Cooley-Tukey O(N log N), memory-BW bound at large N, convolution theorem — all correct without over-generalization.

## Attention/FlashAttention correctness

All 6 attention-related questions (FLASH, FLASHIO, FLASHPROP, ATTBACK, ONLINESM, MHAMQA) have correct kernel dataflow and memory footprint descriptions. No conflation of kernel-level and end-to-end speedup. No fabricated performance numbers. FlashAttention statements are properly scoped as "stable algorithm-level" claims, not "3-4x uniformly" (which is explicitly used as an overclaim distractor in FLASHPROP-026, correctly marked wrong).

## Kernel dataflow / memory footprint checks

- FUSEDQKV-010: numerical equivalence, single kernel launch, one HBM read of x — correct.
- FUSEDMLP-014: standard practice = fuse up+activation, keep down as separate GEMM — correct.
- FUSEDPROP-030: fusion doesn't always help, can inflate registers, reduction-boundary fusion needs restructure — all correct.
- EPILOGUE-024: bias+activation fuse as epilogue; RMSNorm reduction crosses CTAs unless full-row tile — correct.
- REDUCE-015: warp-shuffle + shared memory is the canonical modern pattern — correct.
- KVDF-029: MQA/GQA KV tile shared across query heads in SMEM — correct.

## Sources

All 30 questions cite Tier 1 sources (PAPER:flashattn, PAPER:transformer, PAPER:gqa, PAPER:moe, BOOK:pmpp4, DOC:cutlass, DOC:cuda-best, etc.). No Tier 3 unique-support cases.

## Recommendation

Module I does not require repair before Round 2. The one MAJOR (I-SPARSE-022) should be surfaced to Repair Agent to either (a) update correctAnswers to {B,C,D} or (b) tighten option C to be cleanly wrong. Consider a small post-shuffle cleanup pass to align explanation letter-references with shuffled positions (7 items) — MINOR/PASS-eligible after cleanup.

## Top 3 most severe

1. **I-SPARSE-022** — MAJOR — Option C is factually correct as scoped; answer uniqueness dispute.
2. **I-ATTBACK-025** — MINOR — Explanation label drift + I missed B on independent answer (defensible official).
3. **I-EPILOGUE-024 / I-FLASHPROP-026 / I-FUSEDPROP-030 / I-KVDF-029 / I-MOEPROP-028 / I-RMSPROP-027** — MINOR — Same explanation_label_mismatch pattern (post-shuffle prose drift).
