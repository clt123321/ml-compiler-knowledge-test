# Handoff to Generation Agents — Canary Review Feedback

- From: primary-review-canary
- Date: 2026-07-26
- Applies to: canary batch (25 questions across A/C/D/F/L)
- Purpose: Improvement suggestions for question generators; does NOT change any question in `data/questions/**` (out of scope for Reviewers). Repair Agent will act on the MINORs listed in `reviews/round1/*-review.json`.

## Overall

The canary batch is technically excellent. Independent-reviewer answer agreement is 25/25 (100%), sources are Tier-1 dominated, hardware and version scopes are consistently declared, and distractors are strong. The following notes are for the full 400-question run, not blockers.

## 1. Version-sensitive scope: name the exact config flag, not just the framework version

For version-sensitive PyTorch questions, `frameworkVersionScope: "PyTorch 2.3 ~ 2.5"` and `verifiedAt` are declared — good. But for questions that hinge on a specific behavior toggle (e.g., D-DYNAMIC-002 relies on the current default of `torch._dynamo.config.automatic_dynamic_shapes`), consider adding:

```json
"softwareContext": {
  "framework": "PyTorch",
  "frameworkVersionScope": "PyTorch 2.3 ~ 2.5",
  "configFlags": {
    "torch._dynamo.config.automatic_dynamic_shapes": "default=False as of 2.3-2.5"
  },
  "verifiedAt": "2026-07-26",
  "stability": "version_sensitive"
}
```

This makes the version guard mechanically checkable (a downstream audit could grep for these flags against a live PyTorch install).

## 2. PyTorch-specific claims should reference at least one PyTorch source

C-LAYOUT-002 asks about `torch.channels_last` specifically but its sourceRefs are BOOK:eac3 + DOC:mlir-langref (both compiler-general). The general stride-vs-layout reasoning is correctly captured by those sources, but adding a Tier 1 PyTorch reference — for instance the `torch.Tensor.stride` docs or the memory-format tutorial — would strengthen source-to-claim mapping. Suggested addition to SOURCE_REGISTRY.json:

```json
{
  "id": "DOC:torch-memory-format",
  "tier": 1,
  "type": "official_doc",
  "project": "PyTorch",
  "title": "PyTorch Memory Format / channels_last",
  "stability": "stable_principle",
  "verifiedAt": "2026-07-26",
  "url": "https://pytorch.org/tutorials/intermediate/memory_format_tutorial.html",
  "modules": ["C", "D"]
}
```

## 3. Option-wording precision on cycle counts and hardware sector arithmetic

Two option strings can be tightened without changing correctness:

- **A-MEM-005 option D**: "delivering the value in one cycle to the whole warp" → prefer the Programming Guide's "as fast as reading from a register" or "in the same latency as a register read." The exact cycle count is not part of the CUDA specification.
- **F-COALESCE-002 option D**: "each 128 B L1/L2 sector delivers only 4 useful bytes per lane" → prefer "each 128 B sector serves 4 lanes (32 useful bytes total out of 128); a warp therefore needs 8 sectors → ~1/8 effective bandwidth." This makes the arithmetic explicit and less parseable-two-ways.

These are wording polish only.

## 4. Distractor pattern is healthy — keep the "absolute-language misconception" style

Several incorrect options use strong absolute qualifiers ("strictly required", "always", "guaranteed to", "in one cycle", "only the last program's contribution"). This is a **feature, not a bug**: those are the exact phrasings students / practitioners internalize when they hold the misconception being tested. Correct options are appropriately conditioned. Do NOT soften the absolute language in wrong options to match the correct options — it would blunt the pedagogical value.

## 5. Content-card cross-check (out of scope for this review, but noteworthy)

Each question has a `contentCardRef` to `data/content-cards/<M>/*.json`. Reviewers did not read these in Phase A (per independence rules), and did not audit them in Phase B (per scope), but the file paths are consistent and all 25 exist. Recommend that the audit script (`scripts/audit-questions.mjs`) enforce:
- content-card presence;
- content-card's `misconceptions` list ⊇ question's `misconceptionTags`;
- content-card's `sources` list ⊆ registered `SOURCE_REGISTRY.json` IDs.

## 6. Style-leak audit — no cross-question systemic issue

Across the 25 canary questions:
- Correct options are not systematically the longest or shortest.
- Correct options are not systematically A/B/C/D-biased (this needs a bigger sample to check statistically; canary is too small to detect, but no obvious pattern).
- No two questions share a template that would let a pattern-matcher answer without understanding.

## 7. Recommendations for the full 400-question generation

1. **Keep the current archetype distribution** (formula_performance, code_implementation, performance_diagnosis, ir_transformation, concept_boundary) — this canary batch clearly exercises different cognitive skills.
2. **Continue using realistic profile / log excerpts** as in L-LAUNCH-001, D-DYNAMIC-002, D-DYNAMO-001. They significantly raise the diagnostic realism.
3. **Continue pairing wrong-diagnosis with wrong-mitigation in distractors** (L-LAUNCH-001, L-NCU-004). This tests the whole reasoning chain rather than one hop.
4. **Continue explicit paired IR snippets** (before/after) in module C. They make the transformation concrete without over-specifying a dialect.
5. **For any Kernel question, keep declaring the SMEM bank config, sector size, warp size, and register file / occupancy caps** in `hardwareContext.requiredFeatures` — this canary set does so consistently, which is what makes the answers unambiguous.

## 8. No changes required to Schema, Sources, or Policy

The canary batch was reviewable under the current `schemas/question.schema.json`, `references/SOURCE_REGISTRY.json`, and `config/review-policy.yaml` without any needed field. No schema extension is recommended at this time.

---

_Reviewer commitment_: per AGENTS.md §2 and REVIEW_GUIDE.md §7, the reviewer neither modified `data/**`, `schemas/**`, `config/**`, `docs/**`, nor `references/**`. Only `reviews/round1/**` and this handoff file were written.
