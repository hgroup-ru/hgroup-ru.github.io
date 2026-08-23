# Release contract для Local Challenge Questions

Этот документ — исполняемый Definition of Done для Local Challenge Questions. Редакционные критерии хорошего вопроса живут в [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md); здесь не повторяется теория авторинга, а фиксируется, **какое evidence обязано существовать перед merge/deploy и перед clean-baseline**.

`LOCAL_CHALLENGE_QUESTIONS.md` отвечает на вопрос «хорош ли материал?». Этот файл отвечает на вопрос «доказали ли мы это достаточно строго для выпуска?». Исторический `LOCAL_CHALLENGE_AUDIT_PROTOCOL.md` оставлен только как redirect на этот контракт.

## 1. Scope сначала классифицируется

Канонический scope deterministic QA находится в [`LOCAL_CQ_QA_SCOPE.json`](LOCAL_CQ_QA_SCOPE.json). Для каждого Level, где существуют Local Challenge Questions, каждая проверка обязана явно классифицировать Level как:

- `enforced` — gate реально запускается и блокирует CI;
- `deferred` — Level ещё не мигрирован на этот gate.

Level не может отсутствовать в обеих группах и не может находиться в обеих одновременно. CI сверяет конфиг с фактически опубликованными `level-N-*.mdx`, поэтому новый Level нельзя добавить и случайно забыть классифицировать.

`deferred` — не PASS и не освобождение от качества. Это только явная граница текущей автоматизации.

## 2. Design evidence до авторинга

Для каждого нового/существенно переписываемого CQ до prose фиксируются: точное source rule из pinned upstream, learning objective, misconception/boundary, question type, modality, critical variable, reasoning POV, strongest competing move/interpretation и risk tier.

Кандидат без реального decision boundary удаляется до авторинга. Количество вопросов не является целью. Quick Check и соседний CQ отдельно проверяются на cognitive duplicate.

## 3. High-risk proof

Для high-risk CQ (Finesse/Bluff, precedence, asymmetric information, multi-turn timing, OCM, Locked Hand и другие хрупкие handcrafted states) обязательны:

1. **masked POV proof** — objective truth отделён от того, что reasoning player видит/знает;
2. **mutation twin** — меняется только critical variable, а answer/reasoning предсказуемо меняется;
3. **opposite-answer breaker** — blind solve без Solution, перечисление credible alternatives и попытка доказать противоположный ответ;
4. **actor-direct-alternative check** — может ли текущий actor сам сделать действие, которое proposed line зачем-то поручает следующему игроку;
5. **reaction robustness** — будущая ключевая реакция должна быть forced/uniquely best либо несущественной для вывода.

Если breaker находит сопоставимо правдоподобную legal line, `KEEP` блокируется.

## 4. Physical state и timeline

Для каждого diagram-state проверяются как минимум hand size, physical copy limits, stacks/discard, clue legality, slots, turn order и отсутствие одной физической копии в нескольких местах.

Для multi-step CQ фиксируется evaluation moment и цепочка:

`pre-state -> action -> post-state -> action -> question-state`.

После play/discard replacement draw приходит в slot 1/newest. Stacks, hands, clues, notes и current player должны принадлежать одному моменту timeline.

## 5. Diagram roles и action/history contract

Роль state определяется **тем, где YML реально используется в MDX**, а не только именем файла. State, который рендерится внутри вкладки Solution, считается solution/knowledge-state для deterministic gate даже если файл назван не `answer.yml`.

Для trigger/action state:

- текущий clue имеет `clueGiver`;
- реальные clue arrows показывают только действие, происходящее на этом кадре.

Для post-action/solution knowledge-state:

- historical clue не остаётся current arrow;
- `clueGiver` текущего действия убран;
- historical knowledge показывается через принятую knowledge notation;
- objective identity не подменяет знание владельца.

Если ключевой переход трудно восстановить по одной статичной картинке, используются отдельные **trigger/action state** и **post-action state**.

## 6. Answer/knowledge diagrams

Если педагогический смысл Solution состоит в том, **кто что теперь должен записать или понять на картах**, отдельная answer/knowledge diagram обязательна, если это знание естественно представляется состоянием карт.

Она показывает только итоговое полезное знание в принятой локальной нотации:

- неизвестная собственная карта не превращается в объективную `r2`/`b3` только потому, что её знает зритель;
- для Finesse неизвестная карта обычно остаётся `type: x`, а вывод показывается через `above`/`below` или другую уже принятую knowledge notation;
- ложная промежуточная гипотеза удаляется после reveal;
- не добавляются декоративные `Play`/`Bluff`/`Finesse` labels без реального semantic основания;
- не дублируется очевидная objective identity (`Blue 1` над уже видимой синей 1);
- historical clue не рисуется current arrow.

Question diagrams остаются нейтральными и не получают derived conclusion из Solution.

## 7. Noise и leakage sweeps

Перед semantic freeze выполняются два отдельных прохода.

**Hanabi noise:** каждая заметная 5, playable/critical/chop card, cluster одинаковых ranks/colors, необычная clued hand, Save/Tempo/Stall и known safe discard должны быть `required by proof`, `intentional distractor and checked` или удалены.

**Leakage:** отдельно проверяются title, slug/sidebar/search label, captions, `bigText`, `below`, `middleNote`, borders и clue arrows. Эпистемически истинная annotation всё равно запрещена, если выдаёт cognitive target.

## 8. Prose только после semantic freeze

Порядок работы:

`source -> design evidence -> physical state -> POV -> mutation -> breaker -> noise/leakage -> semantic freeze -> EN editorial -> RU editorial -> EN/RU parity`.

Не полировать prose позиции, которая ещё не доказана семантически.

## 9. Release evidence schema

Для каждого Level в `release_evidence.enforced` существует `localization/audits/LEVEL_N_LOCAL_CQ_AUDIT.json`.

Исполняемый schema определяется `scripts/checkLocalChallengeQuestionAudits.mts`; документация не должна поддерживать второй, расходящийся JSON-schema. В текущем release evidence обязательны:

- `id`, `risk`, `source_rule`, `learning_objective`;
- `question_type`, `modality`, `critical_variable`, `pov_player`;
- `blind_answer`, `ambiguity`;
- `opposite_answer_breaker`, `actor_direct_alternative`, `mutation`, `noise`;
- `leakage`, `timeline`, `physical_state`;
- `verdict`.

`source_revision` должен **точно** совпадать с `upstream.json`. Audit IDs должны быть уникальны и в точности совпадать с опубликованными CQ IDs Level.

Для release evidence status-поля начинаются только с `pass` или `N/A`; после них можно добавить короткое проверяемое пояснение. Свободная строка вроде `looks good` не является PASS.

Рабочий editorial review до выпуска по-прежнему может иметь `KEEP | REWRITE | DELETE`. Release evidence содержит только опубликованный прошедший набор, поэтому его `verdict` — `KEEP`.

## 10. Deterministic gates

`npm run lint` запускает:

- общий CQ structural check;
- Local CQ state preflight для `state_preflight.enforced`;
- release-evidence check для `release_evidence.enforced`;
- остальные общие project checks.

State preflight проверяет **все YML/YAML states** в enforced Levels. Solution-role states дополнительно блокируются, если:

- остался `clueGiver: true`;
- осталась текущая `clue` arrow;
- exact objective card identity используется как носитель owner knowledge через `middleNote`/`above`/`below`.

Deterministic PASS не доказывает Hanabi semantics и не разрешает выдумывать status labels по контексту.

## 11. Regression taxonomy

Каждый подтверждённый human-found defect становится постоянным regression class. Обязательный semantic sweep включает:

- impossible copies/hand sizes/stacks;
- prose и diagram в разных timeline moments;
- historical clue как current action;
- owner knowledge из objective identity;
- later player делает действие, доступное текущему actor;
- future reaction merely possible вместо forced/uniquely best;
- answer leakage;
- filler 5/Save/Tempo noise и искусственные руки;
- hypothetical wording в уже concrete state;
- Quick Check/CQ cognitive duplicate;
- actor/recipient/turn/Finesse Position mismatch;
- post-play/post-discard hand без replacement draw в slot 1;
- multi-step reasoning, сжатое в один кадр до потери понятности;
- нет answer knowledge-state при существенных note updates;
- ложная промежуточная заметка после reveal;
- необоснованный status-label в итоговом knowledge-state.

## 12. Lifecycle: KEEP != clean-baseline

Разделяются три вещи:

- **semantic verdict `KEEP`** — вопрос достоин публикации и прошёл semantic gates;
- **technical-pass** — применимые deterministic/browser checks зелёные;
- **clean-baseline** — technical-pass + завершённая required human acceptance.

Rendered reader pass — обязательная часть release review для нового/изменённого diagram/timeline CQ. Он отличается от browser smoke: человек/модель читает `title -> Question -> diagrams -> самостоятельное решение -> Solution` как ученик, а browser QA проверяет реальный rendering/geometry/runtime.

При изменении diagrams/renderer/layout browser visual QA обязателен. Если среда не позволяет реально открыть rendered site, статус остаётся **⚪ NOT RUN**; source/static checks нельзя выдавать за visual PASS.

## 13. Production-first human review

Наш release loop:

`candidate -> semantic/deterministic QA -> green CI -> merge main -> public deploy -> human final read -> targeted fixes -> repeat`.

Человека не просят вычитывать branch/PR/unpublished candidate. Production-deployed Level с pending human acceptance остаётся `technical-pass`, но не `clean-baseline`.

## 14. Exit criterion

Перед передачей Level человеку для каждого опубликованного CQ должны существовать четыре коротких ответа:

1. что именно он проверяет;
2. почему ответ однозначен;
3. какая сильнейшая альтернатива проверена и почему отпала;
4. какая mutation меняет ответ/reasoning.

Если один ответ слабый, CQ ещё не готов к human review.
