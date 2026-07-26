# Module A — Primary Review (Round 1)

- Reviewer: primary-review-canary
- Reviewed at: 2026-07-26
- Total questions: 5
- Answer agreement rate: 5/5
- PASS: 4, MINOR: 1, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0
- Hardware conditions sufficient: 5/5

## Findings

### A-ARITH-001: PASS
- Independent answer: [C]
- Official answer: [C]
- Notes: Roofline classification of batch-1 FP16 GEMV on A100 is textbook. AI = 33.55M FLOP / 33.55 MB ≈ 1 FLOP/byte, well below the FP16 ridge (~ 153 FLOP/byte). Ceiling = HBM × AI ≈ 2 TFLOP/s. Sources BOOK:pmpp4 Ch. 5-6 and BOOK:hp6 Ch. 4 (Tier 1) directly support Roofline. Distractors A/B/D each probe a distinct misconception (compute-peak confusion, wrong-precision ridge, SMEM staging confusion). Hardware context complete (A100 SXM, HBM2e, peaks specified).

### A-ARITH-002: PASS
- Independent answer: [C]
- Official answer: [C]
- Notes: Softplus elementwise. AI = 10 FLOP / 8 bytes = 1.25 FLOP/byte < A100 FP32 ridge (9.75) → memory-bound; ceiling ≈ 2.5 TFLOP/s. Distractor B (omit writes) is the canonical AI-arithmetic error and is a strong distractor. Sources BOOK:pmpp4 and DOC:cuda-best (Tier 1).

### A-LITTLE-004: PASS
- Independent answer: [A]
- Official answer: [A]
- Notes: Straight application of Little's Law: 2 TB/s × 400 ns = 800 KB in flight; divided by 128 B/load = 6,250. Distractor B (per-scheduler scope), C (SM-count heuristic), D (deny latency) probe distinct MLP misconceptions. Sources BOOK:hp6 and BOOK:pmpp4 (Tier 1).

### A-MEM-005: MINOR
- Independent answer: [A, C, D]
- Official answer: [A, C, D]
- Notes: Correct set. All three claims (register file > 192 KB SMEM; SMEM banks vs global-memory coalescing; constant-memory broadcast) are documented in the CUDA C++ Programming Guide and PMPP4 (Tier 1). Distractor B (invert HBM vs. aggregate SMEM BW) is a strong classical misconception.
- MINOR wording note: option D says "delivering the value in one cycle to the whole warp." The Programming Guide's canonical phrasing is "as fast as reading from a register." The exact "one cycle" figure is a slight simplification of cached constant-memory latency; the claim is otherwise well-supported. Consider softening the wording in future revisions to avoid an over-precise cycle count.

### A-OCC-003: PASS
- Independent answer: [D]
- Official answer: [D]
- Notes: Clean occupancy arithmetic. 96 regs × 256 threads = 24,576 regs/block; ⌊65,536 / 24,576⌋ = 2 blocks/SM → 512 threads → 16/64 warps → 25%. Distractors: A (miscount blocks), B (over-fit register file), C (fake block cap). Ptxas output and launch config faithfully match the calculation. Sources DOC:cuda-guide CC 8.0 tables and BOOK:pmpp4 occupancy chapter (Tier 1).

## Summary
Module A: 5/5 answer agreement, all sources Tier 1, all hardware/version scopes sufficient, one MINOR wording note on A-MEM-005 option D. No BLOCKER, no MAJOR, no distractor weakness, no meta-statement options. Passes canary gate for module A.
