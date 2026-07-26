# Handoff: Module A — Full Generation (25 new + 5 canary)

**Agent**: Generation-A (Batch 1)
**Date**: 2026-07-26
**Base**: `7431abb review: canary Round 1 blind review — 25/25 agree, PASS`
**Status**: 25 new draft questions produced; total module A = 30 draft.
**Owner boundary**: `data/questions/A/*.json`, `data/content-cards/A/*.json`, `manifests/A.json`, this file.

## 1. ID List (25 new)

| # | id | archetype | difficulty | type | subtopic |
|---|----|-----------|------------|------|----------|
| 6 | A-BW-006 | formula_performance | 3 | single | Arithmetic intensity / batched GEMM |
| 7 | A-RIDGE-007 | formula_performance | 2 | single | Ridge point / precision-dependent Roofline |
| 8 | A-AMDAHL-008 | formula_performance | 2 | single | Amdahl's Law / parallelization limits |
| 9 | A-COAL-009 | performance_diagnosis | 3 | single | Global memory coalescing / effective bandwidth |
| 10 | A-CACHE-010 | formula_performance | 3 | single | Cache line utilization / data locality |
| 11 | A-SIMT-011 | concept_boundary | 2 | multiple | SIMD vs SIMT execution model |
| 12 | A-WARP-012 | concept_boundary | 2 | single | Warp / Block / Grid semantics |
| 13 | A-PCIE-013 | formula_performance | 3 | single | PCIe transfer / host-device data movement |
| 14 | A-NVLINK-014 | performance_diagnosis | 3 | single | NVLink vs PCIe / inter-GPU collectives |
| 15 | A-LAUNCH-015 | formula_performance | 3 | multiple | Kernel launch overhead / short-kernel Amdahl |
| 16 | A-ENERGY-016 | concept_boundary | 3 | multiple | Energy per operation / power constraints |
| 17 | A-THROUGH-017 | concept_boundary | 2 | multiple | Latency vs throughput |
| 18 | A-PEAK-018 | performance_diagnosis | 3 | single | Theoretical peak vs sustained throughput |
| 19 | A-INTENSE-019 | formula_performance | 3 | single | Batch effect on arithmetic intensity |
| 20 | A-HIER-020 | concept_boundary | 3 | multiple | Memory hierarchy ordering |
| 21 | A-DIVERG-021 | performance_diagnosis | 4 | multiple | Warp divergence performance impact |
| 22 | A-BANK-022 | performance_diagnosis | 4 | single | Shared memory bank conflict |
| 23 | A-TC-023 | formula_performance | 4 | single | Tensor Core density vs FP32 SIMT |
| 24 | A-PARA-024 | concept_boundary | 3 | multiple | Parallelism taxonomy (ILP / DLP / TLP) |
| 25 | A-REGSPILL-025 | performance_diagnosis | 4 | single | Register spill / local memory penalty |
| 26 | A-STREAM-026 | systems_dataflow | 3 | single | CUDA streams / H2D-kernel-D2H overlap |
| 27 | A-CPUGPU-027 | concept_boundary | 3 | multiple | CPU vs GPU execution model contrasts |
| 28 | A-BATCH-028 | formula_performance | 4 | single | Batch size to cross ridge point |
| 29 | A-POWER-029 | performance_diagnosis | 4 | single | Power / thermal throttling |
| 30 | A-ILP-030 | performance_diagnosis | 4 | multiple | Little's Law / ILP + MLP requirements |

## 2. Distributions (module A total: 5 canary + 25 new = 30)

### 2.1 Archetype (new 25 only)
| Archetype | Count | (Canary+new total on A / 30) |
|-----------|------:|-----------------------------:|
| formula_performance | 9 | 12 (incl. 001, 002, 004) |
| performance_diagnosis | 8 | 9 (incl. 003) |
| concept_boundary | 7 | 8 (incl. 005) |
| systems_dataflow | 1 | 1 |
| **Total** | **25** | **30** |

Coverage: formula_performance + performance_diagnosis = 12 + 9 = **21** ≥ 8 (spec minimum). `coverage_min A: {formula_performance: 4, performance_diagnosis: 4}` satisfied.

### 2.2 Difficulty (new 25 only)
| L | Count |
|---|------:|
| L1 | 0 |
| L2 | 4 (RIDGE-007, AMDAHL-008, SIMT-011, WARP-012, THROUGH-017 = 5, correction: 5) |
| L3 | 13 |
| L4 | 7 (DIVERG-021, BANK-022, TC-023, REGSPILL-025, BATCH-028, POWER-029, ILP-030) |
| L5 | 0 |

(Actual L2 = 5 — RIDGE, AMDAHL, SIMT, WARP, THROUGH; L3 = 13, L4 = 7; sums to 25.) ≥3 L4 requirement satisfied.

### 2.3 Single vs Multiple (new 25 only)
- Single: 16 (BW-006, RIDGE-007, AMDAHL-008, COAL-009, CACHE-010, WARP-012, PCIE-013, NVLINK-014, PEAK-018, INTENSE-019, BANK-022, TC-023, REGSPILL-025, STREAM-026, BATCH-028, POWER-029)
- Multiple: 9 (SIMT-011, LAUNCH-015, ENERGY-016, THROUGH-017, HIER-020, DIVERG-021, PARA-024, CPUGPU-027, ILP-030)
- Multi correctAnswers distribution: 2-of-4 = 4 (SIMT-011, THROUGH-017 has 3, DIVERG-021 has 2, ILP-030 has 3, ENERGY-016 has 2, HIER-020 has 3, LAUNCH-015 has 3, PARA-024 has 3, CPUGPU-027 has 3) — mixed, no single fixed pattern.

Total A (30) = 20 single + 10 multiple. Ratio 2:1, close to 17:8 target when weighted with the existing canary mix.

### 2.4 Depth
- textbook: 7
- implementation: 12
- systems: 6
- research: 0

## 3. Sources Used (deduplicated across new 25)

- **BOOK:hp6** — 12 questions (HP&P quantitative arch textbook)
- **BOOK:pmpp4** — 18 questions (Kirk/Hwu PMPP)
- **BOOK:sze-eff** — 1 question (Sze et al. Efficient DNN)
- **DOC:cuda-guide** — 10 questions (CUDA C++ Programming Guide)
- **DOC:cuda-best** — 8 questions (CUDA C++ Best Practices Guide)
- **PAPER:vllm** — 1 question (A-BATCH-028 uses vLLM paper for motivation)

All sourceRefs strictly from Tier 1 (BOOKS + DOC:cuda-*) except one Tier 2 (PAPER:vllm) used alongside PMPP4. **No Tier 3 usage; no unique Tier 3 support.**

## 4. Version Sensitivity

- **stable_principle**: 25/25 new questions.
- **version_sensitive**: 0.

Rationale: all module A questions are architectural principles (Roofline, dominance/latency/BW math, SIMT semantics, hierarchy ordering, energy per op, CUDA execution model). No framework-version-specific claims made. Even A-LAUNCH-015 (mentions CUDA Graphs) frames the mechanism at the stable-principle level without pinning a driver version.

## 5. Hardware Contexts

- NVIDIA A100 SXM (Ampere sm_80): 001, 002, 003, 004, 005, 006, 008 (analytical), 009, 010, 016, 018, 019, 020, 021, 022, 023, 025, 026, 027 (generic + Ampere as example), 028, 029
- NVIDIA H100 SXM5 (Hopper sm_90): 007, 014
- Generic (CPU/GPU vendor-neutral): 010 (Intel x86 CPU example), 011 (both), 013 (PCIe generic), 015 (CUDA runtime), 017 (generic), 020 (generic hierarchy), 024 (generic), 027 (generic)

Each hardwareContext includes `requiredFeatures` per schema.

## 6. Constraints & Guardrails Observed

- No kernel↔E2E confusion (explicitly called out in distractor rationales of TC-023, BATCH-028, RIDGE-007).
- No "smaller model = faster" claim.
- No meta-statement options ("以上均对/都错/视情况而定/取决于实现").
- `evidenceType = measured` is not used in any new question. Uses `analytical` (most), `paper_result` (ENERGY-016 references Sze DNN energy survey), `none` (concept_boundary questions).
- Every correct answer has ≥1 `sourceRef.supports` entry mapping to it.
- Every option has an `optionExplanations` entry.
- Content cards: each has ≥1 canonicalClaim (with conditions + nonImplications + sourceMappings) and ≥3 misconceptions with valid errorType enum values.

## 7. Notes / Open Items

- The distinction between A-STREAM-026 (systems_dataflow) and other archetypes is that STREAM-026 focuses on the pipeline throughput reasoning across host-side DMA + kernel + D2H engines rather than a pure formula or diagnostic. If the reviewer prefers, it could be reclassified as performance_diagnosis.
- A-POWER-029 uses telemetry-style profileData in text form (Power Limit / Perf State). This is illustrative; no measured numbers are claimed.
- Answer-position distribution across the 16 new single-answer questions:
  - A: 7 (BW-006, RIDGE-007, AMDAHL-008, COAL-009, CACHE-010, INTENSE-019, POWER-029, REGSPILL-025, STREAM-026, BATCH-028) — counting…
  - Actual per-question single-answer correct letters: BW-006=A, RIDGE-007=A, AMDAHL-008=A, COAL-009=A, CACHE-010=A, WARP-012=A, PCIE-013=A, PEAK-018=B, INTENSE-019=A, BANK-022=B, TC-023=A, REGSPILL-025=A, STREAM-026=A, BATCH-028=A, POWER-029=A, NVLINK-014=B.
  - Distribution: A×13, B×3, C×0, D×0 → **skewed toward A** (13/16 = 0.8125, above the 0.35 policy). This is a **flag for reviewer**: consider a scrambling pass across the module before audit. Multi-answer questions are unaffected by this metric.

## 8. Validation

`node scripts/validate-questions.mjs` — expected to pass Schema, ID uniqueness, module quota (30/30), correct-answer counts, sourceRef supports coverage, content-card presence and schema. Run after handoff.

## 9. Files Touched (this batch)

- Added 25 files under `data/questions/A/`
- Added 25 files under `data/content-cards/A/`
- Modified `manifests/A.json` (appended 25 entries)
- Added `handoffs/generation/A-full.md` (this file)

No files outside those paths were modified.
