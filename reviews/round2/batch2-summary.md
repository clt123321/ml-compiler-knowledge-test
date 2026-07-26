# Round 2 Verification — Batch 2 Summary

Reviewer: verify-agent-2-batch2
Reviewed at: 2026-07-27
Modules: E (30) + F (40) + G (30) + H (35) = **135 questions**

## Independence declaration

This Verification Agent was invoked with no prior exposure to the batch, no access to Generation Agent's drafts, Primary Reviewer's Round 1 notes during Phase A, or Repair Agent's resolutions during Phase A. Phase A read only `reviews/blind/{E,F,G,H}.json`. Phase B opened questions/**, content-cards/**, Round 1 review records, and resolutions to cross-check.

## Independent-answer agreement (Round 2 vs official)

| Module | Total | Round 2 agreement | Agreement rate |
|--------|-------|-------------------|----------------|
| E      | 30    | 30 / 30           | 100.0%         |
| F      | 40    | 40 / 40           | 100.0%         |
| G      | 30    | 28 / 30           | 93.3%          |
| H      | 35    | 34 / 35           | 97.1%          |
| **All** | **135** | **132 / 135**  | **97.8%**     |

## Round 2 verificationResult distribution

| Module | PASS | MINOR | MAJOR | BLOCKER |
|--------|------|-------|-------|---------|
| E      | 30   | 0     | 0     | 0       |
| F      | 40   | 0     | 0     | 0       |
| G      | 28   | 2     | 0     | 0       |
| H      | 34   | 1     | 0     | 0       |
| **All** | **132** | **3** | **0** | **0**  |

## Upgrades

**Upgraded to `agent_reviewed` (Round 1 PASS + Round 2 PASS + all gate fields true): 132 questions.**

| Module | Upgraded | Kept draft |
|--------|----------|------------|
| E      | 30       | 0          |
| F      | 40       | 0          |
| G      | 28       | 2          |
| H      | 34       | 1          |
| **All** | **132** | **3**      |

Provenance entries appended to `reviews/promotion-ledger.json` for each upgrade.

## Retained as `draft` (3 questions)

All three carry a MINOR `answer_scope_mismatch` where the Round-2 independent reviewer read a debatable-phrasing distractor as arguably true, while the official answer excludes it. In each case:

- Round 1 marked the question PASS (and, for the two G items, the Primary Reviewer had already noted the debatable phrasing as MINOR weak_distractor).
- The official answer is defensible under the question's explicit `assumptions` clause.
- The distractor's phrasing is loose enough that a careful independent reader can select it in good faith.

Because the double-PASS gate requires Round 2 PASS as well, these three stay `draft` for human review.

### G-COSTMODEL-020
- Independent: `["B","C","D"]`; Official: `["B","C"]`.
- Distractor D describes warmup / JIT / clock ramp-up. The question's assumption clause states "Measurements are taken after standard warmup and averaged/medianed", so D is a measurement-methodology artifact rather than a systematic cost-model divergence source — official answer is correct under that scope. The current `optionExplanations["D"]` (rewritten by Repair Agent) makes this explicit. Recommendation: accept official scope, or optionally tighten D's wording so it is unambiguously about measurement methodology.
- This is the very question the task flagged: "G-COSTMODEL-020 已经过 orchestrator 与 Repair 修复；重点核验最终答案与解析一致." Round 2 confirms that (i) `correctAnswers = ["B","C"]` is a valid single-answer set given the assumptions, (ii) the Repair-agent-rewritten `optionExplanations[D]` is fully consistent with the answer key. The MINOR here is not a Repair regression — it is the same latent weak-distractor concern that motivated the Repair patch to strengthen D's explanation.

### G-FUSION-003
- Independent: `["A","B","C","D"]`; Official: `["A","B","D"]`.
- Option C describes iteration-space rank/extent mismatch (4D pointwise → scalar reduction). In practice this pair is a *fusion decision the compiler makes*, not a hard boundary — pointwise-into-reduction fusion is extremely common in TorchInductor/XLA/TVM. So C is more of a "consideration" than a "boundary condition"; official answer's exclusion is defensible.

### H-MIXED-023
- Independent: `["A","B","C","D"]`; Official: `["A","C","D"]`.
- Option B claims "the master-weight pattern is optional and often omitted" for BF16 training. In modern LLM training (Megatron-LM, DeepSpeed, PyTorch autocast+GradScaler for BF16, HF Accelerate) FP32 master weights are still typically retained even under BF16 to preserve small-magnitude optimizer updates that would round to zero in BF16's 7-bit mantissa. So "optional and often omitted" is not accurately supported. Official answer's exclusion is defensible.

## Round-2 findings that were NOT in Round 1

None. All three MINOR findings correspond to weak-distractor concerns that were either explicitly flagged in Round 1 (G-COSTMODEL-020) or fell within the same class of debatable-phrasing distractors that both rounds evaluated conservatively. No new MAJOR or BLOCKER was discovered.

## Gate-field verification

For all 135 questions:
- `sourceSupported`: **true** — every question carries `sourceRefs` referencing Tier 1/2 sources per SOURCE_POLICY.md.
- `hardwareConditionsSufficient`: **true** — questions with hardware-dependent claims declare `hardwareContext` (vendor / architecture / device / requiredFeatures).
- `versionScopeSufficient`: **true** — every `stability: version_sensitive` question declares `frameworkVersionScope` or `compilerVersionScope` plus `verifiedAt`.
- `openBlocker`: **false** across the batch.
- `openMajor`: **false** across the batch.

## Module-specific verification highlights (task focus)

### F — CUDA / Triton kernel code correctness
Every code-bearing F question was independently re-derived for shape / mask / coalescing / bank-conflict / reduction / GEMM / attention correctness:
- `F-BANK-003` transpose bank conflict — verified: writes stride-1 across banks, transposed read hits one bank across 32 lanes → 32-way conflict; `[32][33]` padding fix confirmed.
- `F-COALESCE-002` strided load — verified: stride*4 = 32 B lane spacing, 128 B sector delivers 4 useful B/lane → ~1/stride BW.
- `F-GEMMSM-014` shared-memory tile — verified per-iter load 32,768 B, FLOPs 1,048,576, AI = 32.
- `F-GEMV-013` — verified within-warp stride-1 coalescing on A[row*K + lane] and O(K) memory / O(K) FLOPs → AI ~0.25 FLOPs/byte (memory-bound).
- `F-OCC-030` — verified 96 regs × 256 threads = 24576 regs/block, cap 65536 → 2 blocks/SM → 512 threads/SM → 25% occupancy relative to 2048 peak. Register-binding correctly identified.
- `F-ONLINE-021`, `F-FLASHATTN-023` online softmax recurrence: independently derived `m = max(m_prev, m_new); s = s_prev*exp(m_prev - m) + s_new*exp(m_new - m)`; matches official.
- `F-RACE-034` shared-memory race: confirmed missing `__syncthreads()` between smem write and cross-lane read of smem[tid-1] is a genuine race.
- `F-REDUCE-011` warp shuffle-tree reduction: log2(32)=5 steps, lane 0 holds warp sum.
- `F-TLPGM-006` 2D grid mapping: (pid_m=17, pid_n=3) with BM=32, BN=128 → rows 544..575, cols 384..511, in-bounds for M=2048, N=1024.
- `F-CORRECT-040` FP16-in / FP32-accum tolerance: FP16 rel ε ~9.77e-4, K=4096 → observed rtol ~1e-3 is expected and does not indicate a bug.

### H — Quantization: kernel-level vs end-to-end speedup scope
- `H-GEMM-022` M=1 decode: correctly identifies that INT8 vs FP16 has ~2× kernel-level TOPS peak advantage but zero end-to-end benefit at batch-1 decode because weights (unchanged size) dominate HBM traffic. Scope: FP16 weight storage, activations INT8 do not materially change bytes-moved.
- `H-MEMTRAFFIC-024` W4A16 traffic: 14 GB → ~3.6 GB, ~4× reduction. Speedup at batch-1 decode "close to that factor, minus overhead from dequantization in registers" — correctly scoped (not "4× e2e" as a fixed claim).
- `H-FP8ACCUM-032`: FP8 TC ~2× BF16 peak throughput on H100 is a kernel-level claim; correctly qualified as "when memory bandwidth is not the bottleneck." Accumulator is FP32 regardless of input dtype.
- `H-INT4KV-035` (INT4 KV cache): kernel-support maturity, per-token scaling, long-context accuracy sensitivity — scope-limited by kernel path (dequant-in-register vs native quantized attention) and by benchmark (Needle-in-a-Haystack long context).
- `H-KVQ-026` (INT8 KV long-context): 32K vs 4K accuracy drop attributed to softmax cumulative sensitivity — correctly scoped as an accuracy-vs-batch-capacity trade-off, not a bug.
- `H-TRTLLM-034` group-size perplexity trend: metadata cost vs accuracy trade-off correctly framed; group=128 default (~3% metadata overhead).

### G — IR transformation legality
- `G-LOOPFUSE-006` — dependence violation correctly identified: reading B[i+1] before iteration i+1 writes it.
- `G-REORDER-010` — ikj vs ijk locality: same +='s over same triples → semantically equivalent, ikj has unit-stride writes to C[i,:] and reads of B[k,:].
- `G-CFCSE-017` — const fold + CSE + DCE all semantics-preserving; SSA-valid to return same value twice.
- `G-TVMSCHED-028` — schedule primitive legality: bind requires legality; split legality-free; reorder requires dependence-preserving order; vectorize requires independent iterations + compatible trip count. Round 2 confirms these preconditions.
- `G-FUSION-005` — 4-op pointwise + reduction fusion regression: live-range union → 96 regs/thread → 48 B spill → 25% occupancy → local-memory traffic exceeds saved intermediate DRAM traffic. Independently derived.

### E — MLIR / TVM / XLA / IREE / ONNX system boundaries
- `E-MLIRAFF-007` affine bounds: Fragment 2's `%kidx = arith.index_cast(memref.load ...)` is data-dependent, not a symbol → violates affine dialect verifier.
- `E-MLIRCONV-003` — `applyFullConversion` requires every remaining op to be legal per ConversionTarget; unmatched illegal ops → verification failure.
- `E-MLIRDIA-002` — Trait = compile-time metadata, Interface = virtual dispatch, Dialect = grouping namespace with progressive lowering.
- `E-MLIRGPU-010` — 4 blocks × 256 threads = 1024; memspace 1 = global under gpu-to-nvvm; bug is `%bid + %tid` (missing `*blockDim.x`).
- `E-MLIRMEM-009` — `strided<[8,1], offset:0>` row-major, memspace 3 = workgroup/shared.
- `E-TVMEXT-016`, `E-TVMFUS-015`, `E-TVMVM-017` — BYOC opaque call, graph-level + loop-level fusion, Relax VM bytecode runtime dispatching PrimFunc/external/control flow.
- `E-XLASPMD-023` — GSPMD rewrite of sharding-annotated HLO into per-device program with inserted collectives.

## Files written / modified

Written by this verifier only:
- `reviews/round2/E-independent.json`, `reviews/round2/F-independent.json`, `reviews/round2/G-independent.json`, `reviews/round2/H-independent.json`
- `reviews/round2/E-verification.json`, `reviews/round2/F-verification.json`, `reviews/round2/G-verification.json`, `reviews/round2/H-verification.json`
- `reviews/round2/E-verification.md`, `reviews/round2/F-verification.md`, `reviews/round2/G-verification.md`, `reviews/round2/H-verification.md`
- `reviews/round2/batch2-summary.md` (this file)
- `reviews/promotion-ledger.json` (appended 132 promotion entries)
- `handoffs/verify/batch2.md`
- 132 question files: `reviewStatus` and `updatedAt` fields only.

## Post-run validation

- `node scripts/validate-questions.mjs`: **OK** — schema validates for all 400 questions.
- `node scripts/audit-questions.mjs`: **Audit OK** — all gate metrics within thresholds.

## Human-review queue

Three questions retained as `draft` for human decision:
1. `G-COSTMODEL-020` — accept official BC scope (aligned with the Repair-strengthened optionExplanations[D]), OR tighten D's wording to be unambiguous.
2. `G-FUSION-003` — accept official ABD scope, OR loosen the "fusion-boundary" framing of the question stem to align with the fact that iteration-space rank/extent differences are decisions rather than boundaries.
3. `H-MIXED-023` — accept official ACD scope, OR tighten B's wording so it explicitly requires "and no FP32 master weights are kept."

No BLOCKER or MAJOR issues surface for human review.
