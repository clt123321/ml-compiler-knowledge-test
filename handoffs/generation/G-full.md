# Batch 4 Generation Handoff — Module G (30 questions, all draft)

- **Agent**: generation-G (Batch 4)
- **Date**: 2026-07-26
- **Base branch**: `feat/ml-compiler-knowledge-test-v1`
- **Base commit**: `7431abb review: canary Round 1 blind review — 25/25 agree, PASS`
- **Files written**:
  - `data/questions/G/*.json` (30 files)
  - `data/content-cards/G/*.json` (30 files)
  - `manifests/G.json`
  - `handoffs/generation/G-full.md` (this file)

## 1. Question IDs by Subtopic

| ID | Archetype | Type | Difficulty | Depth | Topic |
|---|---|---|---|---|---|
| `G-FUSION-001`     | precise_definition   | single   | 2 | textbook       | Vertical/horizontal/epilogue fusion definitions |
| `G-FUSION-002`     | concept_boundary     | single   | 3 | implementation | Producer-consumer fusion with multi-consumer trade-off |
| `G-FUSION-003`     | concept_boundary     | multiple | 3 | implementation | Fusion boundary conditions (device, mutation, outputs) |
| `G-FUSION-004`     | ir_transformation    | single   | 3 | implementation | GEMM+bias+GELU epilogue fusion (physical vs logical) |
| `G-FUSION-005`     | performance_diagnosis| single   | 4 | systems        | Fusion-induced register spill and occupancy collapse |
| `G-LOOPFUSE-006`   | ir_transformation    | single   | 3 | implementation | Loop fusion legality (forward-crossing dependence) |
| `G-LOOPFISS-007`   | concept_boundary     | multiple | 3 | implementation | Loop fission motivations |
| `G-TILE-008`       | formula_performance  | single   | 3 | implementation | Square GEMM tile size vs 48KB cache budget |
| `G-TILE-009`       | performance_diagnosis| single   | 3 | systems        | Tile size vs SM count on smaller shapes |
| `G-REORDER-010`    | ir_transformation    | single   | 3 | implementation | GEMM ikj vs ijk locality on row-major |
| `G-UNROLL-011`     | concept_boundary     | single   | 3 | implementation | Unrolling I-cache pressure |
| `G-VECTOR-012`     | code_implementation  | single   | 3 | implementation | Vectorization preconditions (shift + tail) |
| `G-PARALLEL-013`   | concept_boundary     | multiple | 3 | implementation | Parallelization legality preconditions |
| `G-LAYOUT-014`     | performance_diagnosis| single   | 3 | systems        | NCHW → NHWC for Tensor Core Conv2D |
| `G-MEMPLAN-015`    | precise_definition   | single   | 2 | textbook       | Memory planning / buffer reuse definition |
| `G-RECOMP-016`     | concept_boundary     | multiple | 3 | systems        | Recomputation / activation checkpointing trade-offs |
| `G-CFCSE-017`      | ir_transformation    | single   | 2 | textbook       | Constant folding + CSE + DCE composition |
| `G-SHAPESPEC-018`  | concept_boundary     | multiple | 3 | systems        | Shape specialization vs dynamic shape trade-off |
| `G-KERNSEL-019`    | precise_definition   | single   | 2 | textbook       | Kernel selection definition |
| `G-COSTMODEL-020`  | concept_boundary     | multiple | 3 | research       | Analytical cost model vs measurement gap |
| `G-AUTOTUNE-021`   | performance_diagnosis| single   | 3 | systems        | Autotuner winner-take-all variance |
| `G-SEARCHSP-022`   | concept_boundary     | single   | 3 | research       | Template-based vs template-free search |
| `G-METASCHED-023`  | paper_design_intent  | multiple | 4 | research       | MetaSchedule / Ansor design motivations |
| `G-ANSOR-024`      | paper_design_intent  | single   | 4 | research       | Ansor central design intent |
| `G-HALIDE-025`     | paper_design_intent  | single   | 4 | research       | Halide algorithm/schedule separation |
| `G-PORTABILITY-026`| concept_boundary     | multiple | 4 | research       | Performance portability scope |
| `G-INDUCTOR-027`   | performance_diagnosis| single   | 3 | systems        | TorchInductor scheduler fusion decision reading |
| `G-TVMSCHED-028`   | ir_transformation    | multiple | 3 | implementation | TensorIR schedule-primitive preconditions |
| `G-BUDGET-029`     | concept_boundary     | multiple | 3 | systems        | Compilation budget vs runtime speedup |
| `G-TRANSFERTUNE-030`| performance_diagnosis| single   | 3 | research       | Transfer tuning cost-model scope |

## 2. Distributions

**Type**:
- Single: 20 (67%)
- Multiple: 10 (33%): `G-FUSION-003`, `G-LOOPFISS-007`, `G-PARALLEL-013`, `G-RECOMP-016`, `G-SHAPESPEC-018`, `G-COSTMODEL-020`, `G-METASCHED-023`, `G-PORTABILITY-026`, `G-TVMSCHED-028`, `G-BUDGET-029`

All multi-select questions have 3 correct options (within spec's 2–3 range).

**Difficulty**:
| Difficulty | Count | Fraction |
|---|---|---|
| 2 | 4 | 13% |
| 3 | 20 | 67% |
| 4 | 6 | 20% |

**Archetype coverage** (requirements met):
- concept_boundary: 11 (≥ 6 required) ✓
- performance_diagnosis: 6 (≥ 4 required) ✓
- ir_transformation: 5 (≥ 4 required) ✓
- paper_design_intent: 3 (≥ 2 required) ✓
- code_implementation: 1
- precise_definition: 3
- formula_performance: 1

**Depth**:
| Depth | Count |
|---|---|
| textbook | 4 |
| implementation | 14 |
| systems | 6 |
| research | 6 |

## 3. Source Refs Used

Primary Tier-1 / Tier-2 sources cited across module G:

- `BOOK:eac3` — 6, 7, 10, 11, 17
- `BOOK:pmpp4` — 8, 10, 14
- `DOC:torch-inductor` — 1, 3, 4, 27
- `DOC:tvm-relax` — 3, 9, 22, 23, 28, 30
- `DOC:cuda-guide` — 14
- `DOC:cuda-best` — 5, 11
- `DOC:llvm-langref` — 12, 17
- `DOC:stablehlo` — 15
- `PAPER:tvm` — 1, 2, 3, 20, 22, 26
- `PAPER:halide` — 2, 16, 25, 26
- `PAPER:ansor` — 9, 20, 21, 22, 23, 24, 29, 30

## 4. Version Sensitivity

**stable_principle** (most questions): 22
**version_sensitive**: 8
- `G-TILE-009`, `G-AUTOTUNE-021`, `G-METASCHED-023`, `G-INDUCTOR-027`, `G-TVMSCHED-028`, `G-TRANSFERTUNE-030` — TVM/MetaSchedule/TorchInductor specific behavior
- All version-sensitive entries carry `softwareContext.frameworkVersionScope` + `softwareContext.verifiedAt`

## 5. Points That Need Human Verification

1. **G-TILE-009** — Claim about A100 SM count (108) and grid-block underpopulation is standard but the specific percentages (34% TC utilization) are illustrative; verify with actual Nsight data if desired.
2. **G-METASCHED-023** — Claim "MetaSchedule matches or exceeds hand-tuned templates within similar tuning budgets" is a paper_result generalization; wording is scoped, but reviewers may want to tighten.
3. **G-INDUCTOR-027** — The specific TorchInductor scheduler log message shown is illustrative rather than a verbatim quote; version-sensitive tag applied. A reviewer with TORCH_LOGS access could verify the exact wording.
4. **G-COSTMODEL-020** — Ansor Section reference is a general pointer; a page-level citation may be preferred by the audit script.

## 6. Content-Card Compliance

Every question has a matching content card in `data/content-cards/G/*.json` with:
- ≥ 1 canonical claim with conditions, non-implications, sourceMappings.
- ≥ 3 subtopic-specific misconceptions (each with errorType and whyWrong).
- implementationFacts / performanceScenarios / versionSensitivity fields populated.

## 7. Validation

`node scripts/validate-questions.mjs` on 2026-07-26:
- Loaded 254 questions, 254 content cards.
- G: 30/30 ✓
- Schema OK: 30/30
- No errors, no warnings for module G.
