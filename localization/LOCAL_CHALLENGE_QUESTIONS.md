# Авторинг и ревью Local Challenge Questions

Этот документ — канонический **редакционный и semantic-стандарт** для Local Challenge Questions H-Group RU. Он отвечает на вопрос: **что делает задачу достойной публикации?**

Исполняемый Definition of Done, machine-readable evidence, deterministic gates и lifecycle находятся отдельно в [`LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](LOCAL_CQ_AUTONOMOUS_WORKFLOW.md). Не дублируйте release contract здесь.

Local Challenge Questions являются локальным учебным материалом и **не являются Official Challenge Questions H-Group**. Официальные материалы сохраняются source-faithfully.

## 1. Публикационный критерий

Хороший CQ заставляет применить материал, распознать boundary, interaction, misconception, interpretation или временную причинность. Он не существует только потому, что в Level есть раздел про соответствующую convention.

Для каждого кандидата должно быть понятно:

- зачем он нужен;
- какую правдоподобную ошибку диагностирует;
- что игрок поймёт лучше после Solution.

Главный тест:

> Если бы эту задачу прислал живой автор для сильного учебника по Hanabi, оставили бы мы её как есть?

Не существует квоты на число CQ. Несколько сильных вопросов лучше механического покрытия каждого абзаца Level.

## 2. Сначала проектируется learning task

До prose определите:

- source rule из pinned upstream;
- learning objective и misconception/boundary;
- question type: `best_move`, `legality`, `interpretation` или `deduction`;
- modality: `can`, `should`, `must`, `only_if`;
- critical variable;
- reasoning POV и critical timeline;
- strongest competing move/interpretation;
- нужна ли позиция, одна диаграмма или timeline.

Один CQ имеет одну главную педагогическую цель; несколько conventions нужны только когда именно их interaction является целью.

По умолчанию предпочтительна конкретная игровая ситуация. Концептуальный вопрос допустим, когда он чище проверяет настоящую boundary/precedence, чем искусственная полная раздача.

Каждый вопрос self-contained. Он может требовать материал текущего и предыдущих Levels, но не будущие refinements.

## 3. Однозначность: blind solve, breaker, mutation

Question сначала решается **без Solution**. По title, prose и question-state ревьюер должен получить intended answer из доступной игроку информации, а не из намерения автора.

Если остаётся вторая сопоставимо правдоподобная line, CQ не готов.

При adversarial review обязательно спросите:

- почему не strongest alternative;
- существует ли более простой Play/Save Clue, play или discard;
- есть ли precedence или last-resort restriction;
- не используется ли hidden/future knowledge;
- forced/uniquely best ли ключевая будущая reaction;
- может ли текущий actor сам сделать действие, которое Solution зачем-то поручает следующему игроку.

Не чините ambiguity оговоркой только в Solution: меняйте Question/state.

### Mutation и minimal state

Назовите critical variable и измените только её. Answer или decisive reasoning должны предсказуемо поменяться. Если не меняются из-за более простой причины, intended concept декоративен.

Удаляйте лишние условия по одному. Оставшаяся деталь должна быть необходимой или осознанным проверенным distractor, а не искусственным шумом.

Controlled contrast полезен: две почти одинаковые позиции могут обе быть нужны, если одна причинная переменная меняет ответ. Плохой дубль повторяет тот же cognitive task под другими цветами.

## 4. POV, epistemics, physical state и timeline

Всегда различайте:

- объективное физическое состояние;
- что игрок видит;
- что он уже знает/вывел.

`type` карты в YML не означает, что владелец знает exact identity. Reasoning не может использовать будущую информацию.

Для значимых predicates (`playable`, `known`, `critical`, chop, Finesse Position, clues) фиксируйте момент timeline, в котором они истинны. Seating order является частью state, если влияет на доступность реакции.

Локальная позиция должна быть физически возможна: hand size, card copies, stacks/discard, draw shifts, clue touches, slots, clue count и turn order должны согласовываться между prose и diagrams.

Если Solution прогнозирует будущие действия партнёров, каждый решающий переход должен быть forced/uniquely best либо не влиять на вывод.

## 5. Диаграммы — часть reasoning

Диаграмма нужна, когда card order/spatial state существенно влияет на ответ. Несколько простых states лучше одной перегруженной картинки, если задача многошаговая.

Question diagrams нейтральны: title, captions, `bigText`, notes, borders и labels не должны выдавать cognitive target. Эпистемически корректная annotation всё равно может быть педагогическим spoiler.

Для multi-step задачи естественная модель:

`State 0 -> action -> State 1 -> action -> State 2 -> question`.

Существенная история не должна существовать только в prose, если её нормально представить states. Текущая clue рисуется как действие только на соответствующем кадре; historical clue не изображается current arrow.

Если Solution по сути отвечает **«что игрок теперь записывает/понимает на своих картах?»**, knowledge-state diagram обычно является частью хорошего feedback. Точный обязательный diagram/release contract находится в [`LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](LOCAL_CQ_AUTONOMOUS_WORKFLOW.md).

## 6. Solution — feedback, а не второй источник правил

Хорошая Solution:

1. сразу отвечает;
2. называет решающий факт;
3. объясняет причинную цепочку;
4. разбирает strongest wrong answer, когда это полезно;
5. не подменяет reasoning названием convention.

При сравнении линий объясняйте **first divergence** — первую точку, где последствия различаются. Короткий counterfactual полезен, если показывает, какой один факт сделал бы альтернативу правильной.

Solution не должна впервые вводить правило/refinement/exception, без которого Question нельзя решить. Это либо `CQ bug`, либо `documentation gap`; gap исправляется в основной документации, а не прячется в Solution.

## 7. Corpus quality и граница с Quick Checks

После page-level review проверяется набор:

- semantic duplicates против полезных controlled contrasts;
- gaps в важных boundaries/misconceptions;
- перекос по типам reasoning и yes/no;
- knowledge ceiling и progression;
- recency bias и слабый transfer;
- title/metadata leakage;
- повторение того же cognitive task в Quick Check.

Quick Check может проверять базовый invariant, а CQ — применение среди competing lines. Если оба проверяют ровно одну и ту же мысль, один слой лишний, если только baseline не нужен как осмысленный contrast anchor.

Publication CQ, teaching example и internal regression fixture — разные артефакты. Полезный edge case не обязан быть хорошей публичной задачей.

Результат editorial review: `KEEP`, `REWRITE` или `DELETE`. Это **semantic verdict**, не lifecycle status и не синоним `clean-baseline`.

## 8. EN/RU editorial quality

EN и RU проходят самостоятельные editorial passes, затем parity check по условиям, доступной информации, modality, intended answer и reasoning.

RU должен звучать как естественный русскоязычный Hanabi-текст, а не механический перевод EN:

- нормальный порядок слов и длина предложений;
- никакого канцелярита и случайного Runglish;
- стабильная утверждённая терминология;
- точная modality/epistemic strength;
- естественные captions и diagram labels.

Для конкретного неудачного розыгрыша в живой CQ-прозе допустима естественная формулировка **«взорвал/взорвала карту»**, когда речь именно о произошедшем bomb/misplay. `мисплей` сохраняется, когда называется техническое понятие `misplay`; не возвращайте механическое `сделал/сделала мисплей` только ради буквального соответствия английскому слову.

## 9. Rendered reader pass

Новый или изменённый diagram/timeline CQ перед release читается в интерфейсе как ученик:

`title -> Question -> diagram/timeline -> самостоятельное решение -> Solution`.

Это editorial/semantic reader pass, а не browser smoke. Он проверяет text↔diagram consistency, понятность timeline, notes/labels, leakage и то, что визуальная композиция действительно помогает reasoning.

Технические требования к browser visual QA, evidence, production-first human review и clean-baseline не повторяются здесь — они определены в [`LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](LOCAL_CQ_AUTONOMOUS_WORKFLOW.md).

Текущий scope, frozen/deferred Levels и acceptance state являются **project state**, а не вечными editorial-правилами. Их источники истины: [`QA_COVERAGE.md`](QA_COVERAGE.md), [`LOCAL_CQ_QA_SCOPE.json`](LOCAL_CQ_QA_SCOPE.json) и [`../BACKLOG.md`](../BACKLOG.md).
