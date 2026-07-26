# Module F — Primary Review (Round 1)

- Reviewer: primary-review-canary
- Reviewed at: 2026-07-26
- Total questions: 5
- Answer agreement rate: 5/5
- PASS: 4, MINOR: 1, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0
- Hardware conditions sufficient: 5/5 (all sm_80+ specified; SMEM bank width / L1 sector size named where relevant)

## Findings

### F-BANK-003: PASS
- Independent answer: [C]
- Official answer: [C]
- Notes: Classical shared-memory transpose bank-conflict question. Verified the calculation: for tile[32][32] FP32, bank(tile[i][j]) = j mod 32. Write W1: fixed y, varying x → banks 0..31 → conflict-free. Read R1: varying x, fixed y → all lanes hit bank y → 32-way conflict. Padding to tile[32][33] breaks alignment. Distractors A (fake 32-way multicast), B (swap which side conflicts), D (auto-pad myth) all probe real misconceptions. Sources DOC:cuda-best + BOOK:pmpp4 (Tier 1). Hardware context correctly names the 32-bank / 4-byte config.

### F-COALESCE-002: MINOR
- Independent answer: [D]
- Official answer: [D]
- Notes: stride=8 FP32 → 32 B between adjacent lane addresses → each 128 B sector serves 4 lanes → 8 sectors per warp → 1/8 effective BW. Correct diagnosis. Distractor B misapplies bank-conflict to global memory (excellent test), C invents a `cp.async` bandwidth-recovery myth, A confuses mask with coalescing. Sources DOC:cuda-best + BOOK:pmpp4 (Tier 1). Hardware requires `128-byte L1/L2 sector transactions` which is stated. Triton version scope Triton 2.2-3.0 with verifiedAt is declared.
- MINOR (wording): "each 128 B L1/L2 sector delivers only 4 useful bytes per lane" is a compressed phrasing. A slightly more explicit form ("one 128 B sector serves only 4 lanes → 8 sectors per warp → 1/8 peak") reads more clearly. The math and conclusion are correct.

### F-DOTPROD-004: PASS
- Independent answer: [A, B, C]
- Official answer: [A, B, C]
- Notes: Multi-select with three correct claims (atomic_add correctness given zero-init, FP32 non-associativity → non-deterministic result, mask+other=0 preserves reduction semantics). Distractor D (atomic_add "overwrites") probes the classic atomic_add vs atomic_exchange confusion — strong distractor. Sources DOC:triton + DOC:cuda-guide (Tier 1). Version scope Triton 2.2-3.0 + verifiedAt declared. Hardware note "FP32 global atomic add" is essential and stated.

### F-RMS-005: PASS
- Independent answer: [B]
- Official answer: [B]
- Notes: Row-parallel RMSNorm with BLOCK=4096 → per-program footprint ~16 KB constrains occupancy. Verified: 4096 × 4 B = 16,384 B for the x tile alone. Distractor A (tl.sum needs its own mask) tests common Triton misconception — well chosen. C (fabricated 20% speedup number) and D (rcpsqrt bit-identical myth) probe distinct fallacies. Sources DOC:triton + DOC:cuda-guide (Tier 1). Assumption "N=4096 fits within one program's tile" appropriately scopes the answer.

### F-TRITON-001: PASS
- Independent answer: [A]
- Official answer: [A]
- Notes: Straightforward Triton mask/other semantics. Concrete example (pid=976, 576 valid + 448 masked lanes) makes the tail behavior tangible. Distractor B (implicit bounds check myth) is a very common misconception — well tested. C (mask is store-only) and D (constexpr BLOCK constant-folds mask) probe distinct misunderstandings. Sources DOC:triton + PAPER:triton (Tier 1 + Tier 2). Version scope declared.

## Summary
Module F: 5/5 answer agreement, all Tier 1/Tier 2 sources, all version scopes declared (Triton 2.2-3.0, verifiedAt 2026-07-26), hardware contexts complete (sm_80+ with feature specifics), no kernel-vs-e2e speedup claims, no fabricated benchmark numbers. One MINOR wording note on F-COALESCE-002 option D. No BLOCKER, no MAJOR, no meta-statement options. Passes canary gate for module F.
