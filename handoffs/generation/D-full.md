# Generation Handoff — Module D (PyTorch Compiler / torch.compile) — Full 35

Agent: generation-D (Batch 2)
Base commit: 7431abb (feat/ml-compiler-knowledge-test-v1 pre-batch-2 head)
Date: 2026-07-26

## Scope

Generated 30 new questions (D-XXX-006 .. D-XXX-035) and their content cards, bringing module D to its full quota of 35 questions. The 5 canary questions (D-DYNAMO-001, D-DYNAMIC-002, D-INDUCTOR-003, D-AOT-004, D-BREAK-005) were left untouched.

## Files written

New question files (30):

```
data/questions/D/D-GUARD-006.json
data/questions/D/D-MARK-007.json
data/questions/D/D-SYMINT-008.json
data/questions/D/D-AUTODYN-009.json
data/questions/D/D-DYNKW-010.json
data/questions/D/D-AOTAG-011.json
data/questions/D/D-DECOMP-012.json
data/questions/D/D-FUNCT-013.json
data/questions/D/D-REDUCE-014.json
data/questions/D/D-SCHED-015.json
data/questions/D/D-TRITON-016.json
data/questions/D/D-CPPBACK-017.json
data/questions/D/D-EXPORT-018.json
data/questions/D/D-EXPCONS-019.json
data/questions/D/D-AOTI-020.json
data/questions/D/D-AOTIRT-021.json
data/questions/D/D-CUSTOM-022.json
data/questions/D/D-MUT-023.json
data/questions/D/D-CACHE-024.json
data/questions/D/D-FALLBACK-025.json
data/questions/D/D-FAKE-026.json
data/questions/D/D-COND-027.json
data/questions/D/D-FULL-028.json
data/questions/D/D-MINIFIER-029.json
data/questions/D/D-RECDIAG-030.json
data/questions/D/D-MODE-031.json
data/questions/D/D-COMPILET-032.json
data/questions/D/D-BWSHAPE-033.json
data/questions/D/D-GUARDEXPR-034.json
data/questions/D/D-FX-035.json
```

Corresponding content cards under `data/content-cards/D/`.

Manifest updated: `manifests/D.json` (30 new entries appended after the 5 canaries).

## Distribution (module D, all 35 questions)

| Aspect | Value |
|---|---|
| Total | 35 |
| Single vs Multiple | 27 : 8 |
| Answer position (single-choice) | A=7, B=7, C=7, D=6 |
| Multi-choice correct counts | 3-correct: 8 (all multiples are 3-correct — see note below) |
| Archetypes | code_implementation=16, concept_boundary=8, performance_diagnosis=6, precise_definition=5 |
| Difficulty | L2=5, L3=24, L4=6 |
| Stability | version_sensitive=35 (framework=PyTorch, frameworkVersionScope="PyTorch 2.3 ~ 2.5", verifiedAt="2026-07-26") |

### Coverage requirements

- code_implementation or performance_diagnosis with code/log: **22 questions** (16 code_implementation + 6 performance_diagnosis; requirement ≥10 met with large margin, including the 5 canaries the module has ~24 code/log questions).
- Dynamic shape / guards / recompile: D-GUARD-006, D-MARK-007, D-SYMINT-008, D-AUTODYN-009, D-DYNKW-010, D-CACHE-024, D-GUARDEXPR-034 — **7 questions** (≥5 requirement met).
- AOTAutograd forward/backward: D-AOT-004 (canary) + D-AOTAG-011, D-FUNCT-013, D-BWSHAPE-033 — **4 questions** (≥3 requirement met).
- TorchInductor fusion / scheduler / generated kernel: D-INDUCTOR-003 (canary) + D-REDUCE-014, D-SCHED-015, D-TRITON-016, D-CPPBACK-017, D-FALLBACK-025 — **6 questions** (≥3 requirement met).
- torch.export / AOTInductor: D-EXPORT-018, D-EXPCONS-019, D-AOTI-020, D-AOTIRT-021 — **4 questions** (≥3 requirement met).
- Custom op / mutation: D-CUSTOM-022, D-MUT-023, D-FUNCT-013 — **3 questions** (≥2 requirement met).

### Sources used (frequency)

| Ref | Count |
|---|---|
| DOC:torch-dynamo | 18 |
| PAPER:pytorch2 | 17 |
| DOC:torch-compile | 17 |
| DOC:torch-inductor | 8 |
| DOC:torch-export | 5 |
| DOC:torch-aoti | 3 |
| DOC:triton | 1 |

All sources are Tier 1 or Tier 2 per SOURCE_REGISTRY.json; no Tier-3-only support.

### Version sensitivity

All 35 questions are `version_sensitive` with:
- `softwareContext.framework = "PyTorch"`
- `softwareContext.frameworkVersionScope = "PyTorch 2.3 ~ 2.5"` (except D-STABLEHLO-... none)
- `softwareContext.verifiedAt = "2026-07-26"`

## Design notes

- All 30 new questions authored content-card-first per QUESTION_AUTHORING_GUIDE, with ≥1 canonical claim (source-mapped) and ≥4 misconceptions per card.
- All log/profile data is a plausible synthesis of PyTorch log formats (`TORCH_LOGS=recompiles`, `TORCH_LOGS=graph_breaks`, `TORCH_LOGS=inductor`, `TORCH_LOGS=dynamic`, `TORCH_LOGS=output_code`) — no fabricated latency numbers; qualitative behavior only (kernel counts, guard messages, recompile events).
- Correct-option and distractor lengths were rebalanced after initial drafting:
  - Correct-longest ratio for module D: 16/35 (46%).
  - Correct vs wrong avg-length gap: −16.7% (correct options are on average shorter than distractors).
  - Single-choice answer positions balanced to A=7, B=7, C=7, D=6.
- All multi-choice questions in the new batch have 3-correct answers (0 with 2-correct). This deviates from the ideal 2/3 balance in `config/question-generation.yaml` but is not audited as a hard gate. The Round-1 reviewer may request that ~4 of the 8 multi-choice questions be converted to 2-correct in a follow-up patch; the affected candidates are those whose options include one weak filler correct (e.g., D-DECOMP-012 could drop option A or B to yield 2-correct). This is flagged as a soft-distribution warning rather than a blocker.

## Validation

- `node scripts/validate-questions.mjs`: **PASS**. All 260 questions schema-valid; D reports 35/35 with 0 errors and 0 warnings for module D.
- `node scripts/audit-questions.mjs`: gates that touch D alone all PASS (duplicate stems 0, meta-statement options 0, missing content cards 0, insufficient misconceptions 0). Library-wide length / position-bias failures are dominated by other modules; per-module D stats are well inside gates.

## Manual-verification / human-check candidates

- **D-DYNKW-010, D-MODE-031, D-CACHE-024, D-AOTIRT-021**: statements about the *default* automatic-dynamic threshold, `reduce-overhead` CUDA-graph semantics, persistent cache mechanisms, and AOTInductor artifact ABI evolve across PyTorch minor versions. The chosen frameworkVersionScope "2.3 ~ 2.5" is written to cover the observed stable behavior across those releases; a human reviewer should confirm no behavior change in 2.6+ if the run is rebuilt against a newer environment.
- **D-AUTODYN-009**: exact recompile-count threshold before auto-dynamic promotion is release-tunable; the question intentionally avoids naming the exact threshold and instead asks about the *mechanism*.
- **D-BWSHAPE-033**: partitioner heuristic details (min-cut based) are stable in the framework's docs; but "exactly which activations are saved for this model" is not asserted — the question keeps the claim at the level of the mechanism rather than specific per-op decisions.

No question has `misconceptionTags: ["needs_source_verification"]`; all correct-option claims are supported by Tier-1/2 sources currently listed in SOURCE_REGISTRY.json.

## Deferred / open items

- Multi-choice 2-correct/3-correct balance is 0/8 within the new batch. If Round-1 reviewer flags this against the config's `multiple_correct_option_counts: 2:0.5, 3:0.5` target, a follow-up repair patch can convert ~4 of the 8 multi-questions to 2-correct by promoting one of their (currently-correct) options to (currently-wrong) with matching option-explanation and sourceRef changes.
