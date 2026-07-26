# Module M — Primary Review (Round 1)

- **Reviewer**: primary-review-4
- **Module**: M (distributed, communication compilation, heterogeneous execution)
- **Question count**: 15
- **Date**: 2026-07-27

## Overall Result

| Metric | Value |
|---|---|
| Independent-vs-official agreement | **15 / 15 (100%)** |
| PASS | 15 |
| MINOR | 0 (with MINOR notes: 3 questions, all PASS) |
| MAJOR | 0 |
| BLOCKER | 0 |

**Verdict**: All 15 questions **PASS**. Ready for Round 2 verification without repair.

## Methodology

- **Phase A (Blind)**: Reviewer answered every question strictly from stem + options + assumptions in `reviews/blind/M.json`. Independent answers stored in `reviews/round1/M-independent.json` before opening any files under `data/questions/M/**` or `data/content-cards/M/**`.
- **Phase B (Compare + Source)**: After locking Phase A, reviewer opened the full question files to compare `correctAnswers`, inspect `explanation` / `optionExplanations` / `nonImplications` / `sourceRefs`, and cross-check refs against `references/SOURCE_REGISTRY.json`.

## Coverage of module priorities

The 15 M questions collectively cover the priorities in the review brief:

| Priority topic | Question IDs |
|---|---|
| AllReduce / AllGather / ReduceScatter / All-to-All semantics | M-AR-001, M-RS-003, M-A2A-004 |
| Communication cost model (α + βS, ring costs) | M-COST-002, M-COSTAG-011, M-COSTMODEL-010 |
| Overlap / bucketing / pipeline | M-OVERLAP-005, M-BUCKET-006, M-PIPE-015 |
| SPMD / Device Mesh / GSPMD design intent | M-SPMD-007, M-MESH-008, M-GSPMD-012, M-GSPMD-013 |
| Compiler-vs-runtime boundary, reshard collectives | M-BOUNDARY-014, M-SHARD-009 |

## Per-question findings

### M-AR-001 (AllReduce vs AllGather semantics) — PASS
Independent: [B]; Official: [B]. Textbook distinction; distractors A/C/D each violate one core property (extra 1/N factor, swapped shapes, or claiming operator identity). No issues.

### M-RS-003 (ReduceScatter vs AllReduce) — PASS
Independent: [D]; Official: [D]. Correctly encodes AllReduce = ReduceScatter ∘ AllGather. Sources: BOOK:hp6, PAPER:gspmd. No issues.

### M-A2A-004 (All-to-All / MoE dispatch) — PASS
Independent: [D]; Official: [D]. Canonical MoE dispatch/combine pattern. `nonImplications` correctly flag that top-k routing can produce load imbalance. No issues.

### M-COST-002 (Ring-AllReduce cost) — PASS
Independent: [C]; Official: [C]. `2·(N-1)/N · S / BW` — classical Rabenseifner/Patarasuk result. Distractors cover naive-broadcast (B), recursive-halving (D), single-pass (A). Analytical `performanceClaim` scope pinned properly. No issues.

### M-COSTAG-011 (AllGather / ReduceScatter / AllReduce cost relationships) — PASS
Independent: [A, C, D]; Official: [A, C, D]. Three correct legs of the standard cost identity. B is the classic "N·S per rank" overcounting distractor. `optionExplanations` map correctly to option letters (D's caption "canonical ReduceScatter cost" matches option D's statement, which is what D asserts). No issues.

### M-COSTMODEL-010 (α + βS regimes) — PASS (with MINOR note)
Independent: [C]; Official: [C]. Compute: β = 100 ps/B, α = 10 μs → T(1 KB) ≈ 10 μs (α-dominated), T(10 MB) ≈ 1 ms (β·S-dominated). Answer is invariant to the KB=1000 vs KiB=1024 choice.
- **MINOR (clarity)**: consider replacing '1 KB' / '10 MB' with '1000 bytes' / '10^7 bytes' in the stem to remove any KB/KiB ambiguity. Not a correctness issue.

### M-BUCKET-006 (Gradient bucketing motivation and trade-off) — PASS (with MINOR note)
Independent: [D]; Official: [D]. D captures both the α-amortization mechanism and the "delayed dispatch shrinks overlap window" trade-off exactly.
- **MINOR (style)**: option C ("AllReduce averages them") phrases AllReduce as mean; default reduction is sum. Option C is still identifiably wrong, but tightening to "gradient sums" would be more precise.

### M-PIPE-015 (Pipeline bubble and microbatching) — PASS
Independent: [B]; Official: [B]. `(P-1)/(P + M - 1)` — canonical GPipe bubble fraction. Correctly notes the activation-memory / recomputation trade-off. Distractors cover the "P× per-microbatch latency reduction" confusion (C) and the "compiler can fuse away the bubble" fallacy (D). No issues.

### M-OVERLAP-005 (Overlap preconditions) — PASS
Independent: [B, C]; Official: [B, C]. Two-condition sufficiency for actual concurrency: distinct stream + async backend (B) AND no dependency forcing wait (C). A is the "dedicated communication core required" hardware fallacy; D is serialization. `hardwareContext.requiredFeatures` includes multi-stream execution and async collective launch. No issues.

### M-SPMD-007 (SPMD vs MPMD) — PASS
Independent: [B, C, D]; Official: [B, C, D]. Three correct legs of the GSPMD design description. A is the "SPMD forbids ANY per-rank difference" overclaim — SPMD permits rank-id-conditional computation. No issues.

### M-MESH-008 (Device Mesh logical vs physical) — PASS
Independent: [A]; Official: [A]. Named-axis logical grid; runtime maps to physical devices. Distractors capture common misconceptions (physical topology descriptor, single-axis-only sharding restriction, runtime-only object). No issues.

### M-GSPMD-012 (Sharding propagation) — PASS
Independent: [D]; Official: [D]. Propagation-and-reshard-insertion design. Sources: PAPER:gspmd. Distractors cover runtime-autotuner (A), P2P replacement (B), and XLA bypass (C) misconceptions. No issues.

### M-GSPMD-013 (Annotations as hints) — PASS
Independent: [A]; Official: [A]. Faithful to GSPMD paper §3.2–§3.3. Distractors are internally consistent negatives (runtime re-select, random drop, strict placement). No issues.

### M-BOUNDARY-014 (Compiler-vs-runtime boundary) — PASS (with MINOR note)
Independent: [A, B, C]; Official: [A, B, C]. Standard three-legged division: compiler picks WHICH collective (A), runtime picks HOW (B), runtime handles fault tolerance (C).
- **MINOR (style)**: option D's phrase "the emitted IR is topology-incorrect" is unusually strong distractor wording. A milder phrasing (e.g., "the compiler must know NVSwitch/PCIe topology at compile time to emit correct collectives") would be equally-wrong but more natural. Non-blocking.

### M-SHARD-009 (Reshard collectives) — PASS
Independent: [C, D]; Official: [C, D]. Sharded→replicated = AllGather (C); partial→replicated = AllReduce (D). Distractors correctly target two common errors: (A) "same-axis dim-switch is just local reshape" — actually needs All-to-All; (B) "replicated→sharded needs AllReduce+slice" — actually only a local slice. No issues.

## Global M-module observations

- **Answer positions distributed reasonably**: single-choice questions land on A(2), B(2), C(2), D(4). Not skewed enough to concern.
- **All `stability: stable_principle`** — appropriate: canonical collective semantics, ring cost formulas, and GSPMD paper-level design intent are all version-stable claims.
- **`performanceClaim.hardwareDependent=false`** for the analytical questions (M-COST-002, M-COSTAG-011, M-COSTMODEL-010, M-PIPE-015). Correct: these are cost-model results, not measured benchmarks.
- **Source refs** are Tier 1 (BOOK:hp6) or Tier 2 (PAPER:gspmd) plus canonical docs (DOC:stablehlo, DOC:cuda-guide). No Tier-3-only anchoring detected.

## Recommendation

- **No repair required for M.**
- All 15 questions are eligible to proceed to Round 2 (Verification).
- The three MINOR notes above are stylistic tightenings; they can be addressed in a later polish pass but do not gate promotion.
