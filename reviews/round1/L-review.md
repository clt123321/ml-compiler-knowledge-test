# Module L — Primary Review (Round 1)

- Reviewer: primary-review-3 (canary items 001-005 originally reviewed by primary-review-canary)
- Reviewed at: 2026-07-27
- Total questions: 30 (5 canary + 25 new)
- Answer agreement rate: 28/30 (93.3%)
- PASS: 27, MINOR: 3, MAJOR: 0, BLOCKER: 0
- Sources unsupported: 0
- Version scope insufficient: 0 (all `version_sensitive` questions carry `frameworkVersionScope` + `verifiedAt`)
- Hardware conditions sufficient: 30/30
- Explanation label mismatches: 0
- Measured performance claims: **0** (all profileData is `analytical`, none is `measured` — appropriate for a repository without GPU access)

## Summary

Module L ("Profiling / Benchmark / Debug / Correctness") covers Nsight Systems / Nsight Compute / PyTorch Profiler interpretation, CUDA event vs CPU timing, benchmark warmup, roofline analysis, memory-BW/launch-overhead/register-pressure/occupancy diagnoses, tolerance and golden testing, differential testing, non-determinism sources, NaN triage, shape coverage, torch.compile graph-break / recompile / dynamic-shape regression analysis, IR dump interpretation, generated Triton code, compile-time as benchmark axis, and end-to-end vs microbenchmark.

**All profile-data / performance-claim** classifications are correctly `analytical` (not `measured`). This is essential — the repository has no GPU access, so any `measured` claim would be a BLOCKER. Zero such claims → clean pass on that axis.

**No BLOCKER, no MAJOR.** Two MINOR distractor-uniqueness disputes (L-DYNREG-013 option B; L-DETERM-017 option A) and one MINOR arithmetic wording issue (L-ROOFLINE-021 option D). The canary 5 (L-001..L-005) re-affirms PASS.

## Profile-data / analytical claims audit

Every question with profileData or numerical claim is analytical or derived from a clearly-stated hypothetical:

| Question | Claim source | Verdict |
|---|---|---|
| L-LAUNCH-001 | Hypothetical Nsight timeline; math (1000 × 20 µs = 20 ms) self-consistent | ✓ analytical |
| L-NCU-004 | Hypothetical Nsight Compute metrics; A100 HBM analytical | ✓ analytical |
| L-TIMING-002 | Hypothetical benchmark output (0.008 vs 3.412 ms) | ✓ analytical |
| L-WARMUP-005 | Hypothetical event.elapsed_time output (43.2 vs 3.4 ms) | ✓ analytical |
| L-CPUEVT-006 | Approach comparison (i/ii/iii/iv); analytical | ✓ analytical |
| L-ASYNC-007 | Hypothetical timing output (0.041 ms) | ✓ analytical |
| L-STREAM-008 | Hypothetical elapsed values (2.5 ms vs 100 ms) | ✓ analytical |
| L-BREAKLOG-027 | Hypothetical TORCH_LOGS output; conclusions derived | ✓ analytical |
| L-CACHE-025 | Hypothetical Nsight L1/L2 metrics | ✓ analytical |
| L-DYNREG-013 | Hypothetical torch.compile trace (500 requests) | ✓ analytical |
| L-E2E-020 | Amdahl's law arithmetic | ✓ analytical |
| L-GENCODE-029 | General Triton codegen inspection | ✓ analytical |
| L-NCU / L-OCC / L-REGP / L-WARPSTALL / L-ROOFLINE | Hypothetical Nsight metrics; analytical derivations | ✓ analytical |
| L-PROF-030 | Tool-choice conceptual | ✓ (no perf claim) |
| Others (L-DETERM, L-DIFFTEST, L-GOLDEN, L-NAN, L-RACE, L-SHAPECOV, L-TOL, L-TOL2, L-COMPTIME, L-ACCREG, L-IRDUMP, L-PCTL, L-NOISE) | Conceptual/analytical | ✓ |

**Zero measured claims.** All hypothetical profileData values (1000 kernels × 20 µs = 20 ms; 26 GB weight read at 2 TB/s ≈ 13 ms; 42.6 ms p95; per-token KV 128 KB; etc.) are internally consistent with the analytical model they invoke. No BLOCKER on the "measured without GPU" gate.

## Version-sensitive coverage

| Question | Framework scope | verifiedAt |
|---|---|---|
| L-BREAKLOG-027 | PyTorch 2.3 ~ 2.5 | 2026-07-26 |
| L-DYNREG-013 | PyTorch 2.3 ~ 2.5 | 2026-07-26 |
| L-GENCODE-029 | PyTorch 2.3 ~ 2.5 | 2026-07-26 |
| L-IRDUMP-028 | PyTorch 2.3 ~ 2.5 | 2026-07-26 |

Other L questions correctly declared `stable_principle` (async launch trap, roofline, occupancy, register pressure, warp stall categories on Ampere/Hopper, ncu metric names, event timing semantics, differential/golden testing methodology, Amdahl's law, statistics).

## Answer disagreements

### L-DYNREG-013: MINOR (uniqueness dispute)
- Independent: [A, B, C, D]
- Official: [A, C, D]
- Option B is a conditional/general statement ("workloads with MORE distinct shapes than the cache limit WOULD trigger even more churn... higher shape diversity WOULD make the situation worse if not addressed"). Read as a general principle: correct. Read as a claim about the CURRENT 8-shape workload's state: not evidenced (cache is at limit but not evicting). The official chose the second reading. Both readings are defensible. Suggested repair: tighten B so it makes a specific claim of current thrashing (obviously wrong) rather than a general "if not addressed" statement.

### L-DETERM-017: MINOR (uniqueness dispute)
- Independent: [A, B, D]
- Official: [B, D]
- Option A: "changing the number of GPU threads (e.g., via CUDA_VISIBLE_DEVICES or a different job allocation) can change parallel reduction shape and thus low-order bits; determinism is only guaranteed for identical execution configurations." The CUDA_VISIBLE_DEVICES example is imprecise (that variable controls device visibility, not per-kernel thread count within a single GPU). However, "different job allocation" and the closing "determinism only guaranteed for identical execution configurations" ARE canonical caveats. Official rejects A on the imprecise example; I accepted it based on the general principle. Answer uniqueness disputable. Suggested repair: replace "CUDA_VISIBLE_DEVICES" example with "different device count in multi-GPU data-parallel training" to make A cleanly correct → update official to {A, B, D}; OR sharpen A to be obviously wrong.

### L-ROOFLINE-021: MINOR (arithmetic in the correct option)
- Independent: [D] (agree)
- Official: [D] (agree)
- Wording issue: Option D says "AI ≈ 0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)". The kernel does `out[i] = 3.0*in[i] + 2.0f` → 1 FMA = 2 FLOPs per element. Memory: 4-byte read + 4-byte write per element = 8 bytes/element. True AI = 2/8 = 0.25 FLOP/byte, not 0.125. The "16 bytes per element pair" wording appears to double-count (perhaps summing read+write for two adjacent elements). The roofline **conclusion** (well below ridge point 9.75, memory-bound, expected wall time = 128 MB / 2 TB/s ≈ 64 µs peak — matches D's 62 µs) is right and self-consistent under either 0.25 or 0.125 (both far below ridge). Impact: the diagnosis is correct; the AI number is off by 2x. Options A and C use 0.125 and 0.5 as distractors — the truly correct AI (0.25) is not among the options. Suggested repair: change D's "0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)" to "0.25 FLOP/byte (2 FLOPs / 8 bytes per element = 4 read + 4 write)".

## Highlights

- **Async timing family (L-ASYNC-007, L-CPUEVT-006, L-STREAM-008, L-TIMING-002)**: covers all canonical async timing traps — missing synchronize (CPU timer captures dispatch only), event-on-wrong-stream (default-stream synchronize propagates), events on target stream vs device-wide sync. Distractors correctly parametrize the failure modes.
- **Nsight Compute family (L-NCU-004, L-OCC-022, L-REGP-024, L-WARPSTALL-023, L-CACHE-025)**: correctly interprets DRAM throughput + SM utilization + top stall reason. Distinguishes "occupancy 0.30 with 96% SM util = intentional trade for high-perf GEMM" from "occupancy 0.12 with high L1 local-load traffic + spill lines = register-pressure spill". Correctly rejects the "raise occupancy always helps" misconception.
- **Roofline (L-ROOFLINE-021)**: quantitative AI computation from bytes and FLOPs; correctly places the elementwise kernel below the ridge and flags the 40 ms measurement as inconsistent with a memory-bound prediction of ~62 µs. (Modulo the 0.125 vs 0.25 arithmetic wording.)
- **Numerical correctness family (L-TOL-003, L-TOL2-011, L-GOLDEN-009, L-DIFFTEST-010)**: BF16 tolerance ~1e-2, FP16 GEMM K=1024 tolerance ~1e-2, independent-reference + fixed-seed + dtype-driven-tolerance golden discipline, differential testing with seed recording.
- **NaN / race triage (L-NAN-015, L-RACE-016)**: FP16 attention score overflow (exp(27.8) exceeds FP16 → inf → NaN in softmax division; fix = upcast to FP32 before softmax). Race in SMEM tree reduction from missing __syncthreads() on independent-warp-scheduling Volta+.
- **Non-determinism (L-DETERM-017)**: cross-block atomicAdd non-associativity; cuDNN benchmark mode; correctly rejects "cross-architecture bit-identity via deterministic flag" myth (A100→H100).
- **torch.compile trio (L-BREAKLOG-027, L-DYNREG-013, L-IRDUMP-028, L-GENCODE-029)**: graph break from data-dependent branches, shape guard failure/cache hit, dynamic shapes as remedy, IR dump for debugging fusion, Inductor codegen with autotune.
- **Statistics (L-NOISE-018, L-PCTL-019)**: median-with-tails preferred over mean for outlier-heavy distributions; N=100 insufficient for stable p99.
- **End-to-end vs microbenchmark (L-E2E-020)**: Amdahl's law arithmetic done correctly (4.7× kernel × 5% share = ~4% e2e). Correctly rejects "microbenchmark speedup composes multiplicatively" myth.
- **Compile time (L-COMPTIME-026)**: correctly identifies development workflows and auto-tuner cases where compile-time must be reported.

## Sources

All 30 questions cite Tier 1 sources (Nsight Systems docs, Nsight Compute docs, CUDA best practices guide, PyTorch profiler docs, PyTorch source (dynamo), TorchInductor design doc, PMPP4). No Tier 3 unique-support cases.

## Recommendation

Module L does not require repair before Round 2. Two MINOR uniqueness disputes (L-DYNREG-013, L-DETERM-017) and one MINOR arithmetic wording issue (L-ROOFLINE-021) can be addressed with option-text tightening — not blocking Round 2. All 30 questions can proceed to Verification.

## Top 3 most severe

1. **L-ROOFLINE-021** — MINOR — Option D's AI wording says "0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)"; true AI = 0.25 FLOP/byte. Roofline conclusion still correct; arithmetic off by 2x in the option text.
2. **L-DYNREG-013** — MINOR — Option B's conditional statement is arguably correct as a general principle; official rejects it based on the current-state reading. Answer uniqueness dispute.
3. **L-DETERM-017** — MINOR — Option A's CUDA_VISIBLE_DEVICES example is imprecise; the general "determinism only for identical execution configurations" claim is canonical. Answer uniqueness dispute.

(Canary items L-LAUNCH-001, L-TIMING-002, L-TOL-003, L-NCU-004, L-WARMUP-005 remain PASS.)
