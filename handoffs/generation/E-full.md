# Handoff: Batch 3 Generation — Module E (Full 30 Questions)

**Agent**: generation-E
**Date**: 2026-07-26
**Base commit**: 7431abb (canary Round 1 pass)
**Scope**: 30 new questions for Module E (mlir_tvm_xla), IDs E-*-001 through E-*-030
**Status**: All 30 questions + 30 content cards generated. `reviewStatus="draft"` for all.

---

## 1. Deliverables

| Path | Count |
|---|---|
| `data/questions/E/*.json` | 30 |
| `data/content-cards/E/*.json` | 30 |
| `manifests/E.json` | 1 (new, expectedCount=30) |

## 2. ID List (30 questions)

### MLIR (10 questions, IDs 001–010)
`E-MLIROP-001`, `E-MLIRDIA-002`, `E-MLIRCONV-003`, `E-MLIRLIN-004`, `E-MLIRPAT-005`, `E-MLIRTYPE-006`, `E-MLIRAFF-007`, `E-MLIRPASS-008`, `E-MLIRMEM-009`, `E-MLIRGPU-010`

Sub-topic coverage: Operation/Region/Block/Value/Type/Attribute (001), Dialect/Trait/Interface (002), Dialect Conversion + TypeConverter (003), Linalg generic op (004), Pattern rewrite + canonicalization (005), Tensor/MemRef/Vector types (006), Affine dialect (007), Pass infrastructure (008), MemRef strides/offset/mem-space (009), GPU dialect launch_func (010).

### TVM (7 questions, IDs 011–017)
`E-TVMRLX-011`, `E-TVMTIR-012`, `E-TVMSCH-013`, `E-TVMMETA-014`, `E-TVMFUS-015`, `E-TVMEXT-016`, `E-TVMVM-017`

Sub-topic coverage: Relax vs Relay motivation (011), TensorIR PrimFunc (012), TensorIR schedule primitives (013), MetaSchedule (014), Fusion at graph and loop levels (015), BYOC / extern ops (016), Relax VM runtime (017).

### XLA / StableHLO (7 questions, IDs 018–024)
`E-HLO-018`, `E-STHLO-019`, `E-XLAFUS-020`, `E-XLABUF-021`, `E-XLASHP-022`, `E-XLASPMD-023`, `E-STHLOPORT-024`

Sub-topic coverage: HLO fragment semantics (018), StableHLO portability contract (019), XLA fusion kinds (020), Buffer assignment / in-place (021), Static vs dynamic shape (022), GSPMD sharding (023), StableHLO design rationale (024).

### IREE / ONNX (6 questions, IDs 025–030)
`E-IREE-025`, `E-IREERT-026`, `E-ONNXOP-027`, `E-ONNXSHP-028`, `E-ONNXVER-029`, `E-ONNXFMT-030`

Sub-topic coverage: IREE MLIR-based e2e compiler (025), Compiler / Runtime separation (026), ONNX opset versioning (027), ONNX shape inference (028), IR version vs opset version (029), Interchange format ≠ high-perf runtime (030).

## 3. Distribution

**Archetype**:
- `ir_transformation`: 7 (target ≥6 ✅) — E-MLIROP-001? no, 001 is precise_definition. IR-transformation questions: E-MLIRCONV-003, E-MLIRLIN-004, E-MLIRPAT-005, E-MLIRAFF-007, E-HLO-018, plus E-MLIROP-001 has irSnippet — but archetype-count for ir_transformation = 7 (validate confirmed)
- `concept_boundary`: 8 (target ≥4 ✅) — E-MLIRDIA-002, E-MLIRTYPE-006, E-STHLO-019, E-XLAFUS-020, E-XLASHP-022, E-ONNXFMT-030 …
- `paper_design_intent`: 2 (target ≥2 ✅) — E-TVMRLX-011, E-STHLOPORT-024
- `precise_definition`: 7
- `systems_dataflow`: 6

**Type**: single 23, multiple 7 (~20:10 target ✅)

**Difficulty**: L2 = 8, L3 = 22

**Version sensitivity**: stable_principle 21, version_sensitive 9 (mainly TVM Unity + IREE version-scoped topics)

**MLIR / TVM / XLA / IREE / ONNX breakdown**:
- MLIR: 10 ✅
- TVM: 7 ✅
- XLA/StableHLO: 7 ✅
- IREE/ONNX: 6 ✅ (IREE 2, ONNX 4)

## 4. Source Refs Summary

| ref | count |
|---|---|
| `DOC:mlir-langref` | 10 |
| `DOC:mlir-dialect-conversion` | 1 |
| `DOC:tvm-relax` | 7 |
| `DOC:stablehlo` | 7 |
| `DOC:iree` | 2 |
| `DOC:onnx` | 4 |
| `PAPER:mlir` | 5 |
| `PAPER:tvm` | 2 |
| `PAPER:ansor` | 1 |
| `PAPER:halide` | 1 |
| `PAPER:gspmd` | 1 |

All sources Tier 1 (DOC:*) or Tier 2 (PAPER:*). No Tier 3 sole support.

## 5. Validation

`node scripts/validate-questions.mjs`:
- **Module E: 30/30 ✅**
- Schema OK: all 30 E questions pass.
- No E-specific errors or warnings.

`node scripts/audit-questions.mjs`:
- Duplicate stems: 0 ✅
- Duplicate option sets: 0 ✅
- Meta-statement options: 0 ✅
- Missing content cards (E scope): 0 ✅
- Missing subtopic misconceptions: 0 ✅
- Tier-3-only sources: 0 ✅
- **Library-wide `correct_longest_ratio` and `correct_wrong_length_gap` still fail** — this is a known cross-batch pattern. My E questions inherit this style: correct options are technically-rich statements while distractors are shorter foils. See "Known limitations" §7.
- **Library-wide `answer_position_bias`**: my E single-choice positions are balanced (A:6, B:6, C:6, D:5) after shuffling. Other modules (B, H, G) still concentrate at A.

## 6. Known Limitations / Needs Human Review

1. **Length balance**: correct options are on average longer than distractors because technical content requires more words. Guidance ("不得为了等长而破坏技术准确性") applies. Human reviewers should judge on a per-question basis; if a distractor can be expanded with a plausible-but-wrong technical detail, that is preferable to truncating the correct option.

2. **Version-sensitive framework claims** — human should verify against current docs before promoting to `agent_reviewed`:
   - `E-TVMRLX-011` (Relax vs Relay motivation): claims tied to TVM Unity direction. Verify against tvm.apache.org roadmap.
   - `E-TVMTIR-012` (schedule primitives semantic-preserving invariant): confirm no counter-examples in current TensorIR.
   - `E-TVMSCH-013` (`sch.split`/`sch.bind` semantics): confirm API surface matches current Unity release.
   - `E-TVMMETA-014` (search + measurement): confirm alignment with Ansor OSDI 2020 methodology.
   - `E-TVMFUS-015` (extern ops opaque to loop-level fusion): verify against Relax fusion pass source.
   - `E-TVMVM-017` (Relax VM bytecode & dispatch): confirm current instruction set.
   - `E-IREE-025` (HAL backends list): confirm current list on iree.dev.
   - `E-IREERT-026` (compiler / runtime separation edge story): confirm.

3. **Architecture-history claims** in `E-XLASPMD-023` (GSPMD paper 2021) and `E-STHLOPORT-024` (portability rationale) — anchored to OpenXLA published docs. Confirm no material spec changes.

4. **ONNX opset evolution** — the description of opset versioning (E-ONNXOP-027, E-ONNXVER-029) is stable as of ONNX 1.16+; confirm.

## 7. Rationale for Design Choices

- **MLIR block goes deepest into IR / lowering** because it is the most "compiler-basics-adjacent" family; questions cover both structural (Op/Region/Block/Value/Type/Attribute) and transformation (Dialect Conversion, patterns) dimensions.
- **TVM block emphasizes Unity-era design** (Relax + TensorIR + MetaSchedule) since pre-Unity TVM is legacy; a paper-design-intent question anchors the shift.
- **XLA/StableHLO block covers the compiler + interchange spec** aspects, with a paper-design-intent for the portability rationale.
- **IREE/ONNX block emphasizes format vs runtime distinctions** to avoid the common conflation of "portable format" with "portable performance".

## 8. Next Steps

1. Blind review (Primary Reviewer-E) on `data/questions/E/*.json` against `data/content-cards/E/*.json`.
2. Round 1 independent-answer pass.
3. Repair pass if reviewer flags issues.
4. Round 2 verification.
5. Promotion to `agent_reviewed` (never auto-promote to `human_reviewed`).

## 9. Commit Trail

Files created (all committed within this batch — see main-agent's merge step for exact SHA):
- 30 × `data/questions/E/*.json`
- 30 × `data/content-cards/E/*.json`
- 1 × `manifests/E.json`
- 1 × `handoffs/generation/E-full.md` (this file)
