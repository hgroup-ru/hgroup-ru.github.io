# Бэклог H-Group RU

Здесь находятся только открытые задачи и идеи, которые ещё требуют отдельного продуктового, редакционного или технического решения. Завершённая работа в этом файле не архивируется: история остаётся в Git и в [журнале изменений](CHANGELOG.md).

## Продукт

### Интерактивные многошаговые примеры

Исследовать возможность превратить часть статических Hanabi-примеров в последовательность состояний, которую можно проматывать по ходам.

Желаемый UX:

- кнопки предыдущего/следующего шага;
- короткая подпись к каждому ходу;
- подсветка карт, которые важны на текущем шаге;
- возможность показать, например, выдачу Finesse, выделить все карты connection, а затем пошагово показать их розыгрыш;
- при необходимости — стрелки или другие лёгкие annotations поверх состояния.

Первый milestone — один proof-of-concept на хорошем многошаговом Finesse-примере.

Реализация должна расширять существующую модель Hanabi diagrams/states, а не создавать отдельный game engine или второй SPA-runtime. Без JS исходный MDX и статическая версия примера должны оставаться читаемыми.

### Просмотр диаграмм

Возвращаться к отдельному полноэкранному diagram modal только если текущих zoom/pan-возможностей Mermaid и штатных H-Group diagrams реально недостаточно.

При реализации обязательны корректные close, Escape, backdrop и focus/accessibility semantics.

### Широкие таблицы

Добавлять отдельные стрелки или другие controls для широких таблиц только после подтверждённой проблемы текущего horizontal-overflow UX Docusaurus.

## Редакционный и semantic QA

### Полная ручная вычитка Local Challenge Questions

После исторических level-by-level audits и global red-team остаётся human-grade proofreading активного Local CQ corpus.

Текущий порядок работы определяется не датированным pre-proof report, а [`localization/QA_COVERAGE.md`](localization/QA_COVERAGE.md), machine-readable scope [`localization/LOCAL_CQ_QA_SCOPE.json`](localization/LOCAL_CQ_QA_SCOPE.json) и фактически начатым level-by-level проходом. Датированные Markdown reports в [`localization/audits/`](localization/audits/) являются historical evidence и могут относиться к старому source revision или состоянию YML.

При вычитке:

- читать Question и Solution как полноценный учебный материал, а не только искать структурные ошибки;
- проверять естественность русского текста, modality, POV/epistemics, chronology и достаточность объяснения;
- сравнивать EN/RU там, где формулировка вызывает сомнение;
- не считать предыдущие PASS доказательством идеальности;
- исправлять подтверждённые defects и превращать повторяемые классы ошибок в regression rules/deterministic gates;
- после semantic/CI pass сначала выкатывать candidate на public site и только затем отдавать его на финальную human read.

Текущее QA-покрытие и его границы фиксируются в [`localization/QA_COVERAGE.md`](localization/QA_COVERAGE.md). Нормативный Local CQ release contract — [`localization/LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](localization/LOCAL_CQ_AUTONOMOUS_WORKFLOW.md).

## Локальные учебные диаграммы

### Расширить coverage в Extras и Variant-Specific

Автоматически пройти Extras и подходящие Variant-Specific материалы, найти длинные или многошаговые примеры без достаточной визуализации и составить ranked candidate list.

Для сильных кандидатов подготовить локальные teaching YML/diagrams, прогнать schema/render/semantic QA и затем показать человеку готовую галерею для содержательной приёмки.

Не добавлять авторские схемы только ради количества: каждая должна объяснять реальную сложную структуру примера лучше текста.

Текущие известные кандидаты:

- [`extras/ejections`](i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections.mdx) — Bad Chop Move Ejection;
- [`extras/special-bluffs`](i18n/ru/docusaurus-plugin-content-docs/current/extras/special-bluffs.mdx) — Pass / Double Pass / Triple Pass Bluff;
- [`extras/pushes-pulls`](i18n/ru/docusaurus-plugin-content-docs/current/extras/pushes-pulls.mdx) — Trash Pull и взаимодействие с Trash Double Ignition;
- [`extras/play-clues`](i18n/ru/docusaurus-plugin-content-docs/current/extras/play-clues.mdx) — Continuation Clue внутри/снаружи Layered Finesse.

## Сопровождение upstream

### Следующий upstream localization batch: Level 10 + Special-Fives

Drift audit от закреплённой revision `1ef83242d71c62f2db6422f09e83abddba9611dd` до official upstream `7ec4381a6a01803cafa73bf925be3daec4c14d02` нашёл 4 коммита и только 2 затронутые страницы.

Следующий batch:

- [`docs/level-10.mdx`](i18n/ru/docusaurus-plugin-content-docs/current/level-10.mdx) — добавить новый **Directness Principle**: при одинаковом результате предпочитать менее сложную линию; «одинаковый результат» включает не только сыгранные карты, но и одинаковые superpositions на всех подсказанных картах;
- [`docs/variant-specific/special-fives.mdx`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/special-fives.mdx) — синхронизировать **Color Promise / Color Play Clue Lie**: исключений теперь явно два, а «неправильный» цвет может получать дополнительные карты только в той же руке и той же подсказкой.

Порядок работы: перевести оба изменения source-faithfully, выполнить semantic/progression review, прогнать `validate` и RU build, затем только после принятия обновить [`upstream.json`](upstream.json) до `7ec4381a6a01803cafa73bf925be3daec4c14d02` и синхронизировать maintainer state.

До завершения batch текущий upstream pin не двигать: audit зафиксирован, но перевод ещё не интегрирован.

## Кандидаты для исходного проекта

Ошибки и улучшения, которые потенциально относятся не только к русской версии, ведутся отдельно в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md). Не дублировать их здесь.
