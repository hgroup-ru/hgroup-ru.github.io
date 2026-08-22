# Исполняемый аудит Local Challenge Questions

Этот документ дополняет [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md). Основной документ остаётся редакционным и semantic-стандартом. Здесь зафиксирована **Definition of Done** для полного аудита: какие результаты должны существовать, чтобы `KEEP`, `REWRITE` или `DELETE` считались доказанными.

Главная причина этого протокола: декларации вида `semantic/adversarial audit complete` и агрегаты вида `23 KEEP` сами по себе не являются evidence. Полный аудит должен оставлять проверяемые per-question результаты.

## 1. Независимый blind solve

Blind solve выполняется **до чтения Solution и intended answer**.

Ревьюеру доступны только:

- title и Question;
- question-state diagram / scenario timeline;
- официальный материал текущего и предыдущих Levels из закреплённого upstream.

До открытия Solution фиксируются:

- `blind_answer`;
- краткое решающее reasoning;
- существенно правдоподобные competing moves / interpretations;
- `ambiguity: yes/no`.

Если остаются два сопоставимо правдоподобных ответа, verdict не может быть `KEEP`.

## 2. Обязательный adversarial breaker

После blind solve вопрос специально пытаются сломать. Для применимых случаев надо явно проверить и записать:

- другой normal Play Clue;
- другой normal Save Clue;
- обычный или специальный discard;
- известный play / known safe discard;
- Stall с более высокой precedence;
- более простую valid interpretation;
- last-resort ограничение;
- hidden/future knowledge;
- seating order и момент истинности temporal predicates;
- forced / uniquely-best ли ключевые будущие реакции партнёров.

`checked alternatives: none` допустимо только для действительно простого legality/deduction вопроса и требует краткого объяснения.

Нельзя чинить найденную неоднозначность только дополнительной оговоркой в Solution: меняется Question/state либо verdict становится `DELETE`.

## 3. State preflight

Для каждого локального question-state сначала проверяются объективные инварианты. Всё, что можно надёжно автоматизировать, должно постепенно становиться blocking check.

Минимум:

- размер руки соответствует числу игроков;
- физически возможное количество копий карт: 1 — три, 2/3/4 — две, 5 — одна на масть;
- stacks/discard/hands не используют одну физическую копию дважды;
- stacks согласуются с playability, criticality и trash claims;
- clue count и turn order согласуются с prose;
- заявленные clue touches законны;
- chop/Finesse Position находятся в реальных слотах;
- history, borders и notes не противоречат состоянию.

Автоматический PASS не доказывает semantic correctness.

## 4. Обязательный minimal-state и mutation check

Для situational/high-risk CQ фиксируется `critical_variable`.

Затем:

1. удаляются несущественные условия/карты; всё оставшееся должно быть необходимо либо осмысленным distractor;
2. critical variable мысленно меняется при сохранении остального состояния;
3. intended answer/reasoning должен измениться предсказуемо, если вопрос действительно проверяет эту boundary.

Если ответ остаётся тем же по более простой причине, заявленный learning objective декоративен: `REWRITE` или `DELETE`.

## 5. Diagram semantic contract для Local CQ

Для локальных YML действует явное разделение:

- `type` — **объективная реальная карта/физическое состояние**;
- `middleNote` — знание/заметка владельца карты, когда её нужно показать читателю;
- `clue` / `clueArrow` — **подсказка, происходящая на изображённом шаге**;
- `border` — состояние карты как уже затронутой/подсказанной, без ложной стрелки текущего действия.

Историческую подсказку нельзя изображать как текущую clue arrow. Question-state не должен показывать derived conclusion, который и является задачей ученика. Эпистемически истинная annotation всё равно является leakage, если выдаёт cognitive target.

Для многошаговой задачи существенная история оформляется явными переходами `State -> action -> State`, а не молча кодируется несовместимыми notes/arrows.

## 6. Comparison с Solution

Только после фиксации blind result открывается Solution.

В audit record записываются:

- `intended_answer`;
- совпадает ли он с `blind_answer`;
- совпадает ли решающая причинность;
- вводит ли Solution новое правило/refinement, отсутствующее в Question prerequisites;
- главный wrong answer и почему он неверен.

Ответ совпал, но reasoning существенно другой — это не автоматический PASS, а повод для semantic investigation.

## 7. EN / RU после стабилизации семантики

Сначала фиксируется игровая семантика и state. Затем выполняются:

1. самостоятельный EN editorial pass;
2. самостоятельный RU editorial pass;
3. EN <-> RU parity.

Не тратьте editorial pass на позицию, которая ещё не прошла state/adversarial gates.

## 8. Rendered reader pass

Для нового или изменённого diagram/timeline CQ перед `KEEP` требуется rendered reader pass:

`title -> Question -> diagram/timeline -> самостоятельное решение -> Solution`.

Проверяются отдельно:

- clipping/overflow;
- читаемость middle notes/labels;
- лишние clue arrows;
- неверные/current-vs-historical annotations;
- answer leakage;
- text <-> diagram consistency;
- визуальная понятность chop/Finesse Position/turn state.

Технический browser smoke не заменяет этот editorial/semantic reader pass.

## 9. Per-question audit record обязателен

Полный audit считается выполненным только если для каждого CQ существует запись примерно такого вида:

```yaml
id: level-N-example
risk: low | medium | high
source_rule: ...
learning_objective: ...
misconception_or_boundary: ...
question_type: best_move | legality | interpretation | deduction
modality: can | should | must | only_if
critical_variable: ...

blind_answer: ...
blind_reason: ...
ambiguity: false
competing_moves_checked:
  - move: ...
    result: ...

physical_state: PASS | FAIL | N/A
pov_epistemics: PASS | FAIL
timeline_reactions: PASS | FAIL | N/A
mutation_minimal_state: PASS | FAIL | N/A
diagram_semantics: PASS | FAIL | N/A
answer_leakage: PASS | FAIL

intended_answer: ...
solution_match: PASS | FAIL
reason_for_verdict: ...
verdict: KEEP | REWRITE | DELETE
```

Не нужно хранить скрытый chain-of-thought. Нужны только проверяемые conclusions, alternatives, invariants и причины verdict.

## 10. Blocking rules

`KEEP` запрещён, если:

- blind solve неоднозначен;
- physical state невозможен;
- найден competing move/interpretation, который делает intended answer неуникальным;
- reasoning использует недоступное POV/future knowledge;
- ключевая будущая reaction лишь удобна автору, но не forced/uniquely best;
- diagram противоречит prose или раскрывает ответ;
- обязательный gate не имеет evidence.

Агрегат вида `N KEEP / M REWRITE / K DELETE` разрешён только как **вычисленный итог per-question records**.

## 11. Risk tiers для существующего корпуса

- `low`: текстовый legality/deduction вопрос без сложной позиции/timeline;
- `medium`: одна позиция с competing moves или существенным POV;
- `high`: Finesse/Bluff, multi-turn reasoning, precedence, asymmetric information, OCM, Locked Hand, сложный handcrafted YML.

Legacy `KEEP` не освобождает вопрос от нового протокола. High-risk вопросы проходят полный pipeline. Для low-risk допускается сокращённая запись, но blind answer, ambiguity, source rule и reason-for-verdict обязательны всегда.

## 12. Что считается доказательством полного Level audit

Для Level audit нужны одновременно:

1. per-question records для всех CQ;
2. список `KEEP / REWRITE / DELETE`, вычисленный из records;
3. все `REWRITE` либо исправлены и повторно прошли gates, либо остаются явными blockers;
4. corpus-level review на duplicates, gaps, progression, recency bias и knowledge ceiling;
5. применимый deterministic QA;
6. rendered reader/visual QA для изменённых diagrams;
7. никаких формулировок `audit complete`, если хотя бы один обязательный пункт имеет `FAIL`, `PENDING` или `NOT RUN`.
