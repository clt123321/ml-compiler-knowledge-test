# Module N — Primary Review (Round 1)

- **Reviewer**: primary-review-4
- **Module**: N (paper design, systems trade-offs, research judgement)
- **Question count**: 10
- **Date**: 2026-07-27

## Overall Result

| Metric | Value |
|---|---|
| Independent-vs-official agreement | **10 / 10 (100%)** |
| PASS | 10 |
| MINOR | 0 (with MINOR notes: 2 questions, all PASS) |
| MAJOR | 0 |
| BLOCKER | 0 |

**Verdict**: All 10 paper_design_intent / research-judgement questions **PASS**. Ready for Round 2 verification without repair.

## Methodology

- **Phase A (Blind)**: Reviewer answered every question strictly from stem + options + assumptions in `reviews/blind/N.json`. Independent answers stored in `reviews/round1/N-independent.json` before opening any files under `data/questions/N/**` or `data/content-cards/N/**`.
- **Phase B (Compare + Source)**: Cross-checked official answers, explanations, nonImplications, and sourceRefs against `references/SOURCE_REGISTRY.json` and against the reviewer's independent knowledge of each paper's stated design intent and evaluation scope.

## Three-principle scope audit

The brief demands strict enforcement of three principles for paper-based questions:

| Principle | Any violation in N? | Evidence |
|---|---|---|
| **Conclusions must be scoped** (no unconditional statements) | **No** | N-GSPMD-008 explicitly tests this via peak-vs-geomean and baseline dependence. N-QUANT-010 D pins wall-clock speedup to "efficient dequantized-GEMM kernel availability on target hardware". N-PYT2-009 anchors kernel-vs-e2e via Amdahl. N-VLLM-007 nonImplications state throughput numbers do not generalize. |
| **Peak vs geomean distinction** | **No** | N-GSPMD-008 dedicates its entire correctness structure to this distinction; option B says peak > geomean, option D (mathematical identity) is correctly marked wrong. |
| **Single-paper conclusions ≠ domain consensus** | **No** | N-QUANT-010 explicitly rejects combining SmoothQuant + GPTQ + AWQ into "universal claims" as an option; correct-answer options A/C explicitly cite scope-limitation. N-GSPMD-008 C says paper numbers "require additional justification" to transfer. |

**Additional discipline checks passed**:
- **Kernel-level ≠ e2e**: N-PYT2-009 (option C) explicitly teaches this using Amdahl's law + graph-break framing.
- **Compile time not ignored**: N-TVM-002 explicitly names measurement wall-clock time as a trade-off in the nonImplications; N-ANSOR-003 is entirely about tuning-budget allocation. Neither ignores compile-time cost.
- **Precision confusion (FP16 vs FP32)**: not surfaced in these 10 questions (belongs to H-quant / F-kernel modules). No claim in N misrepresents mixed precision.
- **Shape/hardware conditioning**: N-FLASH-006 A explicitly says speedup is "largest in the memory-bound regime (long sequences)" — correctly Shape/hardware-conditioned.

## Coverage of paper-specific accuracy priorities

| Paper | Question | Correctness of design-intent framing |
|---|---|---|
| Halide | N-HALIDE-001 | Correct: separates algorithm from schedule for retargetable optimization. Matches Ragan-Kelley et al. §1–§3. |
| TVM | N-TVM-002 | Correct: measurement + learned cost model motivated by hard-to-model microarchitectural effects (§4–§5). |
| Ansor | N-ANSOR-003 | Correct: §5 task scheduler = non-uniform budget allocation guided by marginal-improvement × e2e contribution. |
| MLIR | N-MLIR-004 | Correct: multi-level dialects + progressive lowering + shared infrastructure. Complements LLVM, does not replace it. |
| Triton | N-TRITON-005 | Correct: tile-level abstraction, compiler emits per-thread PTX. Targets GPUs (correctly rejects "CPUs/TPUs only" distractor). |
| FlashAttention | N-FLASH-006 | Correct: block-by-block SRAM + online softmax + no N×N in HBM + Θ(N²·d/M) HBM traffic + exact (up to FP ordering). Critically, option B (storing N×N for backward) is correctly marked WRONG — a classic misconception distractor. |
| vLLM | N-VLLM-007 | Correct: KV-cache internal + external fragmentation is the target problem. FLOPs unchanged; KV cache preserved (just paged). |
| GSPMD | N-GSPMD-008 | Correct: this question is *about* interpretation discipline (peak/geomean/baseline scope), not about a specific GSPMD speedup number. |
| SmoothQuant / GPTQ / AWQ | N-QUANT-010 | Correct: three legs (A/C/D) all reflect scope discipline; D anchors wall-clock speedup to kernel availability on target hardware. |
| PyTorch 2 | N-PYT2-009 | Correct: kernel-vs-e2e Amdahl argument. `version_sensitive` + `frameworkVersionScope` + `verifiedAt` populated. |

## Per-question findings

### N-HALIDE-001 — PASS
Independent: [C]; Official: [C]. Correctly identifies the algorithm/schedule separation as enabling target-portable re-scheduling without semantic change. `nonImplications` correctly qualify that not every schedule is beneficial and that Halide's schedule language is not universally complete. No issues.

### N-TVM-002 — PASS
Independent: [B]; Official: [B]. Faithfully captures the paper's argument that closed-form models cannot rank fine-grained candidates on modern hardware. `nonImplications` explicitly acknowledge autotuning wall-clock cost as a trade-off. No issues.

### N-ANSOR-003 — PASS
Independent: [A, B]; Official: [A, B]. Correctly restricts the task scheduler to compile-time tuning-budget allocation (not runtime dispatch, C) and rejects fabricated policy floors (D). Source: PAPER:ansor §5. No issues.

### N-MLIR-004 — PASS
Independent: [C]; Official: [C]. Multi-level dialects + progressive lowering + shared infrastructure. Correctly notes MLIR complements LLVM (option D is properly marked wrong). No issues.

### N-TRITON-005 — PASS
Independent: [D]; Official: [D]. Tile-level abstraction with compiler-emitted per-thread PTX. `nonImplications` acknowledge Triton doesn't beat hand-tuned CUDA on every kernel and that users still reason about block shapes / memory access patterns. No issues.

### N-FLASH-006 — PASS (with MINOR note)
Independent: [A, C, D]; Official: [A, C, D]. Three-correct-legs structure hits IO-awareness (C), memory-bound scope (A), and exactness (D). Option B (storing N×N for backward) is a critical FlashAttention misconception, correctly marked WRONG. `performanceClaim.hardwareDependent=true` with scope "attention on GPU with sequence length N and head dim d; comparison against a naive unfused baseline" — well-scoped.
- **MINOR (scope)**: consider adding an explicit nonImplication noting FlashAttention-2 refines backward recomputation but still does not store N×N. This preempts readers over-generalizing option D wording to later versions. Not a correctness issue — the question is explicitly scoped to "FlashAttention (v1)" in both stem and `softwareContext.framework`.

### N-GSPMD-008 — PASS
Independent: [B, C]; Official: [B, C]. This is the peak-vs-geomean-and-baseline discipline question. All four options are semantically well-formed; A and D are mathematically wrong (baseline-independence claim; peak == geomean). No issues.

### N-PYT2-009 — PASS (with MINOR note)
Independent: [C]; Official: [C]. Kernel-vs-e2e Amdahl bound explicitly framed with graph breaks and non-compiled subgraphs.
- **MINOR (version-scope)**: `softwareContext.stability = version_sensitive` with `frameworkVersionScope = "PyTorch 2.x as reported in the paper"` and `verifiedAt = 2026-07-26`. The version_sensitive label is defensive but the correctness of C is version-stable (Amdahl argument). Acceptable as-is; no relaxation needed.

### N-QUANT-010 — PASS
Independent: [A, C, D]; Official: [A, C, D]. Textbook scope discipline over three quantization papers. Option B (4-bit always ≥3× e2e speedup regardless of hardware/kernel) is exactly the overclaim the module is designed to detect. Sources cite all three papers (SmoothQuant §3–§4, GPTQ §4, AWQ §4–§5). No issues.

### N-VLLM-007 — PASS
Independent: [A]; Official: [A]. KV-cache internal+external fragmentation framing. `nonImplications` correctly note that vLLM's speedup comes from larger feasible batch (not a faster attention kernel) and that throughput numbers do not generalize to arbitrary hardware/workloads. No issues.

## Global N-module observations

- **No论文数字被跨平台泛化 (no paper number cross-platform generalized)**: no N question quotes a specific speedup number as a stable claim. Only N-FLASH-006 has `performanceClaim.present=true`, and it's scoped to "GPU with sequence length N and head dim d" with `hardwareDependent=true`. Good.
- **No kernel-level speedup written as e2e**: N-PYT2-009 exists *specifically to teach against this error*.
- **No compile-time cost ignored**: N-TVM-002 and N-ANSOR-003 both surface tuning wall-clock time in `nonImplications` / stem framing.
- **No single-paper conclusion elevated to "domain consensus"**: N-QUANT-010 A/C explicitly resist this; N-GSPMD-008 C explicitly resists this in general.
- **Answer positions distributed reasonably** across A/B/C/D for the six single-choice items.
- **Source refs**: all Tier 2 (papers) or Tier 1/2 official docs; no Tier-3-only anchoring. All refs resolve in `references/SOURCE_REGISTRY.json`.

## Recommendation

- **No repair required for N.**
- All 10 questions are eligible to proceed to Round 2 (Verification).
- Two MINOR notes above are optional tightenings; they do not gate promotion.

## Confidence

The reviewer's independent Phase-A answers match all 10 official answers with high confidence. Given the paper_design_intent archetype and the strict scope discipline evident in every N question's `nonImplications`, this module is well-authored and does not require a second-pass repair before verification.
