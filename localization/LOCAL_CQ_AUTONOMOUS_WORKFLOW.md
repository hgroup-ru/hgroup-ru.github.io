# Автономный workflow для Local Challenge Questions

Этот документ превращает правила из `LOCAL_CHALLENGE_QUESTIONS.md` и `LOCAL_CHALLENGE_AUDIT_PROTOCOL.md` в обязательный release contract для следующих уровней. Цель: человеческое ревью должно быть финальной редакторской/визуальной вычиткой, а не основным способом находить ошибки Hanabi-семантики, POV, таймлайна и диаграмм.

## 1. Design matrix до авторинга

До MDX/YML для каждого кандидата фиксируются: точное source rule из pinned upstream, learning objective, misconception/boundary, question type, modality, critical variable, reasoning POV, strongest competing move/interpretation, risk tier и причина, почему это не дубль Quick Check/соседнего CQ. Кандидат без реального decision boundary удаляется до авторинга; количество вопросов не является целью.

## 2. Mutation twin для high-risk

Для каждого high-risk CQ (Finesse/Bluff, precedence, asymmetric information, multi-turn timing, OCM, Locked Hand и другие хрупкие handcrafted states) до semantic freeze строится внутренняя A/B-пара. Меняется только declared critical variable, и ответ либо decisive reasoning должен предсказуемо измениться. Публиковать twin необязательно. Если чистую mutation построить нельзя, concept ещё не доказан.

## 3. Явный POV proof

Для medium/high-risk CQ отдельно фиксируются objective physical truth, что reasoning player видит, что он действительно знает из clues/history и что знают другие игроки, если на их реакции опирается Solution. `type` в YML — объективная карта, а не знание владельца. Рассуждение по точной карте в собственной руке запрещено без основания в history/notes.

При необходимости используется таблица вида:

| факт              | objective | Alice knows | Bob knows | Cathy knows |
| ----------------- | --------- | ----------- | --------- | ----------- |
| Alice slot 1 = r2 | yes       | no          | yes       | yes         |

Semantic review должен рассуждать из masked POV, а не из omniscient state.

## 4. Opposite-answer breaker

До финального Solution отдельный breaker получает только Question/state/source rules и обязан: решить blind; перечислить credible Play/Save clues, plays, discards и special moves; проверить precedence/last-resort; seating/timing; forcedness будущих реакций; явно попытаться доказать противоположный ответ; отдельно спросить, не может ли текущий actor сам сделать действие, которое proposed line зачем-то делегирует следующему игроку.

High-risk `KEEP` блокируется, если opposite-answer попытка находит сопоставимо правдоподобную legal line.

## 5. Hanabi noise sweep

После фиксации логики проверяются каждая заметная 5, playable/critical/chop card, clusters одинаковых ranks/colors, необычная clued hand, возможный Save/Tempo/Stall, known trash/safe discard. Для каждой детали должен существовать ответ: `required by proof`, `intentional distractor and checked` или `remove`. Filler не должен случайно вводить более простую convention или делать руку искусственной.

## 6. Leakage sweep

Отдельно проверяются title/sidebar label/caption/`bigText`/`below`/`middleNote`/borders/clue arrows. Названия `Finesse`, `Bluff`, `Prompt`, `DDA`, `Anxiety`, `Chop Move` и т.п. подозрительны, если распознавание этой техники — cognitive target. Historical clue нельзя рисовать как current clue action.

## 7. Timeline proof

Для вопроса с несколькими действиями фиксируется evaluation moment и доказывается цепочка `pre-state -> action -> post-state -> action -> question-state`. Stacks, hands/draws, clues, notes, chop/Finesse Position и current player должны относиться к одному моменту диаграммы. Post-action stack нельзя объявлять ошибкой только потому, что prose начался с более раннего pre-state; сначала выравнивается timeline. Но historical clue arrow в post-state остаётся ошибкой.

## 8. Diagram story и knowledge-state в Solution

Если решение зависит от перехода между двумя моментами, а одна статичная картинка заставляет читателя мысленно восстанавливать действие, предпочтительны две отдельные диаграммы: **trigger/action state** и **post-action state**. В trigger-state текущая подсказка должна иметь `clueGiver` и реальные clue arrows. В post-action state стрелка убирается, stacks/рука обновляются, новая карта после play/discard приходит в slot 1, а историческая информация остаётся только через knowledge representation (`middleNote`, уже затронутую карту и т.п.).

Если основной педагогический смысл Solution состоит в том, **кто что должен записать или понять**, в Solution следует добавлять отдельную answer/knowledge diagram с итоговыми `middleNote`/`below`-состояниями. Такая диаграмма живёт только во вкладке Solution и не считается допустимой причиной для answer leakage в Question. Question diagrams по-прежнему должны быть нейтральными.

Все YML-состояния локального CQ — `question.yml`, дополнительные transition/clue states и `answer.yml`/solution states — должны проходить state preflight, а не только первая картинка вопроса.

## 9. Проза после semantic freeze

Порядок работы: `source -> design matrix -> physical state -> POV proof -> mutation twin -> breaker -> noise/leakage -> semantic freeze -> EN editorial -> RU editorial -> EN/RU parity`. Не полировать текст позиции, которая ещё не прошла semantic gates.

## 10. Regression taxonomy

Каждый human-found defect становится постоянным regression class. Обязательные проверки сейчас включают: невозможные copies/hand sizes/stacks; prose и diagram в разных timeline moments; historical clue как current action; owner knowledge из objective identity; later player делает действие, доступное текущему actor; future reaction merely possible вместо forced/uniquely best; answer leakage; filler 5/Save/Tempo noise; искусственная hand shape; ненужное hypothetical wording в concrete state; Quick Check/CQ duplicate; actor/recipient/turn/Finesse Position mismatch между prose и YML; post-play/post-discard hand без новой карты в slot 1; multi-step reasoning, сжатое в одну диаграмму так, что читатель вынужден восстанавливать ключевой переход в голове; Solution с нетривиальными note updates без наглядного knowledge-state там, где он существенно облегчает проверку понимания.

## 11. Evidence как release gate

Для configured Levels каждый опубликованный CQ должен иметь machine-readable audit record минимум с `id`, `risk`, `source_rule`, `learning_objective`, `question_type`, `modality`, `critical_variable`, `pov_player`, blind/ambiguity, opposite-answer breaker, actor-direct-alternative check, mutation result (или обоснованное N/A), noise, leakage, timeline, physical-state и итоговым `KEEP | REWRITE | DELETE`.

CI проверяет полноту evidence и объективные invariants, но не объявляет Hanabi-семантику доказанной: semantic conclusions остаются model-reviewed evidence.

## 12. Human review только после production deploy

Release loop: `candidate -> semantic/deterministic QA -> green CI -> merge main -> public deploy -> human final read -> targeted fixes -> repeat`. Нельзя просить человека читать branch/PR/unpublished candidate. Production-deployed Level с pending human acceptance ещё не `clean-baseline`.

## 13. Exit criterion

Перед передачей Level человеку автор обязан для каждого опубликованного CQ четырьмя короткими фразами объяснить: что именно он проверяет; почему ответ однозначен; какая сильнейшая альтернатива проверена и почему отпала; какая mutation меняет ответ/reasoning. Если один из четырёх ответов слабый, CQ ещё не готов к human review.
