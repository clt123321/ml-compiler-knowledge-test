# Batch 7 Generation Handoff — Module N (10 questions, all draft)

- **Agent**: generation-N (Batch 7)
- **Date**: 2026-07-26
- **Base branch**: `feat/ml-compiler-knowledge-test-v1`
- **Base commit**: `d0d980f feat: Wave 1 — modules A/B/C/D/E/F/G/H (235 new questions, 260 total)`
- **Files written**:
  - `data/questions/N/*.json` (10 files)
  - `data/content-cards/N/*.json` (10 files)
  - `manifests/N.json`
  - `handoffs/generation/N-full.md` (this file)

## 1. Question IDs by Subtopic

| ID | Archetype | Type | Correct# | Difficulty | Depth | Paper | Topic |
|---|---|---|---|---|---|---|---|
| `N-HALIDE-001` | paper_design_intent | single | 1 | 4 | research | Halide | Algorithm/schedule separation rationale |
| `N-TVM-002` | paper_design_intent | single | 1 | 4 | research | TVM | Real measurement vs pure cost model |
| `N-ANSOR-003` | paper_design_intent | multiple | 2 | 4 | research | Ansor | Task scheduler for tuning budget |
| `N-MLIR-004` | paper_design_intent | single | 1 | 3 | research | MLIR | Multi-level lowering / dialect ecosystem |
| `N-TRITON-005` | paper_design_intent | single | 1 | 3 | research | Triton | Tile-level IR abstraction |
| `N-FLASH-006` | paper_design_intent | multiple | 3 | 4 | research | FlashAttention | IO-awareness, exactness, scope of speedup |
| `N-VLLM-007` | paper_design_intent | single | 1 | 3 | research | vLLM | PagedAttention: KV cache fragmentation motivation |
| `N-GSPMD-008` | concept_boundary | multiple | 2 | 4 | research | GSPMD | Peak vs geomean, paper-scope discipline |
| `N-PYT2-009` | concept_boundary | single | 1 | 3 | research | PyTorch 2 | End-to-end vs kernel-level speedup |
| `N-QUANT-010` | concept_boundary | multiple | 3 | 4 | research | SmoothQuant / GPTQ / AWQ | Scope limits of quantization claims |

## 2. Distributions

### Type
- Single: 6 (60%): 001, 002, 004, 005, 007, 009
- Multiple: 4 (40%): 003, 006, 008, 010

### Multi-select correct-count balance
- **2-correct** (2 questions): `N-ANSOR-003`, `N-GSPMD-008`
- **3-correct** (2 questions): `N-FLASH-006`, `N-QUANT-010`

### Difficulty
| Difficulty | Count |
|---|---|
| 3 | 4 (004, 005, 007, 009) |
| 4 | 6 (001, 002, 003, 006, 008, 010) |

Requirement: ≥ 3 L4 → pass (6 L4).

### Archetype coverage (requirements met)
| Archetype | Count | Required |
|---|---|---|
| paper_design_intent | 7 (001–007) | ≥ 6 ✓ |
| concept_boundary | 3 (008, 009, 010) | complement |

### Depth
- All 10 are `research` depth (research judgment module).

### Single-select correct A/B/C/D distribution (6 singles)
- A: 2 (005, 009)
- B: 2 (001, 007)
- C: 1 (004)
- D: 1 (002)

## 3. Source references

Every question binds to specific paper sections in `references/SOURCE_REGISTRY.json`:

| Paper | Used by |
|---|---|
| `PAPER:halide` | 001 |
| `PAPER:tvm` | 002 |
| `PAPER:ansor` | 002, 003 |
| `PAPER:mlir` | 004 |
| `PAPER:triton` | 005 |
| `PAPER:flashattn` | 006 |
| `PAPER:vllm` | 007 |
| `PAPER:gspmd` | 008 |
| `PAPER:pytorch2` | 009 |
| `PAPER:smoothquant` | 010 |
| `PAPER:gptq` | 010 |
| `PAPER:awq` | 010 |
| `DOC:mlir-langref` | 004 |
| `DOC:torch-compile` | 009 |

All correct answers bind to Tier 2 papers (and one Tier 1 DOC in support). No Tier 3 source appears as sole support.

## 4. Paper-result vs analytical evidence

- `N-FLASH-006` sets `performanceClaim.present: true` with `evidenceType: "paper_result"` and explicit `scope: "Attention on GPU with sequence length N and head dim d; comparison against a naive unfused attention baseline"`. Speedup magnitudes are not written into the question; only scope-of-applicability claims are made.
- All other N-module questions have `performanceClaim.present: false` because they test design intent / scope reasoning rather than quantitative claims. This avoids embedding paper-specific numbers as generalized facts (per `SOURCE_POLICY.md` §4).

## 5. Coverage vs syllabus

Syllabus subtopic vs coverage:
| Subtopic | Covered by |
|---|---|
| 为什么引入某个 IR | 004 (MLIR), 005 (Triton) |
| 分离 Compute 和 Schedule | 001 (Halide) |
| 多层 Lowering | 004 (MLIR) |
| 真实测量 vs Cost Model | 002 (TVM), 003 (Ansor) |
| 某优化的必要前提 | 006 (FlashAttention shape scope) |
| Ablation 支持什么 | 010 (SmoothQuant α ablation) |
| Benchmark 是否公平 | 008 (peak vs geomean; baseline discipline) |
| Compile Time 是否被忽略 | 002, 003 (autotuning as trade-off) |
| 是否换了算法 vs 仅编译优化 | 007 (PagedAttention memory management vs compute) |
| 是否使用了不同精度 / KV / FLOPs | 010 (quantization scope) |
| 是否只在特定 Shape/硬件 | 006 (FlashAttention shape scope), 010 (quant hw kernel dependence) |
| Peak vs Geomean | 008 |
| End-to-end vs Kernel-level | 009 |
| 单篇论文 vs 领域共识 | 008, 010 (scope discipline) |

Every syllabus subtopic listed in N is covered by at least one question. Two subtopics (fusion failure preconditions, algorithm-substitution vs compilation-only) are covered indirectly via 006 and 007 respectively.

## 6. Human-review flags

None of the 10 questions carry `needs_source_verification`. Points that reviewers may want to verify:

1. **`N-HALIDE-001`**: reviewer should re-read Halide paper §1–§3 to confirm the wording of "single portable algorithm re-scheduled per target" matches the paper.
2. **`N-TVM-002`**: TVM paper §4–§5 argues learned cost model + measurement; reviewer should confirm the option D wording ("closed-form models fail to rank reliably at fine granularity") matches the paper's argumentation.
3. **`N-ANSOR-003`**: task-scheduler description is at §5 of the Ansor paper. Reviewer should confirm "marginal improvement × contribution to end-to-end latency" reasonably summarizes Ansor's gradient-descent + confidence-based allocation strategy.
4. **`N-FLASH-006`**: option A states HBM traffic is Θ(N²·d/M). Reviewer should re-read FlashAttention paper §3 to confirm this bound (which is the paper's stated IO complexity for the block-tiled algorithm).
5. **`N-VLLM-007`**: PagedAttention's motivation is stated as KV cache fragmentation (internal + external). Reviewer should re-read vLLM paper §3 to confirm the categorization of both internal (over-reservation) and external (holes) fragmentation.
6. **`N-QUANT-010`**: cross-paper question covering SmoothQuant / GPTQ / AWQ. Option D uses the "memory savings ⇏ latency speedup" fallacy which is explicit in H-MEMTRAFFIC-024 style content but reviewers should verify none of the three papers claim otherwise.
7. **`N-PYT2-009`**: kernel-vs-e2e speedup argument uses Amdahl's law reasoning. Marked `stability: "version_sensitive"` because it references PyTorch 2.x behavior; `frameworkVersionScope` and `verifiedAt` are set.

## 7. Validation

`node scripts/validate-questions.mjs` produces **0 errors** for module N. All 10 questions and content cards pass Schema. Manifest expected count 10 matches actual.

## 8. What is NOT covered (deliberately left out)

- No question requires memorization of specific speedup percentages from any paper — the module is explicitly about **research judgment and scope reasoning**, not benchmark memorization.
- No question quotes author names or paper titles; the questions test understanding of the design ideas.
- No question tests SmoothQuant vs GPTQ vs AWQ head-to-head accuracy or latency; 010 tests scope discipline, not a preference verdict.
