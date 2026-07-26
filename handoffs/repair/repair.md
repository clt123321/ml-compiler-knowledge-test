# Repair Agent Handoff — Round 1 Repair

- **Agent**: repair-agent-round1 (Repair Agent, distinct from all generation subagents and Primary Reviewers 1-4)
- **Date**: 2026-07-26
- **Scope**: Fix all Primary Review Round 1 BLOCKER / MAJOR and systemic MINOR findings from `reviews/round1/{A..N}-review.json` + `batch{1,2,3,4}-summary.md`
- **Input**: Round 1 review reports (BLOCKER = 0, MAJOR = 24, systemic MINOR ≈ 46)
- **Output**: 73 questions modified across modules A, B, C, D, E, F, G, H, I, J, L; K, M, N left untouched (all PASS)

## Result Summary

| Category | Count | Description |
|---|---:|---|
| Poison-tail strip (C+D correct options) | 23 | Removed self-contradicting trailing "Under this reading … / In this account … / In this framing … / In this description … / In this interpretation …" paragraphs from correct-option text |
| Explanation label re-alignment (post-shuffle) | 45 | Rewrote top-level `explanation` to reference current post-shuffle option letters using canonical per-option template synthesized from `optionExplanations` + `correctAnswers`, preserving general-context prose from the original explanation where it did not contain letter-references |
| Substantive option-text tightening (MAJOR uniqueness dispute) | 1 | I-SPARSE-022 option C rewritten to be cleanly wrong via overclaim |
| Substantive option-text tightening (MINOR uniqueness dispute) | 3 | L-DYNREG-013 option B, L-DETERM-017 option A, H-MIXED-023 option B |
| Substantive arithmetic correction (MINOR) | 1 | L-ROOFLINE-021 option D + explanation rewritten with correct AI = 0.25 FLOP/byte |
| optionExplanations strengthening (MINOR) | 1 | G-COSTMODEL-020 option D explanation strengthened to frame warmup/JIT as measurement artifacts |
| **Total unique questions modified** | **73** | (I-SPARSE-022 double-bumped: v1→v3) |

## Per-module distribution

| Module | Modified | Findings addressed |
|---|---:|---|
| A | 1 | Batch 1 label mismatch (1) |
| B | 2 | Batch 1 label mismatch (2) |
| C | 14 | Batch 1 poison-tail (13) + Batch 1 label mismatch (1) |
| D | 10 | Batch 1 poison-tail (10) |
| E | 4 | Batch 2 label mismatch (4) |
| F | 7 | Batch 2 label mismatch (7) |
| G | 7 | Batch 2 label mismatch (6) + weak_distractor D on G-COSTMODEL-020 (1) |
| H | 11 | Batch 2 label mismatch (10) + option-B substantive on H-MIXED-023 (1) |
| I | 8 | Batch 3 label mismatch (7) + MAJOR uniqueness on I-SPARSE-022 (1, also received label-mismatch fix in same pass — file bumped v1→v3, manifest bumped +2) |
| J | 6 | Batch 3 label mismatch (6) |
| L | 3 | Batch 3 substantive minors: L-ROOFLINE-021 AI arithmetic, L-DYNREG-013 option B, L-DETERM-017 option A |
| K, M, N | 0 | All PASS per Batch 3 & Batch 4 reviewers — no fixes required |

## Per-question changelog

### Module A (1 modified)
- **A-BANK-022** v1→v2 | `explanation` — regenerated from optionExplanations to reference current post-shuffle labels (previously said "Option D is wrong" while D is CA).

### Module B (2 modified)
- **B-CSE-012** v1→v2 | `explanation` — regenerated (was "Options B, C, D are incorrect" while C is CA).
- **B-LICM-013** v1→v2 | `explanation` — regenerated (was "Options B, C, D are wrong" while D is CA).

### Module C (14 modified)
- **C-BUFFER-012 / C-DCE-013 / C-DIALECT-016 / C-EAGER-015 / C-LAYOUTOPT-026 / C-LEGALIZE-008 / C-SHAPEINFER-029 / C-STRIDE-020 / C-SYMSHAPE-018 / C-TE-022 / C-TILING-011 / C-VERIFY-009 / C-VIEW-010** — v1→v2 | `options[<CA-letter>].text` — stripped poison tail from correct option; canonical leading claim preserved; optionExplanations unchanged (already describes only the correct claim).
- **C-GRAPH-025** v1→v2 | `explanation` — regenerated (was "Option C is wrong" while C ∈ CA {B,C,D}).

### Module D (10 modified)
- **D-AOTAG-011 / D-BWSHAPE-033 / D-COMPILET-032 / D-EXPCONS-019 / D-GUARD-006 / D-GUARDEXPR-034 / D-RECDIAG-030 / D-SYMINT-008 / D-TRITON-016** — v1→v2 | `options[<CA-letter>].text` — stripped poison tail.
- **D-EXPORT-018** v1→v2 | `options[A].text, explanation` — stripped poison tail from correct option A + regenerated explanation (was "A, B, C are correct" and "D is wrong" while CA = {A, B, D}).

### Module E (4 modified)
- **E-MLIRDIA-002 / E-MLIRTYPE-006 / E-TVMSCH-013 / E-XLASHP-022** — v1→v2 | `explanation` — regenerated to align letter references to current post-shuffle labels.

### Module F (7 modified)
- **F-BENCH-039 / F-DIVERGE-029 / F-FLASHATTN-023 / F-GEMMFP16-015 / F-LN-020 / F-SOFTMAX-019 / F-STREAM-026** — v1→v2 | `explanation` — regenerated.

### Module G (7 modified)
- **G-BUDGET-029 / G-CFCSE-017 / G-FUSION-005 / G-PORTABILITY-026 / G-TVMSCHED-028 / G-UNROLL-011** — v1→v2 | `explanation` — regenerated.
- **G-COSTMODEL-020** v1→v2 | `optionExplanations[D]` — strengthened option-D distractor rationale to explicitly frame warmup/JIT/lazy-init/clock ramp-up as *measurement-methodology* artifacts (removed by proper warmup + `torch.cuda.synchronize()` + CUDA event timing) distinct from the systematic cost-model gaps (B and C) that persist post-warmup. `correctAnswers = [B, C]` unchanged.

### Module H (11 modified)
- **H-ACCUM-007 / H-CALIB-017 / H-DTYPE-002 / H-FAKE-016 / H-FP8ACCUM-032 / H-GRAN-012 / H-INT4KV-035 / H-KVQ-027 / H-MEMTRAFFIC-024 / H-SYMM-010** — v1→v2 | `explanation` — regenerated.
- **H-MIXED-023** v1→v2 | `options[B].text, optionExplanations[B], explanation` — Tightened option B ("BF16 mixed-precision training never needs FP32 master weights — production frameworks (Megatron-LM, DeepSpeed, NeMo) run the optimizer state in pure BF16 with no accuracy penalty") from the earlier "optional and often omitted" phrasing that reviewer flagged as inconsistent with Megatron-LM/DeepSpeed/NeMo practice. `optionExplanations["B"]` now separates loss-scaling (not required under BF16) from master weights / FP32 optimizer state (still standard practice). `correctAnswers = [A, C, D]` unchanged.

### Module I (8 modified)
- **I-ATTBACK-025 / I-EPILOGUE-024 / I-FLASHPROP-026 / I-FUSEDPROP-030 / I-KVDF-029 / I-MOEPROP-028 / I-RMSPROP-027** — v1→v2 | `explanation` — regenerated.
- **I-SPARSE-022** v1→v3 (label + substantive combined) | `explanation` (from label pass); then `options[C].text, optionExplanations[C]` (from substantive pass) —
  - **Label pass**: regenerated explanation from optionExplanations + correctAnswers.
  - **Substantive pass**: rewrote option C from "on supported dtypes" (defensible-as-scoped, which caused the MAJOR uniqueness dispute) to an overclaim "delivers a real ~2x speedup on any dtype and any GEMM shape, since the Sparse Tensor Core hardware is dtype- and shape-agnostic". `optionExplanations["C"]` extended to spell out the three scope conditions that were previously implicit (supported dtypes: FP16/BF16/INT8/TF32 on A100 + FP8 on H100; sufficient M/N/K so sparse path is dispatched; accuracy-preserving 2:4 pruning). `correctAnswers = [B, D]` unchanged; uniqueness restored.

### Module J (6 modified)
- **J-DISAG-029 / J-FAIRTHR-030 / J-OOM-028 / J-PAGEDDES-024 / J-SPECPROP-023 / J-TVL-027** — v1→v2 | `explanation` — regenerated.

### Module L (3 modified)
- **L-ROOFLINE-021** v1→v2 | `options[D].text, explanation` — Fixed AI arithmetic in correct option D: `0.125 FLOP/byte (2 FLOPs / 16 bytes per element pair)` → `0.25 FLOP/byte (2 FLOPs / 8 bytes per element = 4-byte read + 4-byte write)`; also `(0.125 << 9.75)` → `(0.25 << 9.75)`. Explanation rewritten canonically (removed ambiguous "0.125–0.25 depending on how one counts" hedge). Roofline diagnosis (memory-bound, ~62 µs peak, measured 40 ms = ~640× slower) unaffected.
- **L-DYNREG-013** v1→v2 | `options[B].text, optionExplanations[B], explanation` — Rewrote option B from the general/conditional "more shapes WOULD trigger churn, higher shape diversity WOULD make it worse" (reviewer's uniqueness-dispute wording — arguably a correct general principle) to a current-state claim "the FX cache is thrashing on the present 8-shape workload; each of the 8 shapes is being evicted and recompiled every invocation", which is factually wrong given cache_size_limit=8 with exactly 8 shapes at capacity but not evicting. `optionExplanations["B"]` explains why. `correctAnswers = [A, C, D]` unchanged; uniqueness restored.
- **L-DETERM-017** v1→v2 | `options[A].text, optionExplanations[A], explanation` — Kept option A's CUDA_VISIBLE_DEVICES example but bound the canonical determinism-scope caveat to a false mechanism ("re-partitions the kernel launch grid and changes per-warp thread count on a single visible GPU"), which is factually wrong — CUDA_VISIBLE_DEVICES only masks device visibility. `optionExplanations["A"]` now spells out the corrected mechanism. `correctAnswers = [B, D]` unchanged; uniqueness restored.

## Method notes

### Poison-tail strip (C+D)
Applied a single regex-based mechanical transformation on each correct option in the 23 target IDs:

```
POISON_RE = /\s*(?:Under this (?:reading|framing|account|description|interpretation)|In this (?:reading|framing|account|description|interpretation))[,:]\s.*$/s
```

The tail from the marker phrase to end-of-option was removed; wrong-option poison tails were **not** touched (per handoff `batch1.md` instruction — those distractor tails are legitimate distractor content).

### Explanation label re-alignment
For each flagged question (or any question where an option text was rewritten in this repair):

1. Test whether current explanation contains any `[A-F] is (correct|right|wrong|incorrect|false|true)` or equivalent phrases that mis-assign a letter relative to `correctAnswers`.
2. If yes, rewrite `explanation` using a canonical template:
   - Opening summary: `"Options <CA-set> are correct; options <non-CA-set> are incorrect."`
   - Per-letter block: `"<L> (Correct|Wrong): <text from optionExplanations[L] with leading verdict word stripped>"`
   - Appended `"General context: ..."` block containing sentences from the original `explanation` that did **not** contain per-letter verdict references (via sentence-split + regex filter). This preserves rich technical prose where the original author included framework-independent context.
3. `optionExplanations` was **not** modified during label passes — Primary Reviewers confirmed it as authoritative for shuffle-alignment.

### `reviewStatus` handling
Every modified question kept `reviewStatus = "draft"` per AGENTS.md §6. No promotion to `agent_reviewed` performed. That is the Verification stage's job.

### `learningObjective`
Not modified on any question.

### `sourceRefs`
Not modified on any question. All correct options already Tier-1 supported per Round 1 audit; my substantive rewrites did not change the underlying claim's source support.

## Validation & audit results

```
$ node scripts/validate-questions.mjs
Loaded 400 questions, 400 content cards.
=== VALIDATION SUMMARY ===
Total questions (non-deprecated): 400 / 400
  A..N: (30/30, 25/25, 30/30, 35/35, 30/30, 40/40, 30/30, 35/35, 30/30, 30/30, 30/30, 30/30, 15/15, 10/10)
Schema OK: 400/400
OK

$ node scripts/audit-questions.mjs
=== AUDIT ===
  PASS  duplicate_stems: 0 (max 0)
  PASS  duplicate_option_sets: 0 (max 0)
  PASS  meta_statement_options: 0 (max 0)
  PASS  missing_content_cards: 0 (max 0)
  PASS  missing_subtopic_misconceptions: 0 (max 0)
  PASS  correct_longest_ratio: 0.74 (max 0.8)          [was 0.795 pre-repair]
  PASS  correct_wrong_length_gap: 0.194 (max 0.3)      [was 0.243 pre-repair]
  PASS  answer_position_bias: 0.049 (max 0.35)
  PASS  tier3_only_sources: 0 (max 0)
Audit OK.
```

- **All 9 audit gates PASS.**
- `correct_longest_ratio` improved 0.795 → 0.74 (poison-tail strip made correct options shorter, reducing artificial length signal).
- `correct_wrong_length_gap` improved 0.243 → 0.194 (same reason).
- 9 MAJOR `kernel_vs_e2e_potential` issues remain in the audit — these are pre-existing heuristic flags (regex `/kernel.*端到端|end.?to.?end.*kernel/i`) on questions that Primary Reviewers already inspected in Round 1 and concluded correct (see batch summaries: N-PYT2-009 explicitly *tests* the misconception; K-TRTBUILD-021 tests the offline-build-vs-runtime split, etc.). These are documented false positives in the heuristic gate, not repair defects.

## Resolution records

Written 11 files (one per touched module) at `reviews/resolutions/{A,B,C,D,E,F,G,H,I,J,L}.json` with **74 total resolution entries** (73 unique IDs — I-SPARSE-022 has two entries because it was bumped twice, once in label pass and once in substantive pass; both recorded).

Each entry conforms to the required record format:
```json
{ "id": "...", "finding": "...", "resolution": "...", "diff": ["<field>", ...], "priorVersion": 1, "newVersion": 2 }
```

## Manifest updates

Per-question `version` field bumped in `manifests/{A,B,C,D,E,F,G,H,I,J,L}.json` to match the file-level version. I-SPARSE-022 in `manifests/I.json` bumped by 2 (from v1 to v3) to match the two bumps in `data/questions/I/I-SPARSE-022.json`. All manifest.version ↔ question.version pairs verified consistent post-repair (0 mismatches).

## Not fixed / handed to human review

### 1. Untouched PASS questions with detected but non-flagged label drift (30 items, all MINOR)

A background scan detected 30 additional questions whose top-level `explanation` contains letter-verdict phrases that no longer align with `correctAnswers` after the earlier shuffle (commit 082f09f). These were **not** flagged by Primary Reviewers in Round 1 (they read the questions as PASS overall — presumably because `optionExplanations` is authoritative and the general narrative still makes sense on inspection). Per task rules ("禁止修改未点名的 PASS 题") I did **not** modify them:

```
A: A-DIVERG-021, A-HIER-020, A-ILP-030, A-LAUNCH-015, A-MEM-005, A-PARA-024, A-THROUGH-017
B: B-ALIAS-007, B-DCE-011, B-DOM-004, B-INLINE-014, B-JITAOT-019, B-PATTERN-017, B-PHI-002, B-SEMPRES-021, B-SOUND-020, B-SSAFORM-024
C: C-IRLEVEL-005, C-OPIR-028
D: D-COND-027, D-CPPBACK-017, D-DECOMP-012, D-FX-035, D-MODE-031
K: K-TRTPLAN-020
L: L-STREAM-008
M: M-COSTAG-011, M-SHARD-009, M-SPMD-007
N: N-FLASH-006
```

Recommendation: If Verification Round 2 or human review confirms these are the same systemic label-mismatch pattern, a second Repair pass can address them with the same mechanical transformation used here. All 30 have `optionExplanations` already label-aligned so the answer-key correctness is unaffected.

### 2. Substantive MINORs deliberately left as-is

Per handoff `batch1.md` §3 (optional wording MINORs) and Primary Reviewer notes, the following canary/batch1 MINORs are polish-level and were **not** touched:

- **A-HIER-020** — Option C's per-SM ordering "SMEM > RF" is imprecise on A100 but the answer is still uniquely selectable by exclusion; reviewer marked as optional polish.
- **A-MEM-005** — Option C's "one cycle to the whole warp" is a simplification of "as fast as a register read" (CUDA Programming Guide); reviewer marked as optional polish (canary carry-over).

### 3. Module D multi-select cardinality distribution (informational only)

Module D has 0 two-correct multi-selects (all 8 are 3-correct). Per batch1 handoff this is a distributional flag for next-cycle generation config, not a repair item.

### 4. Position bias distribution (informational only)

Post-shuffle single-choice position distribution for module B (0.47) and module D (0.44) exceeds the canary `answer_position_bias_max = 0.35` guideline; the global audit gate (0.35 evaluated over all modules combined) still passes at 0.049. Reviewer explicitly categorized this as INFO not MAJOR because uniqueness/correctness are unaffected. Not touched in this repair.

## Independence attestation

- Repair Agent (`repair-agent-round1`) is a distinct subagent from:
  - `wave1-generator-batch1/2` (generated modules A/B/C/D)
  - `wave2-generator-*` (generated I/J/K/L/M/N)
  - `primary-review-batch1` (reviewed A/B/C/D)
  - `primary-review-batch2` (reviewed E/F/G/H)
  - `primary-review-3` (reviewed I/J/K/L)
  - `primary-review-4` (reviewed M/N)
- No modifications made to `schemas/`, `config/`, `docs/`, `references/`, `scripts/`, `README.md`, `AGENTS.md`, `PROJECT_SPEC.md`, `STATUS.md`, `DECISIONS.md`.
- No modifications to unmarked PASS questions in modules A (except A-BANK-022), B (except B-CSE-012, B-LICM-013), K, M, N.
- `reviewStatus` remained `draft` on every touched question; no upgrade to `agent_reviewed` performed.
- `correctAnswers` unchanged on every touched question.
- `learningObjective` unchanged on every touched question.
- `sourceRefs` unchanged on every touched question.
- Content cards (`data/content-cards/**`) not modified — none reference option letters; canonical claims / misconceptions / implementation facts are letter-independent.

## Next step

The 73 modified questions and 30 (or fewer, at Verifier's discretion) non-flagged residual label-drift questions are ready for **Round 2 Verification** by a Verifier subagent distinct from:
- the generation agent for each module,
- `primary-review-batch{1,2,3,4}`,
- `repair-agent-round1` (this agent).
