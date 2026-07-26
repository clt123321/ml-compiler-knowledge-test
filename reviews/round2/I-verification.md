# Round 2 Verification — Module I (core_ops_attention)

**Reviewer**: verification-agent-3 (Batch 3)  
**Round**: Round 2  
**Date**: 2026-07-27  
**Question count**: 30

## Phase A summary
- Independent answer agreement with post-repair official: **29/30**
- Disagreement: **I-ATTBACK-025** (mine {A,C} vs official {A,B,C}); Round 1 already flagged this as MINOR/defensible.

## Phase B summary
- Round 1 result breakdown: 22 PASS · 7 MINOR (label mismatch, all repaired) · 1 MAJOR (I-SPARSE-022 uniqueness, repaired).
- Round 2 verificationResult: **30 PASS**.
- Post-repair option text re-read confirms:
  - I-SPARSE-022 v3: option C now over-claims "any dtype and any GEMM shape … dtype- and shape-agnostic" — cleanly wrong. correctAnswers={B,D} restored to unique.
  - I-ATTBACK-025 v2: explanation regenerated. Answer key {A,B,C} unchanged. Option B remains defensible under FA's I/O-aware analysis (extra recompute FLOPs, wall-clock win from HBM traffic dominating extra compute).

## Promotion decisions
- **Promoted to `agent_reviewed` (29)**: all I module questions except I-ATTBACK-025.
- **Kept `draft` (1)**:
  - **I-ATTBACK-025** — answerAgreement=false in Round 2. Following batch-1/batch-4 precedent (see G-COSTMODEL-020), a Round 2 disagreement blocks auto-promotion even if the disagreement is defensible.

## Round 2 new findings
- No new BLOCKER/MAJOR beyond items already documented in Round 1 + resolutions.
- Blind package for module I appears to have been built pre-repair (contains OLD text for I-SPARSE-022 option C and legacy explanations). Re-reading the current questions confirms the repaired text matches Round 1 resolutions.

## Attention data-flow spot checks (I module priority)
- I-FLASHIO-006, I-FLASH-005, I-FLASHPROP-026, I-ATTBACK-025: FA I/O complexity O(N²·d/M), online-softmax, backward recomputation from (m,l) statistics — all cross-verified.
- I-MHAMQA-007, I-GQA-008: KV cache 2·H_kv·d per token, MHA/GQA/MQA ratios verified.
- I-MOEROUT-020, I-MOEPROP-028, I-GGEMM-021: top-k routing, param scaling, grouped GEMM launch amortization — all verified.
