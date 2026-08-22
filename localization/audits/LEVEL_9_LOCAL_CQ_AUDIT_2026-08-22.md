# Level 9 Local Challenge Questions — evidence audit

Date: 2026-08-22

Scope: all 22 Local Challenge Questions listed under Level 9 in `sidebars-base.ts`.

Authoritative source: `hanabi/hanabi.github.io@1ef83242d71c62f2db6422f09e83abddba9611dd`.

Procedure: `localization/LOCAL_CHALLENGE_QUESTIONS.md` + `localization/LOCAL_CHALLENGE_AUDIT_PROTOCOL.md`.

## Audit limitations

This is a **legacy recovery audit**. The current reviewer had already seen many existing Solutions before the enforceable blind-isolation protocol was introduced. Therefore this pass must not be described as an independent blind solve. Instead it uses fresh source comparison, explicit adversarial alternatives, state preflight, mutation/minimal-state reasoning, corpus-level duplicate review, and the previously independent human walkthrough that exposed the Level 9 failures.

For future new/rebuilt CQ batches, the blind answer must be fixed before Solution is exposed. For this recovery batch, `blind isolation` is **🟡 PENDING** and prevents clean-baseline promotion by itself.

Rendered reader / focused visual QA for changed diagrams is **⚪ NOT RUN** and remains a release blocker for leaving draft state.

## Corpus result

- `KEEP`: 18
- `DELETE`: 4
- unresolved semantic `REWRITE`: 0 after the fixes in this branch
- visual / fresh-blind acceptance: still pending

The four `DELETE` verdicts are not quantity cuts for their own sake. They duplicate the same cognitive task already covered by the Level 9 Quick Checks and do not add enough transfer, contrast, or decision complexity to justify a full Local CQ page.

## Per-question records

### 1. `level-9-stall-precedence` — KEEP

- risk: high
- source rule: Stall Table precedence at 8 clues
- learning objective: choose Tempo Clue Stall over tied precedence-4 Fill-In / 8CS options
- critical variable: availability of a precedence-3 Tempo Clue Stall
- competing moves checked: normal Play/Save, 5 Stall, Fill-In, 8CS
- defects found: old state had impossible 4-player hand sizes and accidental competing Save/5-Stall material
- state action: rebuilt to four cards per player, removed accidental 5 targets, historical knowledge uses `middleNote`
- physical state: 🟢 PASS by manual preflight; deterministic state preflight added to lint
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: strong precedence decision with multiple plausible lower-priority alternatives; not mere table recall after the state repair

### 2. `level-9-eight-clue-finesse-shadowed` — KEEP

- risk: high
- source rule: at 8 clues, 8CS remains a possible explanation when no higher-precedence Stall exists
- learning objective: do not force a Finesse interpretation when Stalling context still explains the clue
- critical variable: absence of a higher-precedence Stall
- competing interpretations checked: Finesse vs 8CS
- physical state: 🟢 PASS
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: useful negative half of a controlled contrast with #3

### 3. `level-9-eight-clue-finesse-readable` — KEEP

- risk: high
- source rule: higher-precedence Tempo Clue Stall rules out 8CS as the explanation
- learning objective: use visible Stall precedence to recover an otherwise tricky Finesse interpretation
- critical variable: Donald has a publicly visible playable blue-clued 2
- competing interpretations checked: Tempo Stall, 8CS, Finesse
- defects found: historical clue was drawn as a current arrow; four-player state had five-card hands; current red clue action was not represented cleanly
- state action: four cards per player; Donald's prior blue knowledge is a center note; Cathy's red clue is the current action
- physical state: 🟢 PASS
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: strong positive contrast with #2; the changed critical variable changes readability exactly as intended

### 4. `level-9-asymmetric-finesse-risk` — KEEP

- risk: high
- source rule: Stall-precedence reasoning is only useful to a reacting player when the prerequisite is common/available information to that player
- learning objective: distinguish Alice's visible table knowledge from Bob's epistemic state
- critical variable: Bob knows only that his card is blue, not that it is the playable blue 2
- competing interpretations checked: Alice-visible Tempo Stall vs Bob-readable 8CS vs Finesse
- state action: historical blue information uses `middleNote`; current red clue is the only clue action
- POV/epistemics: 🟢 PASS after rewrite
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: genuinely tests asymmetric information rather than simple convention recall

### 5. `level-9-early-game-ending` — DELETE

- risk: low
- source rule: Early Game ends only on the first completely unknown discard; misplays and known-trash discards do not end it
- cognitive task: identify whether Early Game has ended
- competing interpretation: treat previous misplay/known-trash discard as sufficient to enter Mid-Game
- semantic correctness: 🟢 PASS
- corpus finding: Level 9 Quick Check #3 asks exactly what ends the Early Game and explicitly lists the same non-ending events
- verdict reason: full CQ adds essentially no new transfer or decision structure beyond the Quick Check

### 6. `level-9-early-game-tempo` — DELETE

- risk: medium
- source rule: Tempo Clue Stall is not available in Early Game; ordinary Tempo Clue / TCCM meaning remains
- cognitive task: can an otherwise low-value Tempo Clue be used merely as an Early Game Stall?
- defect found during breaker: old diagram contained a visible 5 that created a normal higher-priority Save despite the prose saying none existed
- state action: removed accidental Save target and historical arrow semantics
- semantic correctness after repair: 🟢 PASS
- corpus finding: Level 9 Quick Check #2 asks the same Early Game / no Play-Save / no 5 Stall / Tempo Clue question
- verdict reason: exact cognitive duplicate of the Quick Check; a full CQ page is unjustified

### 7. `level-9-extinguish-good-touch` — KEEP

- risk: medium
- source rule: extinguishing Early Game clues excludes Play Clues that violate Good Touch
- learning objective: reject an apparently mandatory red clue touching duplicate red 1s
- critical variable: two untouched copies of the same identity are touched by one clue
- competing move checked: give the apparent Play Clue vs allow unknown discard
- physical state: 🟢 PASS
- verdict reason: concrete exception application with a plausible wrong action; not covered by the current Quick Checks

### 8. `level-9-extinguish-order-cm` — KEEP

- risk: high
- source rule: Early Game extinguishing excludes cards that will almost certainly be Order Chop Moved by an upcoming player with two or more 1s clued
- prerequisite source: Level 4 OCM; skipping one equivalent unknown 1 tells the **next player** to Chop Move one card
- learning objective: recognize when a real Save target will be protected before its owner's discard
- critical variables: Bob acts before Cathy; Bob has two equally clued 1s; Cathy's chop is a real red 5 Save target
- defects found: legacy version used a non-Save red 4 and incorrectly moved Bob's own chop
- state action: rebuilt around Bob -> Cathy OCM and Cathy's red 5
- competing moves checked: immediate 5 Save vs allow OCM protection
- timeline/reaction: 🟢 PASS against pinned Level 4 + Level 9 source
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: strong interaction/timeline question after complete premise reconstruction

### 9. `level-9-double-discard` — KEEP

- risk: medium
- source rule: DDA can begin after the previous player discards **or misplays** a card
- learning objective: transfer the familiar double-discard danger to the misplay boundary
- competing move checked: ordinary chop discard vs mandatory clue/Stall
- state action: discarded red 4 is represented as table history; Bob's chop remains epistemically unknown
- physical state: 🟢 PASS
- corpus note: Quick Check #5 uses the ordinary discard version, while this CQ tests the separate `misplay` branch of the formal definition
- verdict reason: meaningful boundary extension rather than duplicate recall

### 10. `level-9-locked-clue-resource` — KEEP

- risk: medium
- source rule: at 0 clues the team must generate a clue for a Locked player; with exactly 1 clue they must not steal it from that player
- learning objective: preserve the final clue resource immediately before a Locked player's turn
- defects found: historical clue state was rendered as current clue arrows; player order did not make Cathy act immediately after Alice
- state action: player order is Alice -> Cathy -> Bob; Cathy's Locked information is represented as notes, not current actions
- competing move checked: spend last clue on unrelated low-value action vs preserve it
- physical/timeline state: 🟢 PASS
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: resource/timing decision not duplicated by a Level 9 Quick Check

### 11. `level-9-five-stall-collective` — KEEP

- risk: medium
- source rule: the team must collectively perform one 5 Stall if possible; additional 5 Stalls are optional
- learning objective: distinguish collective obligation from per-5 obligation
- defect found: prose said Donald acts, but Donald did not exist in the diagram
- state action: scenario now explicitly returns the turn to Alice; Alice is the clue giver in the state
- competing move checked: second 5 Stall vs enter Mid-Game
- text/state consistency: 🟢 PASS
- verdict reason: useful collective-resource boundary not present in the Quick Checks

### 12. `level-9-five-stall-distance` — KEEP

- risk: medium
- source rule: 5 Stall must target the off-chop 5 closest to chop
- learning objective: apply distance ordering even when the closer target's owner already has two playable cards
- critical variable: one-away vs two-away distance
- mutation check: swapping the two distances swaps the required target
- defect found: old diagram visually leaked the answer through clue styling
- state action: neutralized target clues; owner knowledge/playables are center notes
- physical state: 🟢 PASS
- verdict reason: direct but useful spatial ordering application matching the official edge example

### 13. `level-9-five-stall-last-resort` — KEEP

- risk: medium
- source rule: 5 Stall is last resort; cluer must not have an immediate play or known safe discard
- learning objective: prefer a known play over an otherwise legal-looking 5 Stall
- critical variable: Alice knows her slot 1 is playable red 2
- competing moves checked: play vs 5 Stall
- mutation check: removing Alice's known play restores the possible 5-Stall line, subject to other prerequisites
- physical state: 🟢 PASS as an epistemic/abstract self-hand state
- verdict reason: concrete action choice; not duplicated by current Quick Checks

### 14. `level-9-finesse-position-exception` — KEEP

- risk: high
- source rule: FPE only applies if the Finesse Position card can actually be Finessed/gotten before its owner acts
- learning objective: reject FPE when the last clue is consumed and the owner reaches their turn first
- critical variables: 1 clue; Alice -> Bob -> Cathy order
- competing moves checked: direct Play Clue vs 5 Stall under hypothetical FPE
- timeline/reaction: 🟢 PASS; this is essentially the pinned source counterexample
- physical state: 🟢 PASS
- verdict reason: important negative boundary with timing causality

### 15. `level-9-finesse-position-exception-positive` — KEEP

- risk: high
- source rule: FPE is available when another player can actually Finesse the card
- learning objective: positive contrast to #14
- critical variables: Alice starts with 2 clues; Bob acts before Cathy and still has one clue after the 5 Stall
- defect found: old prose incorrectly said Cathy would play before her normal turn
- text action: Bob now gives the Finesse clue before Cathy acts; Cathy blind-plays red 1 on her own turn
- timeline/reaction: 🟢 PASS
- physical state: 🟢 PASS for 4-player hand size and copies
- verdict reason: controlled contrast whose resource/timing mutation changes the answer

### 16. `level-9-fill-in` — KEEP

- risk: medium
- source rule: Fill-In touches only already-clued/Chop-Moved cards, adds new information, and is only interpreted specially in eligible Stalling Situations
- learning objective: classify a rank clue as Fill-In under DDA rather than an ordinary Play/Finesse meaning
- defect found during breaker: old filler red 5 created a higher-priority normal Save Clue; historical green clue was rendered as a current action
- state action: removed accidental Save target; historical green knowledge is a center note; number 3 would touch only the already-clued green 3
- competing moves checked: normal Play/Save/5 Stall vs Fill-In
- physical/state consistency: 🟢 PASS
- verdict reason: contextual interpretation task that is not duplicated by current Quick Checks

### 17. `level-9-hard-burn` — KEEP

- risk: medium
- source rule: Hard Burn is not an Early Game Stall and is lower precedence in more severe Stalling Situations
- learning objective: reject a no-information re-clue as a fabricated Early Game action
- defect found: historical 5 clue was rendered as a current arrow
- state action: Bob's knowledge of blue 5 is a center note; Alice is the current clue giver
- competing move checked: Hard Burn vs required discard
- physical state: 🟢 PASS
- verdict reason: distinct Stall Table boundary not covered by a Quick Check

### 18. `level-9-locked-hand-save` — KEEP

- risk: high
- source rule: LHS may save any chop card, not only critical/playable, when no higher-precedence clue exists and the clue does not Lock the recipient
- learning objective: positive LHS case
- critical variable: Cathy's target is ordinary/nonplayable and the clue leaves other unclued cards
- defects found: legacy `type`/knowledge inversion, playable target contradiction, then impossible rank-4 multiplicities after the first repair
- state action: rebuilt with physically legal card copies, stacks at 2, ordinary red 4 on Cathy's chop, and no visible higher-precedence action
- competing moves checked: normal Play/Save, 5 Stall, Tempo vs LHS
- physical state: 🟢 PASS
- corpus note: Quick Check #6 states the general rule, but this CQ is retained as the positive contrast anchor for #19
- verdict reason: justified controlled contrast rather than standalone duplicate

### 19. `level-9-locked-hand-save-locks` — KEEP

- risk: high
- source rule: a clue that would Lock the recipient cannot be interpreted as LHS
- learning objective: distinguish the negative boundary from #18
- critical variable: four Cathy cards are already clued; current red clue touches the last completely unclued chop card
- defects found: legacy reality/knowledge inversion, historical arrows, impossible card multiplicities
- state action: physically legal rebuild; four historical card states use center notes; the red clue to Cathy is the single current clue action
- competing interpretations checked: LHS vs ordinary Play/Save interpretation
- physical state: 🟢 PASS
- diagram semantics: 🟡 PENDING rendered inspection
- verdict reason: strong negative half of the #18/#19 controlled contrast

### 20. `level-9-anxiety-play` — DELETE

- risk: medium
- source rule: a Locked player deliberately left at 0 clues should play the most-likely playable card; on a tie, the leftmost candidate is playable
- semantic correctness: 🟢 PASS
- corpus finding: Level 9 Quick Check #7 already asks what leaving a Locked player at 0 means and gives the same most-likely / leftmost tie resolution
- additional concern: existing diagram uses an epistemic abstraction rather than a fully objective exact-card table state, which would require an explicit declared POV representation if retained
- verdict reason: exact cognitive duplicate; no need to preserve a full page and a more complicated state merely to repeat the Quick Check

### 21. `level-9-eight-clue-save` — KEEP

- risk: medium
- source rule: at 8 clues in Mid-Game, 8CS may save any non-slot-1 card when no higher-precedence clue exists
- learning objective: establish the baseline arbitrary-card 8CS case used by the more difficult Finesse contrast questions
- defect found during breaker: old state contained several immediately playable visible cards, contradicting the premise that no higher-precedence clue existed
- state action: rebuilt with stacks at 2 and no visible normal Play/Save/5/Tempo higher-priority option; target is an ordinary off-slot-1 card
- physical state: 🟢 PASS
- verdict reason: useful baseline/contrast anchor for #2/#3, not merely a standalone flashcard

### 22. `level-9-eight-clue-slot-one` — DELETE

- risk: low
- source rule: 8CS cannot target slot 1
- semantic correctness: 🟢 PASS after making the current yellow clue action explicit in the diagram
- corpus finding: Level 9 Quick Check #8 asks exactly whether 8CS can be used on slot 1 and gives the same ordinary Play/Save interpretation
- verdict reason: exact cognitive duplicate with no additional interaction or transfer

## Corpus-level observations

### Controlled contrasts worth keeping

- #2 / #3: same Finesse-shaped action, with one critical change — whether a higher-precedence Stall is visibly available.
- #14 / #15: same FPE family, with clue resource / timing changed so the Finesse is unreachable vs reachable.
- #18 / #19: LHS is allowed when it does not Lock the recipient, and disallowed when the same class of save would complete the Lock.

### Quick Check duplication removed

Delete recommendations:

- #5 duplicates Quick Check #3;
- #6 duplicates Quick Check #2;
- #20 duplicates Quick Check #7;
- #22 duplicates Quick Check #8.

The DDA CQ #9 is retained despite topical overlap with Quick Check #5 because the CQ specifically tests the formal `misplay` branch, whereas the Quick Check uses the ordinary preceding discard case.

### Remaining gates

- deterministic state preflight: wired into `npm run lint`; CI result still required on the final head;
- ordinary structural/lint/build CI: required on the final head;
- focused rendered reader / visual QA for changed Level 9 diagrams: **⚪ NOT RUN**;
- legacy fresh-blind isolation: **🟡 PENDING**; this recovery audit cannot retroactively erase prior Solution exposure;
- deletion cleanup: the four `DELETE` pages should be removed from EN/RU/sidebar only after this audit verdict is accepted as the Level 9 corpus decision.

Current lifecycle: `candidate`.
