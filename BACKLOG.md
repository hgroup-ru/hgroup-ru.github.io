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

### Upstream drift check перед крупными продуктовыми изменениями

Перед следующим большим product batch запустить ручной [`Maintenance Audit`](.github/workflows/maintenance-audit.yml) и проверить, совпадает ли закреплённая revision из [`upstream.json`](upstream.json) с текущим official upstream.

Не обновлять pin автоматически только ради свежести. Если drift не затрагивает наш scope или не даёт полезных изменений, оставить текущую revision.

## Кандидаты для исходного проекта

Ошибки и улучшения, которые потенциально относятся не только к русской версии, ведутся отдельно в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md). Не дублировать их здесь.
