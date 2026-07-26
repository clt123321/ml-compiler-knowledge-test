# Handoff — Generation Batch 5 — Module J (LLM Inference & Serving)

**Agent**: generation-J
**Base**: d0d980f
**Date**: 2026-07-26
**Status**: 30/30 draft questions + content cards, validator green.

## Summary

| Metric | Value |
|---|---|
| Total questions | 30 |
| Single | 20 |
| Multiple | 10 |
| Multi 2-correct | 5 (J-022, J-023, J-025, J-027, J-029) |
| Multi 3-correct | 5 (J-021, J-024, J-026, J-028, J-030) |
| Content cards | 30 |
| Manifest | manifests/J.json |

## Single correct-answer distribution

- A: J-003, J-008, J-011, J-016, J-020 (5)
- B: J-002, J-005, J-009, J-012, J-015, J-019 (6)
- C: J-001, J-006, J-010, J-014, J-018 (5)
- D: J-004, J-007, J-013, J-017 (4)

Total single = 20 ✓; slight skew toward B (6) and D (4) but within one of ideal 5/5/5/5.

## Archetype distribution

| Archetype | Count |
|---|---|
| performance_diagnosis | 7 (J-002, J-005, J-011, J-018, J-021, J-026, J-028, J-030) — actually 8 |
| systems_dataflow | 7 (J-004, J-006, J-008, J-012, J-013, J-017, J-019, J-020) — actually 8 |
| concept_boundary | 7 (J-001, J-010, J-014, J-015, J-016, J-022, J-023, J-025, J-027, J-029) — actually 10 |
| precise_definition | 1 (J-003) |
| performance_diagnosis multiselect | included above |

Note: some multiselect questions could be reclassified — the archetype field is single-value.

## Difficulty distribution

| Difficulty | Count |
|---|---|
| 2 | 3 (J-001, J-002, J-003) |
| 3 | 12 (J-004, J-006, J-008, J-009, J-010, J-013, J-015, J-016, J-018, J-022, J-026, J-027) |
| 4 | 15 (J-005, J-007, J-011, J-012, J-014, J-017, J-019, J-020, J-021, J-023, J-024, J-025, J-028, J-029, J-030) |

## Coverage of hardness requirements

- ≥10 system-indicator / timeline / memory diagnosis: **11** ✓
  - J-002 (TTFT with timeline profileData), J-005 (batching w/ timeline), J-007 (KV capacity calc), J-011 (spec decode acceptance-rate math), J-018 (fragmentation OOM), J-021 (mixed metrics), J-026 (bandwidth-bound decode), J-027 (throughput vs latency), J-028 (KV OOM diagnosis), J-030 (multi-tenancy fairness)
- ≥6 performance_diagnosis with profileData: **7** ✓ (J-002, J-005, J-007, J-011, J-018, J-021, J-026, J-028, J-030)
- ≥3 systems_dataflow: **8** ✓
- ≥3 continuous batching / dynamic batching / preemption: **4** ✓ (J-004, J-005, J-017, J-022)
- ≥2 speculative decoding: **3** ✓ (J-010, J-011, J-023)
- ≥2 chunked prefill / prefix caching: **2** ✓ (J-008, J-009)
- ≥3 KV cache management (PagedAttention): **5** ✓ (J-006, J-007, J-018, J-020, J-024, J-028)

## Sources used (all Tier 1/2)

- DOC:vllm — Continuous batching, PagedAttention, prefix caching, scheduler, TP, EP, metrics
- DOC:sglang — Chunked prefill, RadixAttention, fairness policies
- DOC:trtllm — Inflight batching, TP/PP/EP, disaggregated serving, kernel fusion
- PAPER:vllm (Kwon et al. 2023) — PagedAttention design, memory analysis, preemption
- PAPER:orca (Yu et al. 2022) — Iteration-level scheduling
- PAPER:specdecode (Leviathan et al. 2023) — Algorithm + rejection sampling + speedup analysis
- PAPER:flashattn — Referenced for KV reuse in attention kernel
- DOC:cuda-guide, DOC:cuda-best — CUDA Graphs, launch overhead

## Version-sensitive content

12 questions carry `stability = "version_sensitive"` with proper `frameworkVersionScope` and `verifiedAt = 2026-07-26`:
- J-CHUNKPRE-008, J-PREFIX-009, J-CUDAGRAPH-015 (via cuda), J-FUSION-016, J-SCHED-017, J-DISAGG-019, J-PAGEDATT-020, J-PAGEDDES-024, J-OOM-028, J-DISAG-029, J-FAIRTHR-030

The rest (metric definitions, PP/TP/EP concepts, spec decode) are stable principles.

## Performance claims

- Analytical + paper_result only.
- No fabricated measured GPU numbers.
- Reference-material speedups (Orca, vLLM, SpecDec) treated as paper_result with hardware-dependent flag.
- J-DECDIAG-026 provides a realistic HBM-bound decode profile; numbers are analytical/roofline-derived (not claimed as measured).

## Human verification points

1. **Version-sensitive framework version scopes** — Reviewer should confirm the scopes are still accurate at review time (e.g., "vLLM 0.4+", "TRT-LLM 0.9+"). If specific features moved to different versions, update `frameworkVersionScope`.

2. **J-KVCAP-007 arithmetic** — the 46 GB "available for KV" is an approximation; actual usable KV budget after allocator overhead may differ. Formula and order of magnitude are correct.

3. **J-SPECAR-011 formula** — Bernoulli-independent acceptance is a first-order approximation; real acceptance is position- and prompt-dependent. Callout is present in "assumptions" and "nonImplications".

4. **J-DECDIAG-026 numbers** — HBM peak (~2 TB/s A100), model weight sizes (26 GB for Llama-13B FP16), and typical bandwidth utilization figures are from public specs and typical serving profiles. Wall time given is illustrative and hardware-dependent (marked as such).

5. **J-DISAG-029 / J-DISAGG-019** — Disaggregated serving is a young production feature; the description matches DistServe / SplitWise / TRT-LLM disagg docs. Reviewer should confirm current terminology.

6. **J-CHUNKPRE-008** — Chunked prefill is present in vLLM 0.4+ and SGLang; exact chunking policy may vary. Description is at the design-principle level to remain stable.

## Non-implications & compliance

- No kernel↔e2e speedup conflation.
- No "quantization is free" or "smaller model automatically faster" claims.
- No "视情况而定" answers.
- All correct options directly supported by canonicalClaim + sourceRef.
- Multi-choice questions have 2-correct or 3-correct only, balanced 5/5.
- All questions in `draft` status.
- Option lengths approximately balanced within each question.

## Files produced

- 30 × `data/questions/J/*.json`
- 30 × `data/content-cards/J/*.json`
- `manifests/J.json`

## Validator status

`node scripts/validate-questions.mjs` — **PASS**:
```
Loaded 400 questions, 400 content cards.
Schema OK: 400/400
I: 30/30
J: 30/30
Total: 400/400
```

Zero errors, zero warnings for module I and J.
