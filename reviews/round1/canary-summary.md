# Canary Primary Review — Summary

- Reviewer: primary-review-canary
- Reviewed at: 2026-07-26
- Round: Round 1 (Primary, independent blind review)
- Modules: A (arch_perf_model), C (graph_tensor_ir), D (pytorch_compiler), F (cuda_triton_kernel), L (profiling_debug)
- Method: Two-phase — (A) independent answering from the blind package with NO access to `data/questions/`, `data/content-cards/`, `explanation`, `optionExplanations`, `sourceRefs.supports`, or `correctAnswers`. Independent answers written to `reviews/round1/*-independent.json` first. (B) After all independent answers were finalized, official questions were read and compared.

## Cross-module tallies

| Module | Total | Agreement | PASS | MINOR | MAJOR | BLOCKER | Src Unsupported | Version Scope OK | HW Cond OK |
|--------|-------|-----------|------|-------|-------|---------|-----------------|------------------|------------|
| A      | 5     | 5/5       | 4    | 1     | 0     | 0       | 0               | 5/5              | 5/5        |
| C      | 5     | 5/5       | 4    | 1     | 0     | 0       | 0               | 5/5              | 5/5        |
| D      | 5     | 5/5       | 4    | 1     | 0     | 0       | 0               | 5/5              | 5/5        |
| F      | 5     | 5/5       | 4    | 1     | 0     | 0       | 0               | 5/5              | 5/5        |
| L      | 5     | 5/5       | 5    | 0     | 0     | 0       | 0               | 5/5              | 5/5        |
| **Total** | **25** | **25/25 (100%)** | **21** | **4** | **0** | **0** | **0** | **25/25** | **25/25** |

- Meta-statement / "视情况而定" options: **0** (across all 25 questions)
- Cross-question systematic template detected: **NO**
- Distractor weakness (too easy / trivially wrong): **0**
- Kernel-vs-end-to-end speedup conflation: **0**
- Fabricated benchmark numbers: **0** (all cited numbers derive from analytical formulas or realistic profile snapshots)
- Ambiguous / non-unique correct answer: **0**

## Canary gate check (per `config/review-policy.yaml.canary`)

| Gate | Threshold | Actual | Verdict |
|------|-----------|--------|---------|
| `blocker_max`                              | ≤ 0  | 0   | PASS |
| `major_max`                                | ≤ 3  | 0   | PASS |
| `independent_answer_disagreement_max`      | ≤ 2  | 0   | PASS |
| `unsupported_source_max`                   | ≤ 0  | 0   | PASS |
| `meta_statement_options_max`               | ≤ 0  | 0   | PASS |
| `pass_min`                                 | ≥ 15 | 21  | PASS |
| `systematic_template_across_questions`     | false | false | PASS |

**Canary verdict: PASS.** All seven gates cleared. The 25 canary questions are eligible to enter Round 2 verification.

## Findings by severity

### BLOCKER (0)
_None._

### MAJOR (0)
_None._

### MINOR (4)

1. **A-MEM-005 option D** — wording. "Delivering the value in one cycle to the whole warp" is a slight simplification of the CUDA Programming Guide's canonical phrasing "as fast as reading from a register" for constant-memory broadcast. Content is correct; consider softening the cycle-count precision in future revisions.

2. **C-LAYOUT-002** — source scope. Question uses PyTorch-specific terminology (`torch.channels_last`), but the two Tier 1 sources are compiler-general (BOOK:eac3, DOC:mlir-langref). The underlying stride-vs-physical-layout reasoning IS language-agnostic and correctly supported. Adding a Tier 1 PyTorch reference to `torch.Tensor.stride` / channels_last docs would tighten the source-to-claim mapping.

3. **D-DYNAMIC-002** — version boundary. The default of `torch._dynamo.config.automatic_dynamic_shapes` has evolved across PyTorch 2.3/2.4/2.5. The question guards against this via an explicit assumption ("no automatic dynamic promotion overrides"), which is sufficient. Consider naming the config flag + its verifiedAt default explicitly to strengthen version traceability for the full 400-question run.

4. **F-COALESCE-002 option D** — wording. "Each 128 B L1/L2 sector delivers only 4 useful bytes per lane" is a compressed phrasing. A more explicit form ("one 128 B sector serves 4 lanes → 8 sectors per warp → 1/8 peak") reads more clearly. Math and conclusion are correct.

None of the four MINORs affect answer correctness, source support, or hardware/version scoping. They are candidate polish items rather than blockers.

## Positive observations

- **100% answer agreement** between an independent reviewer (who solved the 25 questions without any access to answers, explanations, or sourceRefs) and the official answers. This is strong evidence that the canary questions are unambiguously solvable from the technical facts alone, not from stylistic cues.
- **All 25 correct options are supported by ≥ 1 Tier 1 source** (per `SOURCE_REGISTRY.json`); several also carry a Tier 2 corroborating source (papers). No question relies solely on Tier 3.
- **Every version-sensitive question** (PyTorch 2.3-2.5, Triton 2.2-3.0) carries `frameworkVersionScope` + `verifiedAt`, matching AGENTS.md §9.
- **Hardware contexts** are fully specified (architecture, features, bank width, sector size where relevant); no answer is undecidable due to missing HW conditions (AGENTS.md §10.4).
- **Distractors are strong across the board.** Each incorrect option probes a specific canonical misconception (e.g., compute-vs-memory ridge confusion, functionalization-vs-rejection, atomic_add-vs-atomic_exchange, mask-vs-implicit-bounds-check, ptr-alias-vs-type-equality for LICM, etc.). No option is trivially wrong; no option is a filler.
- **Absolute-language framing** in incorrect options (e.g., "always", "strictly", "guaranteed", "one cycle") is used to encode testable misconceptions, not as a style-leak signal. Corresponding correct options use appropriately conditioned language. This is a healthy authoring pattern.
- **No cross-question systematic template**: the 25 questions span formula computation, IR transformation, CUDA/Triton code reading, PyTorch compiler diagnostics, and profiler-log interpretation. No two questions share a template that could be defeated by pattern-matching.
- **No fabricated performance data**: all cited numbers are derived from analytical formulas (Roofline, occupancy math, Little's Law) or are internally consistent profile snapshots (Nsight Systems, Nsight Compute).
- **No end-to-end/kernel-level speedup conflation** (AGENTS.md §10.2).

## Handoff

- Round 1 outputs: `reviews/round1/{A,C,D,F,L}-independent.json`, `reviews/round1/{A,C,D,F,L}-review.json`, `reviews/round1/{A,C,D,F,L}-review.md`, this file (`reviews/round1/canary-summary.md`).
- Suggestions for generator: see `handoffs/review/canary.md`.
- **Recommendation to main controller: proceed to Round 2 (Verification) with all 25 canary questions.** MINORs can be addressed during Repair without blocking Round 2.
