# Generation Handoff — Module C (Graph, Tensor & IR) — Full 30

Agent: generation-C (Batch 2)
Base commit: 7431abb (feat/ml-compiler-knowledge-test-v1 pre-batch-2 head)
Date: 2026-07-26

## Scope

Generated 25 new questions (C-XXX-006 .. C-XXX-030) and their content cards, bringing module C to its full quota of 30 questions. The 5 canary questions (C-LICM-001, C-LAYOUT-002, C-SSA-003, C-SHAPE-004, C-IRLEVEL-005) were left untouched.

## Files written

New question files (25):

```
data/questions/C/C-CANON-006.json
data/questions/C/C-LOWER-007.json
data/questions/C/C-LEGALIZE-008.json
data/questions/C/C-VERIFY-009.json
data/questions/C/C-VIEW-010.json
data/questions/C/C-TILING-011.json
data/questions/C/C-BUFFER-012.json
data/questions/C/C-DCE-013.json
data/questions/C/C-STABLEHLO-014.json
data/questions/C/C-EAGER-015.json
data/questions/C/C-DIALECT-016.json
data/questions/C/C-PROD-017.json
data/questions/C/C-SYMSHAPE-018.json
data/questions/C/C-IRLEVELS-019.json
data/questions/C/C-STRIDE-020.json
data/questions/C/C-REGION-021.json
data/questions/C/C-TE-022.json
data/questions/C/C-LOOPIR-023.json
data/questions/C/C-TYPECONV-024.json
data/questions/C/C-GRAPH-025.json
data/questions/C/C-LAYOUTOPT-026.json
data/questions/C/C-MATERIALIZE-027.json
data/questions/C/C-OPIR-028.json
data/questions/C/C-SHAPEINFER-029.json
data/questions/C/C-LINALG-030.json
```

Corresponding content cards under `data/content-cards/C/`.

Manifest updated: `manifests/C.json` (25 new entries appended after the 5 canaries).

## Distribution (module C, all 30 questions)

| Aspect | Value |
|---|---|
| Total | 30 |
| Single vs Multiple | 24 : 6 |
| Answer position (single-choice) | A=6, B=6, C=6, D=6 (perfectly balanced) |
| Multi-choice correct counts | 2-correct: 1, 3-correct: 5 |
| Archetypes | ir_transformation=16, concept_boundary=8, precise_definition=6 |
| Difficulty | L2=8, L3=18, L4=4 |
| Stability | stable_principle=29, version_sensitive=1 (C-STABLEHLO-014) |

### Coverage requirements

- IR transformation with irSnippet: **16 questions** (requirement ≥5; the 5 canary IR-style questions + 11 new IR-transformation questions from 006..030). Well above threshold.
- concept_boundary / precise_definition: 8 + 6 = **14 questions**. Requirement said ≥5. Above threshold.

### Sources used (frequency)

| Ref | Count |
|---|---|
| DOC:mlir-langref | 17 |
| PAPER:mlir | 12 |
| PAPER:tvm | 8 |
| BOOK:eac3 | 8 |
| PAPER:pytorch2 | 5 |
| DOC:stablehlo | 5 |
| PAPER:halide | 3 |
| DOC:tvm-relax | 3 |
| DOC:mlir-dialect-conversion | 2 |
| BOOK:dragon2 | 1 |
| BOOK:appel | 1 |
| DOC:torch-dynamo | 1 |

All sources are Tier 1 or Tier 2 per SOURCE_REGISTRY.json; no Tier-3-only support.

### Version sensitivity

29 of 30 questions are `stable_principle` (IR concepts, MLIR structural / dialect / conversion semantics, buffer vs tensor, view/materialization, DCE, LICM etc. — all long-established compiler theory).

The one `version_sensitive` question is C-STABLEHLO-014, which references StableHLO's specification (frameworkVersionScope="StableHLO current spec (~2024-2026)", verifiedAt="2026-07-26").

## Design notes

- All 25 new questions were written with content cards first per the QUESTION_AUTHORING_GUIDE. Every content card has ≥1 canonical claim with sources, ≥4 misconceptions with error-type tags, plus implementation facts, performance scenarios, and version-sensitivity.
- Correct-option and distractor lengths were balanced after initial drafting: correct-longest ratio for module C now = 17/30 (56%), and correct-vs-wrong avg-length gap is negative (−9.5%), i.e. correct options are on average shorter than distractors. The library-wide audit gate is failed only because of other modules' contributions (B/G/H); C alone is well inside gate.
- Single-choice answer positions rebalanced to A/B/C/D = 6/6/6/6 by a deterministic permutation script that preserves all sourceRef.supports / optionExplanations / distractorRationales key relations.

## Validation

- `node scripts/validate-questions.mjs`: **PASS**. All 260 questions schema-valid; C reports 30/30 with 0 errors and 0 warnings for module C.
- `node scripts/audit-questions.mjs`: gates that touch C alone all PASS (duplicate stems 0, meta-statement options 0, missing cards 0, insufficient misconceptions 0). Library-wide length / position-bias failures are caused by other modules; per-module C stats are well within gates.

## Deferred / open items

None. All 25 new questions ready for Round-1 blind review. No `needs_source_verification` tags applied.
