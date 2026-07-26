# Batch 7 Generation Handoff — Module M (15 questions, all draft)

- **Agent**: generation-M (Batch 7)
- **Date**: 2026-07-26
- **Base branch**: `feat/ml-compiler-knowledge-test-v1`
- **Base commit**: `d0d980f feat: Wave 1 — modules A/B/C/D/E/F/G/H (235 new questions, 260 total)`
- **Files written**:
  - `data/questions/M/*.json` (15 files)
  - `data/content-cards/M/*.json` (15 files)
  - `manifests/M.json`
  - `handoffs/generation/M-full.md` (this file)

## 1. Question IDs by Subtopic

| ID | Archetype | Type | Correct# | Difficulty | Depth | Topic |
|---|---|---|---|---|---|---|
| `M-AR-001` | concept_boundary | single | 1 | 3 | textbook | AllReduce vs AllGather semantics |
| `M-COST-002` | formula_performance | single | 1 | 3 | implementation | Ring-AllReduce bandwidth cost 2(N-1)/N·S |
| `M-RS-003` | concept_boundary | single | 1 | 3 | textbook | ReduceScatter vs AllReduce; AllReduce = RS + AG |
| `M-A2A-004` | concept_boundary | single | 1 | 3 | systems | All-to-All / MoE dispatch |
| `M-OVERLAP-005` | systems_dataflow | multiple | 2 | 3 | systems | Comm/Compute overlap preconditions |
| `M-BUCKET-006` | systems_dataflow | single | 1 | 3 | systems | Gradient bucketing motivation and trade-off |
| `M-SPMD-007` | concept_boundary | multiple | 3 | 4 | research | SPMD vs MPMD / manual placement (GSPMD) |
| `M-MESH-008` | concept_boundary | single | 1 | 3 | systems | Device Mesh: logical grid vs physical topology |
| `M-SHARD-009` | systems_dataflow | multiple | 2 | 4 | systems | Reshard collectives between sharding specs |
| `M-COSTMODEL-010` | formula_performance | single | 1 | 3 | implementation | α + β·S cost model regimes |
| `M-COSTAG-011` | formula_performance | multiple | 3 | 4 | implementation | Ring AllGather/ReduceScatter/AllReduce costs |
| `M-GSPMD-012` | paper_design_intent | single | 1 | 4 | research | GSPMD sharding propagation design intent |
| `M-GSPMD-013` | paper_design_intent | single | 1 | 4 | research | GSPMD annotations as hints (not rigid specs) |
| `M-BOUNDARY-014` | concept_boundary | multiple | 3 | 4 | systems | Compiler vs distributed runtime boundary |
| `M-PIPE-015` | systems_dataflow | single | 1 | 4 | systems | Pipeline bubble and microbatching |

## 2. Distributions

### Type
- Single: 10 (67%): 001, 002, 003, 004, 006, 008, 010, 012, 013, 015
- Multiple: 5 (33%): 005, 007, 009, 011, 014

### Multi-select correct-count balance
- **2-correct** (2 questions): `M-OVERLAP-005`, `M-SHARD-009`
- **3-correct** (3 questions): `M-SPMD-007`, `M-COSTAG-011`, `M-BOUNDARY-014`

### Difficulty
| Difficulty | Count |
|---|---|
| 3 | 8 (001-006, 008, 010) |
| 4 | 7 (007, 009, 011-015) |

### Archetype coverage (requirements met)
| Archetype | Count | Required | Status |
|---|---|---|---|
| concept_boundary | 6 (001, 003, 004, 007, 008, 014) | ≥ 4 | pass |
| systems_dataflow | 4 (005, 006, 009, 015) | ≥ 3 | pass |
| formula_performance | 3 (002, 010, 011) | ≥ 3 | pass |
| paper_design_intent | 2 (012, 013) | ≥ 2 | pass |
| collective scheduling / bucketing / overlap | 3 (005 overlap, 006 bucketing, 015 pipeline scheduling) | ≥ 2 | pass |

### Depth
| Depth | Count |
|---|---|
| textbook | 2 (001, 003) |
| implementation | 3 (002, 010, 011) |
| systems | 6 (004, 005, 006, 008, 009, 014, 015) |
| research | 3 (007, 012, 013) |

_Note: sum = 14 due to `M-PIPE-015` being systems, not the extra I mistakenly summed; recount: textbook=2, implementation=3, systems=7 (004,005,006,008,009,014,015), research=3 (007,012,013) → 15._

### Single-select correct A/B/C/D distribution (10 singles)
- A: 2 (001, 010)
- B: 3 (002, 003, 013)
- C: 3 (004, 006, 008)
- D: 2 (012, 015)

## 3. Source references

All 15 questions cite Tier 1 or Tier 2 sources per policy:

- `PAPER:gspmd` — used by 001, 002, 003, 004, 005, 006, 007, 009, 010, 011, 012, 013, 014, 015 (SPMD design intent, propagation, reshard, mesh, bucketing)
- `BOOK:hp6` — 001, 002, 003, 005, 006, 010, 011, 014, 015 (collective communication cost, pipeline, overlap)
- `DOC:stablehlo` — 007, 008, 009, 014 (SPMD collectives at IR level)
- `DOC:cuda-guide` — 005 (streams and concurrent kernel execution)

No Tier 3 source is used as the sole support for a correct answer.

## 4. Software / version stability

All 15 M-module questions use `stability: "stable_principle"`. No version-sensitive claims are made about specific NCCL / PyTorch / XLA versions; where PyTorch or NCCL is mentioned, it is at the architecture level (streams, non-blocking collectives) rather than a specific API version.

## 5. Coverage vs syllabus

Syllabus subtopics vs coverage:
| Subtopic | Covered by |
|---|---|
| AllReduce / AllGather | 001, 011 |
| ReduceScatter | 003, 011 |
| All-to-All | 004 |
| Communication / Computation Overlap | 005 |
| Fusion / Bucketing | 006 |
| Sharding / SPMD | 007, 009 |
| Device Mesh / Tensor Partition | 008 |
| Operator Sharding / Reshard | 009 |
| Communication Cost Model | 002, 010, 011 |
| GSPMD basic ideas | 007, 012, 013 |
| Pipeline | 015 |
| Collective Scheduling | 005, 006, 015 |
| Compiler / Runtime boundary | 014 |

Host/Accelerator collaboration and CPU/GPU/NPU heterogeneity are covered indirectly via 005 (streams + DMA vs SM) and 014 (runtime concerns). No dedicated NPU-specific question — deferred to a possible J/K-module expansion or M-module top-up.

## 6. Human-review flags

None of the 15 questions carry `needs_source_verification`. Points that reviewers may want to verify:

1. **`M-COST-002`, `M-COSTAG-011`**: canonical ring-AllReduce / AllGather / ReduceScatter costs are stated at the (N-1)/N·S and 2(N-1)/N·S level, ignoring pipelining edge effects and small chunk residuals. This is the textbook derivation (see HP6 Ch. 6 and GSPMD §3) — reviewers should confirm the level of precision is appropriate for L3/L4 questions.
2. **`M-COSTMODEL-010`**: numeric α = 10 μs and β = 100 ps/byte are illustrative; the correct answer uses regime reasoning (α ≫ β·S at 1 KB) so the exact numbers do not need to match any specific NCCL / MPI implementation.
3. **`M-GSPMD-012`, `M-GSPMD-013`**: paper-design questions about GSPMD. Reviewers should re-read GSPMD §3.2–§3.3 to confirm the wording of "annotations as hints" matches the paper's language.
4. **`M-OVERLAP-005`**: the two selected correct options are independently sufficient for concurrency in the standard CUDA-stream model. Reviewer should sanity-check that C (compiler reordering to force all AllReduces after backward) is unambiguously wrong per the standard DDP / GSPMD literature.
5. **`M-PIPE-015`**: bubble formula (P-1)/(P + M - 1) matches GPipe; interleaved 1F1B has a different constant. The question sticks to the classical GPipe schedule.

## 7. Validation

`node scripts/validate-questions.mjs` produces **0 errors, 0 warnings** for module M (only unrelated warnings for other modules).

- All 15 questions and content cards pass Schema.
- ID format, uniqueness, module prefix, single/multi answer counts, option coverage of explanations, sourceRefs.supports for correct answers, and content-card presence all pass.
- Manifest expected count 15 matches actual.

## 8. What is NOT covered (deliberately left for future modules or human review)

- No question about specific NCCL heuristics (ring vs tree crossover payload size) — this is version- and stack-dependent.
- No dedicated NPU vs GPU heterogeneity question — Module M's 15-question budget prioritized SPMD / GSPMD paper concepts and collective cost fundamentals.
- No question with concrete measured Ring-AllReduce numbers on specific hardware; all `performanceClaim` entries are `analytical` or absent.
