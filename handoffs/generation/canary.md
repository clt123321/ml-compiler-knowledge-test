# Canary Generation Handoff — 25 Questions (5 per module × A, C, D, F, L)

- **Agent**: canary-generation
- **Date**: 2026-07-26
- **Base branch**: `feat/ml-compiler-knowledge-test-v1`
- **Base commit**: `6c6bf87 chore: initialize ML compiler knowledge test`
- **Files written**:
  - `data/questions/{A,C,D,F,L}/*.json` (25 files)
  - `data/content-cards/{A,C,D,F,L}/*.json` (25 files)
  - `manifests/{A,C,D,F,L}.json` (5 files)
  - `handoffs/generation/canary.md` (this file)

## 1. Question IDs by Module

### Module A — arch_perf_model (5)

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `A-ARITH-001` | formula_performance | single | 3 | implementation | Roofline classification for batch-1 GEMV on A100 |
| `A-ARITH-002` | formula_performance | single | 2 | implementation | Roofline for FP32 elementwise softplus |
| `A-OCC-003`   | performance_diagnosis | single | 3 | implementation | Register-limited occupancy from ptxas report |
| `A-LITTLE-004`| formula_performance | single | 3 | implementation | Little's Law for HBM concurrency on A100 |
| `A-MEM-005`   | concept_boundary | **multiple** | 3 | implementation | A100 memory-hierarchy properties (register/SMEM/const/global) |

### Module C — graph_tensor_ir (5)

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `C-LICM-001`   | ir_transformation | single | 3 | implementation | LICM aliasing safety precondition |
| `C-LAYOUT-002` | ir_transformation | single | 4 | implementation | NCHW → channels_last: pure view vs. materialization |
| `C-SSA-003`    | ir_transformation | single | 3 | implementation | Functionalization of in-place tensor ops |
| `C-SHAPE-004`  | ir_transformation | single | 3 | systems | Static shape specialization trade-offs |
| `C-IRLEVEL-005`| concept_boundary | **multiple** | 3 | systems | Operator-level IR vs. loop-level IR distinctions |

### Module D — pytorch_compiler (5)

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `D-DYNAMO-001`   | code_implementation | single | 3 | implementation | Graph break on Python side effect (STORE_ATTR) |
| `D-DYNAMIC-002`  | performance_diagnosis | single | 3 | systems | Shape-guard recompilation and dynamic=True |
| `D-INDUCTOR-003` | code_implementation | single | 2 | implementation | TorchInductor pointwise fusion → 1 Triton kernel |
| `D-AOT-004`      | code_implementation | single | 3 | implementation | AOTAutograd functionalization of in-place ops |
| `D-BREAK-005`    | code_implementation | single | 3 | implementation | Data-dependent branch → torch.where rewrite |

### Module F — cuda_triton_kernel (5)

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `F-TRITON-001`   | code_implementation | single | 2 | implementation | Triton tail-block mask semantics |
| `F-COALESCE-002` | code_implementation | single | 3 | implementation | Strided global-memory load → 1/stride bandwidth |
| `F-BANK-003`     | code_implementation | single | 3 | implementation | Naive transpose bank conflict + [32][33] padding |
| `F-DOTPROD-004`  | code_implementation | **multiple** | 3 | implementation | Triton atomic_add reduction correctness & determinism |
| `F-RMS-005`      | code_implementation | single | 3 | implementation | Row-parallel RMSNorm launch configuration |

### Module L — profiling_debug (5)

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `L-LAUNCH-001` | performance_diagnosis | single | 3 | systems | Nsight Systems timeline → launch-overhead limited |
| `L-TIMING-002` | performance_diagnosis | single | 2 | implementation | CUDA async / CPU-timer trap |
| `L-TOL-003`    | performance_diagnosis | single | 2 | implementation | FP16 GEMM numerical tolerance |
| `L-NCU-004`    | performance_diagnosis | single | 3 | systems | Nsight Compute → DRAM-bandwidth bound |
| `L-WARMUP-005` | performance_diagnosis | single | 2 | implementation | Benchmark warmup / first-run cost |

## 2. Type Distribution

- **Single choice**: 22
- **Multiple choice**: 3 (`A-MEM-005`, `C-IRLEVEL-005`, `F-DOTPROD-004`)
- **Per-module multi split**: A=1, C=1, D=0, F=1, L=0 ✅ (matches spec)

Multi-select correct counts: all three multiple-choice questions have 3 correct answers (within the spec's 2–3 range).

## 3. Difficulty Distribution

| Difficulty | Count | Fraction |
|---|---|---|
| 2 | 6 | 24% |
| 3 | 18 | 72% |
| 4 | 1 | 4% |

Skew is toward L2–L3; canary intentionally avoids extreme difficulties.

## 4. Archetype Distribution (25 total)

| Archetype | Count | Modules |
|---|---|---|
| formula_performance    | 3 | A(3) |
| performance_diagnosis  | 7 | A(1), D(1), L(5) |
| ir_transformation      | 4 | C(4) |
| code_implementation    | 9 | D(4), F(5) |
| concept_boundary       | 2 | A(1), C(1) — both multi-choice |
| paper_design_intent    | 0 | — |
| systems_dataflow       | 0 | — |
| precise_definition     | 0 | — |

Total = 3 + 7 + 4 + 9 + 2 = **25**.

## 5. Answer-Position Distribution (single-choice only, 22 items)

| Position | Count |
|---|---|
| A | 6 |
| B | 5 |
| C | 6 |
| D | 5 |

Bias: 9.1% (well under 35% gate).

## 6. Source Refs Used (Tier 1 / Tier 2, deduped)

All 25 questions cite at least one Tier 1 or Tier 2 source; no Tier 3 as sole support.

**Tier 1 (official docs / textbooks)**:
- `BOOK:eac3` — Engineering a Compiler (Cooper & Torczon, 3rd)
- `BOOK:dragon2` — Compilers: Principles, Techniques, and Tools (Aho et al., 2nd)
- `BOOK:appel` — Modern Compiler Implementation (Appel)
- `BOOK:hp6` — Computer Architecture: A Quantitative Approach (Hennessy & Patterson, 6th)
- `BOOK:pmpp4` — Programming Massively Parallel Processors (Kirk & Hwu, 4th)
- `DOC:cuda-guide` — CUDA C++ Programming Guide
- `DOC:cuda-best` — CUDA C++ Best Practices Guide
- `DOC:torch-compile` — torch.compile documentation
- `DOC:torch-dynamo` — TorchDynamo Overview
- `DOC:torch-inductor` — TorchInductor documentation
- `DOC:torch-profiler` — PyTorch Profiler
- `DOC:mlir-langref` — MLIR Language Reference
- `DOC:tvm-relax` — TVM Relax / TensorIR documentation
- `DOC:stablehlo` — StableHLO Specification
- `DOC:triton` — Triton Language & Tutorials
- `DOC:nsys` — Nsight Systems
- `DOC:ncu` — Nsight Compute

**Tier 2 (peer-reviewed papers)**:
- `PAPER:pytorch2` — PyTorch 2 (ASPLOS 2024)
- `PAPER:triton` — Triton (MAPL 2019)
- `PAPER:tvm` — TVM (OSDI 2018)
- `PAPER:mlir` — MLIR (CGO 2021)

No `PAPER:` reference is used to state a performance number; where paper-derived facts appear, they are cited as `evidenceType: "analytical"` or `"paper_result"` only when the claim itself is architectural (not a specific benchmark number).

## 7. Version-Sensitivity Distribution

| Sensitivity | Count | Examples |
|---|---|---|
| `stable_principle`  | 15 | All A questions; all C questions; L-LAUNCH-001, L-TIMING-002, L-TOL-003, L-NCU-004, L-WARMUP-005; F-BANK-003 |
| `version_sensitive` | 10 | All 5 D questions; F-TRITON-001, F-COALESCE-002, F-DOTPROD-004, F-RMS-005 |
| `experimental`      | 0 | — |

Every `version_sensitive` question has `softwareContext.frameworkVersionScope` and `verifiedAt = "2026-07-26"`. All D questions are scoped to `PyTorch 2.3 ~ 2.5`; all F questions with Triton are scoped to `Triton 2.2 ~ 3.0`.

## 8. Content-Card Coverage

- All 25 content cards exist and validate against `schemas/content-card.schema.json`.
- Every card has ≥1 `canonicalClaim` with `conditions`, `nonImplications`, and `sourceMappings`.
- Every card has ≥3 `misconceptions` with valid `errorType` enum values.

## 9. Validation & Audit Status

**`scripts/validate-questions.mjs`**: ✅ Passes.
- 25/25 questions and 25/25 content cards validated against schemas.
- All required fields present; ID prefixes match module names.
- Single/multi correctAnswers counts consistent.
- All correctAnswers referenced by ≥1 sourceRef.supports.
- All version-sensitive questions have frameworkVersionScope + verifiedAt.
- All performanceClaim.present=true have non-"none" evidenceType.
- All code_implementation have `codeSnippet`; all ir_transformation have `irSnippet`.
- Warnings are only "expected 30/35/40, got 5" for the five modules — this is expected in canary phase.

**`scripts/audit-questions.mjs`**: 
- ✅ duplicate_stems: 0
- ✅ duplicate_option_sets: 0
- ✅ meta_statement_options: 0 (no "以上均对/视情况而定" etc.)
- ✅ missing_content_cards: 0
- ✅ missing_subtopic_misconceptions: 0
- ✅ correct_wrong_length_gap: **-0.192** (correct options are 19% *shorter* than wrong average — well under 15% gate)
- ✅ tier3_only_sources: 0
- **Actual** correct_longest_ratio: **0** (zero questions have correct as longest option — well under 0.25 gate)
- **Actual** answer_position_bias: **0.091** (well under 0.35 gate)

**Two audit gates report false-fail** due to a naive YAML parser in `audit-questions.mjs`:
`config/review-policy.yaml` has trailing Chinese comments on the `max_correct_longest_ratio: 0.25 # ...` and `answer_position_bias_max: 0.35 # ...` lines; the parser stores the entire trailing string as the max value, and JS comparison of `0 <= "0.25 # ..."` returns false. The `correct_wrong_length_gap: 0.15` line has no trailing comment and parses correctly. The canary agent's scope excludes modifying `scripts/` and `config/`, so this is reported as a config/tooling issue rather than a content issue.

**13 MAJOR issues of type `coverage_shortfall`** are also reported — these compare 5-per-module canary counts against **full-cohort minimums** (e.g., "F code_implementation: 5 < required 12"). These are expected in canary phase and will be resolved when the full 400 questions are generated.

## 10. Design Decisions and Notes

### 10.1 Correctness-first authoring pipeline

- Every question was drafted by first writing the content card (learning objective + canonical claim + misconceptions) and only then producing the stem/options. Distractors are grounded in specific misconception patterns (`errorType`) rather than generic wrong statements.
- Every correct answer maps to ≥1 sourceRef.supports; every wrong answer has an `optionExplanations[X]` describing why it is wrong.

### 10.2 Option-length balance

Initial draft had 100% of questions with correct-as-longest (a well-known LLM authoring bias). After rebalancing:
- All 25 questions now have at least one distractor at least as long as the correct answer.
- Average correct length: 166 chars; average wrong length: 205 chars (correct is 19% shorter, i.e., wrong is 24% longer).
- No length-inflation was done at the cost of accuracy; distractors were extended with plausible-sounding but wrong technical detail sourced from the corresponding misconception in the content card.

### 10.3 Kernel vs. end-to-end / model-size vs. speed

No question in this canary claims that kernel-level speedup implies end-to-end speedup, or that "smaller model → faster" is automatic. Where dtype/quantization is mentioned (e.g., `L-NCU-004` distractor for bandwidth-bound fix), the fix is qualified as "with an appropriate kernel available" and the correct answer distinguishes between reducing bytes moved and the actual dtype semantic.

### 10.4 No fabricated benchmark numbers

Where performance numbers appear (e.g., A100 peak 312 TFLOP/s FP16 TC, 19.5 TFLOP/s FP32, 2.0 TB/s HBM), they come from published NVIDIA architecture documentation (CUDA Programming Guide, A100 whitepaper). No question presents a "we measured X on our hardware" claim. `evidenceType` for perf-claim questions is `"analytical"` (derived by hand from documented peaks and workload arithmetic), matching the spec's requirement that this repo has no GPU environment for direct measurement.

### 10.5 Version pinning for PyTorch / Triton

All PyTorch-behavior questions (Module D + several F) are scoped to `PyTorch 2.3 ~ 2.5` / `Triton 2.2 ~ 3.0` and marked `stability: "version_sensitive"` with `verifiedAt: "2026-07-26"`. This complies with `SOURCE_POLICY.md` §3 and `AGENTS.md` §9. Behavior described (STORE_ATTR graph-break, default shape-guard specialization, functionalization) is well-documented within this version window.

### 10.6 Multiple-choice design

All three multi-choice questions have exactly 3 correct answers out of 4 options — this creates the strongest concept-boundary test where the sole distractor represents the most common misconception. To avoid a "3 correct out of 4" pattern-leak, if this canary is later expanded to full-cohort, some multi-choice questions should be authored with 2-of-4 correctness.

## 11. Skipped / Known-limitations

- No `paper_design_intent`, `precise_definition`, or `systems_dataflow` archetypes appear in this canary set (those live in Modules H/I/J/N or are best exercised at scale). The A/C/D/F/L canary emphasizes formula/IR/code/perf-diagnosis archetypes as instructed.
- Coverage_shortfall MAJORs relative to full-cohort minimums are expected; they are not blockers for canary.
- The naive YAML-parser bug in `scripts/audit-questions.mjs` was noted but not fixed (scope restriction); the actual computed audit metrics all pass their intended thresholds.
- No test kernels were run on real GPUs (repo has no GPU environment per policy); all performance claims are `evidenceType: "analytical"`.

## 12. Handoff to Reviewer

- Recommended action: proceed to Primary Blind Reviewer for canary. Blind-package input files are `data/questions/{A,C,D,F,L}/*.json` (all 25).
- All questions carry `reviewStatus: "draft"` and `version: 1`.
- Content cards should be presented alongside during independent-reviewer answering — but per `AGENTS.md` §2, the Primary Reviewer only receives the de-answered blind package.
- Any BLOCKER findings should route back to a Repair-agent for the affected module.
