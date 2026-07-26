# Module J — Primary Review (Round 1)

- Reviewer: primary-review-3
- Reviewed at: 2026-07-27
- Total questions: 30
- Answer agreement rate: 30/30 (100%)
- PASS: 24, MINOR: 6, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0 (all `version_sensitive` questions have `frameworkVersionScope` + `verifiedAt`)
- Hardware conditions sufficient: 30/30

## Summary

Module J ("LLM inference optimization and generation systems") is the cleanest of the four modules in this batch. All 30 independent answers agree with the official key. The domain covers TTFT/TPOT metrics, prefill/decode boundary, continuous batching, chunked prefill, PagedAttention, KV cache capacity and OOM, disaggregation, TP/PP/EP, speculative decoding, fusion, prefix caching, scheduler preemption/swap, long-context, multi-tenancy fairness, and throughput-latency trade-off.

Most importantly, the questions correctly distinguish **stable architectural principles** (prefill compute-bound, decode BW-bound, TP requires AllReduce, PagedAttention design) from **version-sensitive claims** about specific stacks (vLLM 0.4+ for chunked prefill and prefix caching; TRT-LLM 0.9+; TVM Unity 2024; PyTorch 2.3~2.5 for AOTInductor). Every `version_sensitive` question carries `frameworkVersionScope` and `verifiedAt`.

**No BLOCKER, no MAJOR.** The only issues are 6 `explanation_label_mismatch` MINOR — a systematic post-shuffle artifact where the explanation prose still uses pre-shuffle letter references while the shuffled `correctAnswers` array is different letters. The `correctAnswers` array is the source of truth and is internally consistent; the drift is only in human-readable explanation prose.

## vLLM / SGLang / TRT-LLM version-sensitive coverage

| Question | Framework scope | verifiedAt | Verdict |
|----------|-----------------|------------|---------|
| J-CHUNKPRE-008 | vLLM 0.4+, SGLang, TRT-LLM 0.9+ | 2026-07-26 | Correctly scoped |
| J-DISAGG-019 | current research/production stacks | 2026-07-26 | Correctly scoped (generic disagg) |
| J-DISAG-029 | current research/production stacks | 2026-07-26 | Correctly scoped |
| J-FAIRTHR-030 | vLLM / SGLang / TRT-LLM current stable | 2026-07-26 | Correctly scoped |
| J-FUSION-016 | vLLM / TRT-LLM / SGLang current stable | 2026-07-26 | Correctly scoped |
| J-OOM-028 | vLLM 0.4+ | 2026-07-26 | Correctly scoped |
| J-PAGEDATT-020 | vLLM 0.2+ (PagedAttention) | 2026-07-26 | Correctly scoped |
| J-PAGEDDES-024 | vLLM 0.2+ (PagedAttention) | 2026-07-26 | Correctly scoped |
| J-PREFIX-009 | vLLM 0.4+, SGLang, TRT-LLM 0.9+ | 2026-07-26 | Correctly scoped |
| J-SCHED-017 | vLLM / SGLang / TRT-LLM current stable | 2026-07-26 | Correctly scoped |

Questions that are cleanly stable-principle-only (no scope needed): J-CBATCH-004, J-CBPROP-022, J-CUDAGRAPH-015, J-DECDIAG-026, J-DIAG-021, J-DYNBATCH-005, J-EP-014, J-FRAG-018, J-KVCAP-007, J-LONGCTX-025, J-PAGED-006 (the abstraction, not the specific kernel), J-PDCOMP-001, J-PP-013, J-SPECAR-011, J-SPECDEC-010, J-SPECPROP-023, J-TP-012, J-TPOT-003, J-TTFT-002, J-TVL-027. All correctly declared as `stable_principle`.

The separation between "PagedAttention abstraction is a stable architectural principle" (J-PAGED-006) and "the specific vLLM 0.2+ kernel implementation" (J-PAGEDATT-020, J-PAGEDDES-024) is exactly right. Same for prefix caching (concept stable, implementation version-sensitive) and fusion sets (which fuse-groups are typical evolves across releases → version_sensitive).

## Highlights

- **PagedAttention family (J-PAGED-006, J-PAGEDATT-020, J-PAGEDDES-024)**: correctly attributes fixed-size blocks + block table, block sharing for prefix caching / beam-search, FA-compatibility with per-block table lookup, internal waste ≤ block_size-1.
- **Speculative decoding (J-SPECDEC-010, J-SPECAR-011, J-SPECPROP-023)**: canonical Leviathan-et-al rejection sampling, exact distribution guarantee; the SPECAR-011 computation (2x speedup with k=5, p=0.7, 2:10 draft:target cost) is correctly arithmetic; SPECPROP-023 avoids the "always k+1 speedup" overclaim and correctly restricts benefit to batch-1 memory-bound regime.
- **Prefill/decode boundary (J-PDCOMP-001, J-TTFT-002, J-TPOT-003, J-TVL-027)**: correctly identifies prefill compute-bound (AI scales with P), decode memory-BW bound (batch-1 GEMV ~1 flop/byte), and the batching→compute-bound transition with diminishing throughput returns.
- **KV cache (J-KVCAP-007, J-FRAG-018, J-OOM-028, J-LONGCTX-025)**: KVCAP-007 arithmetic is exact (2*32*8*128*2 = 128 KB/token; 46 GB / 131072 = 376K tokens); FRAG-018 correctly distinguishes internal waste (reservation-up-to-max) from external fragmentation; OOM-028's key trap — "PP replicates KV" — is correctly marked wrong (PP shards LAYERS, not replicates KV).
- **Disaggregation (J-DISAGG-019, J-DISAG-029)**: correctly captures DistServe/SplitWise motivation (compute-bound prefill + BW-bound decode in separate pools with KV transfer floor); avoids overclaims (D-does-not-eliminate-KV, KV-transfer-adds-TTFT-floor).
- **CUDA Graphs (J-CUDAGRAPH-015)**: correctly identifies launch-overhead amortization; explicitly refutes the "graphs fuse kernels" and "decode is memory-bound so graphs don't help" misconceptions.
- **Continuous batching (J-CBATCH-004, J-CBPROP-022, J-DYNBATCH-005)**: correctly captures iteration-level batching (Orca), HoL blocking removal, aggregate-throughput vs per-request-TPOT trade-off.
- **TP/PP/EP (J-TP-012, J-PP-013, J-EP-014)**: canonical Megatron-LM column-then-row TP with single AllReduce, PP as layer-partition with per-request-latency unchanged, EP as all-to-all expert routing.

## Explanation label mismatches (MINOR — post-shuffle drift)

- J-DISAG-029, J-FAIRTHR-030, J-OOM-028, J-PAGEDDES-024, J-SPECPROP-023, J-TVL-027

Same pattern as module I: the `explanation` prose was written with pre-shuffle letter labels and the automated shuffle updated the option letters but not the explanation label references. The `correctAnswers` array remains authoritative and self-consistent.

## Profile-data / performance-diagnosis questions

- J-DECDIAG-026: Llama-13B at 26 GB weight read × 2 TB/s ≈ 13 ms; 22% SM util = memory-bound symptom. Mitigations (batching, CUDA Graph for launch gap, INT4 weight-only for 4x BW reduction) are consistent with the profile. Distractor B ("add TC math kernels — SM util from 22% to 100%") correctly represents the classical misdiagnosis.
- J-DIAG-021: Correctly separates prefill-compute-bound (92% util) from decode-BW-bound (25% util), and correctly links KV pressure (85%) + preemption (12%) to KV-quantization / MQA/GQA / shorter contexts.
- J-DYNBATCH-005: 800-token max in a batch of 8 → 13% util for tokens 41-800 (canonical HoL). Fix is continuous batching, not KV quant or spec decode.
- J-KVCAP-007: Arithmetic per-token KV = 128 KB, 46 GB / 128 KB ≈ 376K tokens. At 2000 tok/seq → 188 concurrent; at 32K → 11. Correctly computed.
- J-SPECAR-011: The problem statement explicitly walks through the arithmetic (2.94 accepted + 1 = 3.94 tokens per 20 ms = 0.20 tok/ms vs baseline 0.10 tok/ms → 2x speedup). Correctly bounded by draft/target cost ratio.
- J-OOM-028: The correct rejection of "PP replicates KV" is a valuable trap that any careful reviewer will notice.
- J-FAIRTHR-030: correctly rejects "serialize tenants" as it collapses throughput.

## LLM inference systems specific-vs-stable check

The batch avoids the common failure mode of "assert a specific version's implementation detail as a permanent principle". Examples of good scoping:
- **PagedAttention block size** is described as "e.g., 16 tokens" (illustrative), not "16 tokens exactly".
- **Chunked prefill chunk size** is "typically 512-2048 tokens" (illustrative).
- **Autoregressive vs speculative decoding** correctness is proven, not "usually correct".
- **CUDA Graph limitation** is correctly stated as "shape/memory layout must match" — a stable CUDA property, not a version-dependent quirk.

No question conflates a paper wall-clock number with an unqualified end-to-end speedup.

## Recommendation

Module J does not require repair before Round 2. Consider a small post-shuffle cleanup pass to fix the 6 explanation-label mismatches (MINOR) — after which the module is a clean PASS.

## Top 3 most severe

1. **J-DISAG-029** — MINOR — explanation_label_mismatch (post-shuffle drift).
2. **J-FAIRTHR-030** — MINOR — explanation_label_mismatch.
3. **J-OOM-028** — MINOR — explanation_label_mismatch.

(All other 27 questions PASS. No BLOCKER, no MAJOR.)
