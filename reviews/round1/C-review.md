# Module C — Primary Review (Round 1)

- Reviewer: primary-review-canary
- Reviewed at: 2026-07-26
- Total questions: 5
- Answer agreement rate: 5/5
- PASS: 4, MINOR: 1, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0
- Hardware conditions sufficient: 5/5 (module is generic; no hardware needed)

## Findings

### C-IRLEVEL-005: PASS
- Independent answer: [A, C, D]
- Official answer: [A, C, D]
- Notes: All three correct options describe canonical differences between operator-level IRs (HLO / ONNX / StableHLO) and loop-level IRs (linalg / affine / TensorIR). B correctly identifies the well-known misconception that fusion requires loop-level IR (XLA HLO fusion pass and TVM Relax operator fusion are counterexamples). Sources PAPER:mlir + PAPER:tvm + DOC:stablehlo (Tier 1 + Tier 2 combo, well-supported).

### C-LAYOUT-002: MINOR
- Independent answer: [A]
- Official answer: [A]
- Notes: Correct. The included `irSnippet` gives the explicit index formulas for NCHW vs channels_last, making the "not-a-pure-view" reasoning unambiguous. The distractors (B: metadata-only, C: same physical layout, D: reshape confusion) each probe a distinct misconception.
- MINOR: The question uses PyTorch-specific terminology (`torch.channels_last`) but sourceRefs are BOOK:eac3 and DOC:mlir-langref (both are compiler-general). The stride-vs-physical-layout reasoning IS language-agnostic and correctly supported by those sources; nonetheless, adding a Tier 1 PyTorch reference to `torch.Tensor.stride` / channels_last docs would tighten the source-to-claim mapping in the PyTorch framing.

### C-LICM-001: PASS
- Independent answer: [B]
- Official answer: [B]
- Notes: Alias analysis is the classical precondition for LICM safety in imperative IRs. Options A (trip-count constness), C (type equality), D (FP-only forbidden) all probe distinct misconceptions and are non-trivially wrong. Sources BOOK:eac3 and BOOK:dragon2 (Tier 1) directly cover LICM + alias analysis. The paired IR snippets (before/after) make the transformation concrete without prescribing a specific dialect.

### C-SHAPE-004: PASS
- Independent answer: [D]
- Official answer: [D]
- Notes: Shape specialization narrows domain in exchange for downstream optimization gains — canonical trade-off. Distractors A (subset/superset reversal), B (specialization is naming only), C (silent slow fallback) are all real student misconceptions. Sources DOC:tvm-relax + PAPER:pytorch2 (Tier 1 + Tier 2) directly discuss the trade-off.

### C-SSA-003: PASS
- Independent answer: [C]
- Official answer: [C]
- Notes: SSA violation is the canonical reason for functionalizing in-place ops. Distractor A (runtime speedup), B (not representable), D (CUDA context switch) probe three different misconceptions and are all non-trivially wrong. Sources BOOK:eac3 + BOOK:appel (Tier 1) + PAPER:pytorch2 (Tier 2) — solid mix. The paired IR snippets (mutating → functional) make the SSA distinction visible.

## Summary
Module C: 5/5 answer agreement, all sources Tier 1 or Tier 2 mix (both permitted for correct-answer support), no version-sensitivity concerns (all `stable_principle`), no hardware requirements, no meta-statement options. One MINOR source-scope note on C-LAYOUT-002 about adding a PyTorch-specific reference to strengthen the PyTorch phrasing. Passes canary gate for module C.
