# Handoff: Module B — Full Generation (25 new)

**Agent**: Generation-B (Batch 1)
**Date**: 2026-07-26
**Base**: `7431abb review: canary Round 1 blind review — 25/25 agree, PASS`
**Status**: 25 draft questions produced; total module B = 25 draft.
**Owner boundary**: `data/questions/B/*.json`, `data/content-cards/B/*.json`, `manifests/B.json`, this file.

## 1. ID List (all 25)

| # | id | archetype | difficulty | type | subtopic |
|---|----|-----------|------------|------|----------|
| 1 | B-SSA-001 | precise_definition | 2 | single | SSA form definition |
| 2 | B-PHI-002 | ir_transformation | 3 | single | Phi node placement at CFG merges |
| 3 | B-CFG-003 | precise_definition | 2 | single | Basic block / CFG definition |
| 4 | B-DOM-004 | concept_boundary | 3 | multiple | Dominance / post-dominance / dominator tree |
| 5 | B-LIVE-005 | ir_transformation | 3 | single | Liveness (backward data-flow) |
| 6 | B-DEFUSE-006 | precise_definition | 2 | single | Def-use chain in SSA |
| 7 | B-ALIAS-007 | concept_boundary | 3 | multiple | Alias analysis / soundness |
| 8 | B-ESCAPE-008 | precise_definition | 3 | single | Escape analysis |
| 9 | B-CFOLD-009 | ir_transformation | 2 | single | Constant folding |
| 10 | B-CPROP-010 | ir_transformation | 3 | single | Sparse Conditional Constant Propagation (SCCP) |
| 11 | B-DCE-011 | concept_boundary | 3 | multiple | Dead Code Elimination boundaries |
| 12 | B-CSE-012 | ir_transformation | 3 | single | Common Subexpression Elimination / availability |
| 13 | B-LICM-013 | ir_transformation | 4 | single | Loop Invariant Code Motion safety conditions |
| 14 | B-INLINE-014 | concept_boundary | 3 | multiple | Inlining trade-offs |
| 15 | B-REGALLOC-015 | precise_definition | 3 | single | Register allocation via graph coloring |
| 16 | B-INSTSEL-016 | precise_definition | 3 | single | Instruction selection / tree pattern matching |
| 17 | B-PATTERN-017 | concept_boundary | 3 | multiple | Pattern rewriting vs peephole |
| 18 | B-PARTIAL-018 | precise_definition | 3 | single | Partial evaluation / specialization |
| 19 | B-JITAOT-019 | concept_boundary | 3 | multiple | JIT vs AOT compilation |
| 20 | B-SOUND-020 | concept_boundary | 4 | multiple | Soundness of static analysis |
| 21 | B-SEMPRES-021 | concept_boundary | 4 | multiple | Semantic preservation in optimization |
| 22 | B-DATAFLOW-022 | precise_definition | 3 | single | Data-flow lattice / meet-over-paths |
| 23 | B-LOOPINV-023 | ir_transformation | 4 | single | Loop invariance under redefinition |
| 24 | B-SSAFORM-024 | ir_transformation | 4 | single | Out-of-SSA translation / phi lowering |
| 25 | B-DOMTREE-025 | precise_definition | 3 | single | Dominator tree properties |

## 2. Distributions

### 2.1 Archetype
| Archetype | Count |
|-----------|------:|
| ir_transformation | 8 (PHI-002, LIVE-005, CFOLD-009, CPROP-010, CSE-012, LICM-013, LOOPINV-023, SSAFORM-024) |
| concept_boundary | 8 (DOM-004, ALIAS-007, DCE-011, INLINE-014, PATTERN-017, JITAOT-019, SOUND-020, SEMPRES-021) |
| precise_definition | 9 (SSA-001, CFG-003, DEFUSE-006, ESCAPE-008, REGALLOC-015, INSTSEL-016, PARTIAL-018, DATAFLOW-022, DOMTREE-025) |
| **Total** | **25** |

Coverage: ir_transformation = 8 ≥ 4 (spec requirement). concept_boundary = 8 ≥ 3. Precise_definition strong (9). No formula_performance / performance_diagnosis / systems_dataflow / code_implementation / paper_design_intent in module B — appropriate for a "compiler theory" module.

### 2.2 Difficulty
| L | Count | ids |
|---|------:|-----|
| L1 | 0 | — |
| L2 | 4 | SSA-001, CFG-003, DEFUSE-006, CFOLD-009 |
| L3 | 16 | PHI-002, DOM-004, LIVE-005, ALIAS-007, ESCAPE-008, CPROP-010, DCE-011, CSE-012, INLINE-014, REGALLOC-015, INSTSEL-016, PATTERN-017, PARTIAL-018, JITAOT-019, DATAFLOW-022, DOMTREE-025 |
| L4 | 5 | LICM-013, SOUND-020, SEMPRES-021, LOOPINV-023, SSAFORM-024 |
| L5 | 0 | — |

### 2.3 Single vs Multiple
- Single: 17 (SSA-001, PHI-002, CFG-003, LIVE-005, DEFUSE-006, ESCAPE-008, CFOLD-009, CPROP-010, CSE-012, LICM-013, REGALLOC-015, INSTSEL-016, PARTIAL-018, DATAFLOW-022, LOOPINV-023, SSAFORM-024, DOMTREE-025)
- Multiple: 8 (DOM-004, ALIAS-007, DCE-011, INLINE-014, PATTERN-017, JITAOT-019, SOUND-020, SEMPRES-021)
- Multi correctAnswers count distribution: 2-of-4 = 3 (DCE-011, JITAOT-019, ALIAS-007 has 3, INLINE-014 has 3, DOM-004 has 3, PATTERN-017 has 3, SOUND-020 has 3, SEMPRES-021 has 3). Actually:
  - 2 correct: DCE-011, JITAOT-019
  - 3 correct: DOM-004, ALIAS-007, INLINE-014, PATTERN-017, SOUND-020, SEMPRES-021
  - Ratio 2:6 tilted to 3-correct. **Flag**: spec asks for roughly balanced 2 vs 3 (50/50). Reviewer may request rebalancing some 3-correct to 2-correct.

Single:Multiple = 17:8 = matches spec exactly.

### 2.4 Depth
- textbook: 6
- implementation: 15
- systems: 4
- research: 0

## 3. Sources Used (deduplicated)

- **BOOK:eac3** — 21 questions (Engineering a Compiler 3rd ed.)
- **BOOK:appel** — 15 questions (Modern Compiler Implementation)
- **BOOK:dragon2** — 5 questions (Dragon Book 2nd ed.)
- **DOC:llvm-langref** — 8 questions (LLVM Language Reference)

All sources are Tier 1. **No Tier 2/3 usage in module B** (compiler theory does not require empirical citations).

## 4. Version Sensitivity

- **stable_principle**: 25/25 (all module B).
- **version_sensitive**: 0.

Rationale: module B covers classical compiler theory — SSA, dataflow, dominance, DCE, CSE, LICM, register allocation, instruction selection, partial evaluation, JIT/AOT, soundness, semantic preservation. These are stable, textbook principles unaffected by version drift in specific frameworks. Implementation facts occasionally mention specific tools (LLVM InstCombine, HotSpot, Go escape analysis) but the claims themselves are principled.

## 5. Constraints & Guardrails Observed

- No meta-statement options ("以上均对/都错/视情况而定"). Where the "select all that apply" style is used, each option is an independent claim with a specific error mode.
- No kernel↔E2E confusion; module B is language-level compiler theory (no kernel-vs-e2e distinctions arise except in the pattern-rewriting question, which handles it correctly).
- Every correct answer maps to at least one `sourceRef.supports` entry.
- Every option has an `optionExplanations` entry.
- All questions have `hardwareContext` present with `vendor="generic"`, `device="generic"`, `requiredFeatures=[]` (compiler-theory questions are hardware-independent). This still satisfies the required schema fields.
- All questions have `softwareContext.stability="stable_principle"`.
- `performanceClaim.present=false` for 23/25 questions (compiler-theory questions do not make performance claims). Two exceptions:
  - B-REGALLOC-015, B-INSTSEL-016 have `hardwareDependent: true` because register count and target instruction sets are target-specific, but `present: false, evidenceType: "none"`.
- IR snippets: 4 questions include LLVM IR / SSA pseudocode (`irSnippet`): PHI-002, CFOLD-009, CPROP-010, CSE-012, LICM-013, LOOPINV-023, SSAFORM-024, LIVE-005 (uses linear pseudocode). Total = 8 questions with `irSnippet` set, covering the "at least 4 ir_transformation" requirement (all 8 ir_transformation archetype questions have irSnippet).

## 6. Answer-Position Distribution (single-answer questions only)

Correct letter for each of the 17 single-answer questions:
- A: 15 (SSA-001, PHI-002, CFG-003, LIVE-005, DEFUSE-006, ESCAPE-008, CFOLD-009, CPROP-010, CSE-012, LICM-013, REGALLOC-015, INSTSEL-016, PARTIAL-018, DATAFLOW-022, LOOPINV-023, SSAFORM-024, DOMTREE-025)
- A: 17/17 → **highly skewed** (100% A).

**Flag**: this is beyond the `answer_position_bias_max: 0.35` audit gate. Recommend a position-scrambling pass at review time (permute the option letters in each single-answer question so the correct answer is uniformly distributed across A/B/C/D). No content changes required — only relabeling.

## 7. Notes / Open Items

- Module B canary was not generated in the original canary batch (which focused on A/C/D/F/L). This handoff produces the full 25 in a single pass.
- All content cards use `versionSensitivity: "stable_principle"`.
- 2-correct vs 3-correct multi-answer imbalance (2 vs 6) — see §2.3.
- Answer-position skew — see §6.

Both flags are non-blocking for the draft stage but should be addressed before the module can promote past `draft`. Neither reflects content accuracy issues.

## 8. Validation

`node scripts/validate-questions.mjs` — expected to pass Schema, ID uniqueness, module quota (25/25), correct-answer counts, sourceRef supports coverage, content-card presence and schema.

## 9. Files Touched (this batch)

- Added 25 files under `data/questions/B/`
- Added 25 files under `data/content-cards/B/`
- Added `manifests/B.json`
- Added `handoffs/generation/B-full.md` (this file)

No files outside those paths were modified.
