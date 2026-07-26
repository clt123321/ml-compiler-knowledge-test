# Module L — Primary Review (Round 1)

- Reviewer: primary-review-canary
- Reviewed at: 2026-07-26
- Total questions: 5
- Answer agreement rate: 5/5
- PASS: 5, MINOR: 0, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0
- Hardware conditions sufficient: 5/5

## Findings

### L-LAUNCH-001: PASS
- Independent answer: [D]
- Official answer: [D]
- Notes: Nsight Systems timeline with 1000 kernels × 20 µs CPU gap = 20 ms cumulative dispatch overhead is a classical launch-overhead-limited signature. Utilization 60% ≈ 30/50 ms matches the kernel sum. Distractors A (memory-bound + quantization fix), B (compute-bound + math-density fix), C (I/O bound + dataloader fix) each pair a specific WRONG root cause with a specific mitigation — this is a strong "diagnose the whole chain" test. Sources DOC:nsys + DOC:cuda-best (Tier 1). Profile data is realistic and self-consistent.

### L-NCU-004: PASS
- Independent answer: [B]
- Official answer: [B]
- Notes: DRAM 92% + low SM util + Long-Scoreboard stall is the textbook Nsight Compute memory-bound fingerprint. Verified: for streaming FP32 sqrt on 16 M elements = 64 MiB read + 64 MiB written = 128 MiB traffic; on A100 HBM ~2 TB/s → ~64 µs kernel — plausible. Distractors A (SM util → occupancy), C (L1 fix for no-reuse kernel), D (raise occupancy from 0.85) each target a different profiling misinterpretation. Sources DOC:ncu + BOOK:pmpp4 (Tier 1). Hardware context complete (A100, HBM2e).

### L-TIMING-002: PASS
- Independent answer: [A]
- Official answer: [A]
- Notes: CUDA async launch trap is a canonical benchmarking pitfall. 8 µs Attempt-1 (dispatch cost) vs 3.4 ms Attempt-2 (actual GPU time) ~ 425× difference matches expected magnitude. Distractor B correctly falsifies via "physically implausible" latency for 4096³ matmul. C (misclaim about `synchronize()` semantics) and D (JIT-cache-reset by synchronize) are strong distractors. Sources DOC:cuda-best + DOC:torch-profiler (Tier 1). No unsupported claim about specific hardware; the async model is universal.

### L-TOL-003: PASS
- Independent answer: [C]
- Official answer: [C]
- Notes: FP16 GEMM K=1024 tolerance question. atol=1e-5/rtol=1e-6 is FP64-scale and inappropriate. Realistic FP16 GEMM tolerances are ~1e-2 for Gaussian-random inputs. Distractor A dangerously reverses the causal direction (FP32 accum is the FIX, not the problem) — testing that students don't accidentally downgrade to FP16 accum. B (bit-reproducibility myth), D (check_dtype misuse) are additional strong distractors. Sources DOC:torch-profiler + BOOK:pmpp4 + DOC:cuda-best (Tier 1). Hardware context "any Tensor-Core-capable" + "FP16 Tensor Cores" is sufficient.

### L-WARMUP-005: PASS
- Independent answer: [A]
- Official answer: [A]
- Notes: First-run vs steady-state gap of 43.2 ms vs 3.4 ms is characteristic of cuBLAS handle init + algo selection + kernel loading. Distractor B (misread `Event.elapsed_time` semantics), C (kernel-result cache myth), D (silent torch.compile promotion) each fabricate a specific plausible-sounding falsehood. Sources DOC:cuda-best + DOC:torch-profiler (Tier 1). The `torch.cuda.Event` timing method used in the code is itself the correct discipline being tested.

## Summary
Module L: 5/5 answer agreement, all Tier 1 sources, all version scopes declared where needed (PyTorch 2.0+, verifiedAt 2026-07-26), hardware contexts complete (A100 named where specific; "any CUDA-capable" where universal), no fabricated benchmark numbers (all profile data is realistic and self-consistent), no kernel-vs-e2e speedup conflation. Zero MINOR/MAJOR/BLOCKER findings. Cleanest module of the canary. Passes canary gate for module L.
