# Challenge Questions pre-proof audit — 2026-08-20

Status: **🟡 PENDING** manual full proofreading.

This is a fast pre-proofing layer after the global CQ red-team pass in PR #178. It is intentionally **not** a second full semantic red-team and does not claim that every question is proven correct. Its purpose is to remove mechanical/state-integrity distractions and give the human proofreading pass a useful priority order.

## Baseline and source

- Repository baseline: `43c33c93df5bdbba355f066929cc8cada6fe1f15` (merge of PR #178).
- Pinned H-Group upstream: `hanabi/hanabi.github.io@f80d79d904a5df1d4ac561bec35d9414ed8daeeb`.
- Local Challenge Questions are H-Group RU instructional material, not Official H-Group Challenge Questions unless a page explicitly embeds an official Q/S.

## Corpus inventory

**🟢 PASS**

- 242 CQ pages after excluding the 24 Level intro pages (`level-2.mdx` … `level-25.mdx`).
- 242/242 have paired EN and RU pages.
- No missing Question/Solution tabs were found.
- 208/242 import one or more YAML states/diagrams.
- 34/242 are text-only.
- No imported YAML path was missing.
- Effective sidebar coverage is 242/242. `sidebars.ts` deliberately wraps `sidebars-base.ts` and appends Levels 23–25; checking only `sidebars-base.ts` produces a false 30-page "orphan" signal.

## EN ↔ RU triage

The machine pass generated candidates for changed polarity/modality (`must`, `only`, prohibitions), explicit card-identity tokens, and clue-count wording. These are **candidate generators only**: Russian often expresses the same semantic force without a one-to-one lexical marker.

The highest-priority candidate set was reviewed side-by-side by the model. No confirmed EN↔RU semantic defect was found in that reviewed top set. Typical false positives included:

- English `must not` vs Russian `не должна` / a negative construction outside the detector;
- English `only` vs Russian wording that encodes uniqueness through the sentence structure;
- repeated English `8 clues` / `5 clue` wording vs a single Russian mention with unchanged game state;
- `must` in explanatory English rendered as a direct Russian consequence without weakening the rule.

This does **not** clear the remaining lexical candidates automatically. They remain useful places to pay extra attention during manual proofreading.

## Diagram/state-grounded anomaly pass

All 208 state-bearing CQ were included in the deterministic state/text pass. Four apparent stack contradictions were generated and all four were semantically adjudicated as false positives:

1. `level-21-ignition-definition` — YAML has green stack at 1 and Bob holds green 2. The prose describes Bob **blind-playing** that playable green 2; it does not claim green 2 is already on the stack.
2. `level-2-two-possibilities-i` — YAML has blue stack at 1 and Cathy holds blue 2. The Solution explicitly says blue 2 **has not been played**; the detector matched the negated phrase.
3. `level-5-multiple-possibilities` — YAML has yellow stack at 1 and Cathy's yellow 2 is the Prompt possibility. The prose discusses the prospective play/interpretation, not an already-played yellow 2.
4. `level-7-another-scream-discard` — YAML has green stack at 2 and Bob's green 4 is one-away-from-playable because green 3 **has not been played yet**. The detector again matched a negated/future statement.

Result: **🟢 PASS** for the filtered state-grounded contradiction pass: no confirmed diagram/state defect was found among generated anomalies.

This is not a replacement for a fresh human visual inspection of every diagram. No diagram/YML was changed in this batch, so browser visual QA is **⚪ NOT RUN**.

## Suggested manual proofreading order

The scoring below is a **priority heuristic**, not a defect verdict. Start with questions that combine semantic-marker differences, multi-state reasoning, and advanced convention interactions.

### First pass

- `level-21-ignition-definition`
- `level-23-hesitation-self-finesse`
- `level-6-filling-in-i`
- `level-18-double-discard`
- `level-2-play-or-save`
- `level-2-two-possibilities-i`
- `level-5-multiple-possibilities`
- `level-9-eight-clue-finesse-readable`
- `level-9-hard-burn`
- `level-9-stall-precedence`
- `level-10-gd-buys-time`
- `level-14-reverse-endgame`
- `level-21-double-targets`
- `level-21-rank-five-one-away`
- `level-22-phantom-definition`
- `level-22-phantom-scream`
- `level-22-rebellious`
- `level-23-blaze-playable-one`
- `level-23-four-charm-three-blinds`
- `level-23-hesitation-ambiguous-connector`
- `level-25-finesse-target-other`
- `level-25-priority-bluff`

### Then multi-state / chronology-heavy questions

- `level-3-playing-multiple-1-s-ii` — 4 states
- `level-4-order-is-important` — 3 states
- `level-20-suboptimal-finesse-bluff` — 3 states
- `level-7-alice-loves-garbage` — 2 states
- `level-7-another-scream-discard` — 2 states
- `level-7-screaming-into-the-void` — 2 states
- `level-8-3-cards-left` — 2 states
- `level-2-find-the-best-clue-iii` — 2 states
- `level-5-a-tricky-spot-i` — 2 states

For each manually-read CQ, the most valuable questions remain the project standard: is the answer unique from the stated information; does the Solution use only the player's available knowledge; is modality preserved; does timing/precedence work; and, for diagrams, does the state show exactly the facts the reasoning needs without leaking the answer?

## What this batch did not redo

- It did not repeat the full 242-question adversarial semantic review from PR #178.
- It did not claim that lexical EN/RU marker parity proves translation correctness.
- It did not perform a new browser/visual inspection of all 208 state-bearing questions.
- It did not modify any CQ prose or YML merely to satisfy a heuristic.

The next acceptance layer is the planned human full proofreading. Any human-found defect should be fixed source-faithfully and then re-run through the applicable deterministic/browser gates before clean-baseline promotion.
