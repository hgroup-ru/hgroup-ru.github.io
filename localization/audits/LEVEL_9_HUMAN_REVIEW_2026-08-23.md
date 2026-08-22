# Level 9 Local Challenge Questions — second human review

Date: 2026-08-23
Source boundary: `hanabi/hanabi.github.io@1ef83242d71c62f2db6422f09e83abddba9611dd`
Reviewer: human site review after the first Level 9 repair was deployed.

## Accepted review findings and fixes

- CQ 3 `level-9-eight-clue-finesse-readable`: replaced the hypothetical "if the Finesse is otherwise valid" wording with a concrete conclusion, because this question already defines a specific position in which the Finesse is valid.
- CQ 5 `level-9-early-game-ending`: Russian wording now says Cathy "взорвала карту" instead of the unnatural transliteration "сделала мисплей"; the solution uses "взрыв карты" consistently.
- CQ 9 `level-9-double-discard`: Russian wording now says Alice "случайно взорвала" red 4, including the formal DDA explanation.
- CQ 14 `level-9-finesse-position-exception`: removed the `Finesse` label from Cathy's card; the question must require the reader to identify Finesse Position rather than printing the answer on the diagram.
- CQ 15 `level-9-finesse-position-exception-positive`: previous state was not a clean positive control because Alice could herself use the visible connector to give the Finesse. Rebuilt the control so the connecting red 2 is in Alice's own hand and known to her; Alice cannot clue her own card, while Bob can clue it after the 5 Stall and before Cathy's turn.
- CQ 19 `level-9-locked-hand-save-locks`: replaced Cathy's implausible four-1 hand with four already-clued non-playable 4s. The final red clue still locks her hand and is an ordinary Play Clue on playable red 3.
- CQ 20 `level-9-anxiety-play`: removed the 5 from Cathy's chop to avoid an irrelevant Save/5 distraction; the chop is now purple 4.

## QA state

- Semantic review of the seven reported points: 🟢 PASS after the targeted rewrites above.
- Exact card multiplicity / hand-size preflight: must pass in PR CI before merge.
- RU production build: must pass in PR CI before merge.
- Browser visual QA: ⚪ NOT RUN in automation; final subjective visual acceptance remains a human site-review gate after deployment.
