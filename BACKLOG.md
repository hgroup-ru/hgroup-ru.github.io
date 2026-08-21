# Бэклог H-Group RU

Здесь находятся только открытые задачи и идеи, которые ещё требуют отдельного продуктового, редакционного или технического решения. Завершённая работа в этом файле не архивируется: история остаётся в Git и в [журнале изменений](CHANGELOG.md).

## Продукт

### Jeff's 2-player Score Hunting Guide — DEFERRED / BLOCKED

Не считать это текущей задачей. Возвращаться к локализации или републикации только после явного разрешения Jeff/IAMJEFF и отдельного решения о source revision, attribution и допустимом scope.

До этого момента внешний материал остаётся внешним. Не представлять его как официальный H-Group text и не блокировать им остальную работу проекта.

### Контекстный возврат

Проверить необходимость отдельного Contextual Back только после реального использования обычной browser history, canonical links и сохранения состояния поиска в URL.

Не восстанавливать старую floating-кнопку только ради соответствия retired RU runtime.

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

После завершённых level-by-level audits, глобального red-team и pre-proof triage остаётся отдельный human-grade proofreading pass по активному корпусу из 242 Local Challenge Questions.

[`localization/CQ_PREPROOF_AUDIT_2026-08-20.md`](localization/CQ_PREPROOF_AUDIT_2026-08-20.md) содержит механическую pre-proof проверку и рекомендуемый порядок ручного чтения. Этот report — guide по приоритетам, а не доказательство отсутствия semantic/editorial defects.

При вычитке:

- читать Question и Solution как полноценный учебный материал, а не только искать структурные ошибки;
- проверять естественность русского текста, modality, POV/epistemics, chronology и достаточность объяснения;
- сравнивать EN/RU там, где формулировка вызывает сомнение;
- не считать предыдущие PASS доказательством идеальности;
- исправлять только подтверждённые defects и оставлять короткий audit trail для реально изменённых вопросов.

**Official Challenge Questions и официальный материал Levels 2–8 остаются заморожены** для повторного аудита; Local CQ proofreading не является основанием автоматически открывать этот scope.

Текущее QA-покрытие и его границы фиксируются в [`localization/QA_COVERAGE.md`](localization/QA_COVERAGE.md).

### Единый audit pipeline / report orchestration

Свести оставшиеся повторяемые maintenance-проверки в более удобный problem-oriented workflow там, где это реально снижает ручную работу.

Уже существуют отдельные deterministic guards для Local CQ structure и document-like external links; не дублировать их новым скриптом ради одного названия pipeline.

Оставшийся полезный scope: upstream drift, terminology, suspicious translation pairs, labels/cross-consistency candidates и diagram coverage, с итоговым report, ориентированным на проблемы и предлагаемые действия, а не на длинный список успешных проверок.

Semantic/cross-consistency verdicts не автоматизировать: pipeline может собирать кандидатов, но не решать за человека, является ли отличие ошибкой, progression или допустимой формулировкой.

## Contributor experience

### Fork-safe CI autofix для внешних контрибьюторов

Текущий `/format` уже решает formatter-only исправления для авторизованных same-repository PR. Оставшийся scope — безопасная архитектура для fork PR.

Нельзя выполнять непроверенный код из fork с write-token или secrets. Предпочтительный дизайн:

- untrusted validation формирует диагностический результат и при необходимости patch/diff artifact;
- privileged шаг запускается только после явного maintainer action и заново проверяет точный PR/head;
- deterministic formatter/fixer применяется из доверенного workflow;
- если безопасный push в fork невозможен, пользователю выдаётся готовый patch/suggestion вместо обхода permission model.

Autofix не должен исправлять source-fidelity, терминологические решения, смысл Hanabi-конвенций или другие semantic failures. Такие проверки остаются diagnostic-only.

### Ревизия публичной документации для контрибьюторов

Вычитать Markdown-документы публичного репозитория как contributor-facing продукт и определить, какие из них действительно нужны внешнему участнику, насколько понятно они написаны и нет ли там исторического или внутреннего maintainer-контекста.

Начальный scope включает как минимум `README.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LOCALIZATION_NOTICE_RU.md`, `Reference.md` и другие корневые/служебные `.md`, которые видит потенциальный контрибьютор.

Для каждого файла классифицировать назначение: onboarding, contribution workflow, архитектура, provenance/legal, compatibility redirect, maintainer-only или кандидат на удаление/слияние.

Проверить:

- понятно ли человеку без внутреннего контекста, что это за проект и куда отправлять разные типы правок;
- достаточно ли короток путь от README до первого успешного PR;
- не дублируют ли README/CONTRIBUTING/ARCHITECTURE друг друга;
- актуальны ли команды, CI expectations и описание структуры репозитория;
- хорошо ли объяснена граница между upstream H-Group content и локальными RU-дополнениями;
- нет ли инструкций, которые нужны только maintainers и должны жить в приватном maintainer repo;
- можно ли что-то сократить, объединить или удалить без потери полезного contributor guidance.

Результатом должен быть конкретный proposal по каждому contributor-facing `.md`, затем один компактный docs cleanup batch.

## Локальные учебные диаграммы

### Расширить coverage в Extras и Variant-Specific

Автоматически пройти Extras и подходящие Variant-Specific материалы, найти длинные или многошаговые примеры без достаточной визуализации и составить ranked candidate list.

Для сильных кандидатов подготовить локальные teaching YML/diagrams, прогнать schema/render/semantic QA и затем показать человеку готовую галерею для содержательной приёмки.

Не добавлять авторские схемы только ради количества: каждая должна объяснять реальную сложную структуру примера лучше текста.

Текущие известные кандидаты:

- [`extras/ejections`](i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections.mdx) — Trash Push Ejection / Bad Chop Move Ejection;
- [`extras/special-bluffs`](i18n/ru/docusaurus-plugin-content-docs/current/extras/special-bluffs.mdx) — Pass / Double Pass / Triple Pass Bluff;
- [`extras/pushes-pulls`](i18n/ru/docusaurus-plugin-content-docs/current/extras/pushes-pulls.mdx) — Trash Pull и взаимодействие с Trash Double Ignition;
- [`extras/play-clues`](i18n/ru/docusaurus-plugin-content-docs/current/extras/play-clues.mdx) — Continuation Clue внутри/снаружи Layered Finesse;
- [`variant-specific/up-or-down`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down.mdx) — U-Turn Finesse;
- [`variant-specific/no-positive-clues`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues.mdx) — Transparent Double Bluff;
- [`variant-specific/odds-and-evens`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens.mdx) — 5 Odd Ejection.

## Сопровождение upstream

### Upstream drift check перед крупными продуктовыми изменениями

Перед следующим большим product batch сравнить закреплённую revision из [`upstream.json`](upstream.json) с текущим official upstream и понять, появились ли изменения MDX/YML/структуры, которые разумнее забрать до новой реализации.

Не обновлять pin автоматически только ради свежести. Если drift не затрагивает наш scope или не даёт полезных изменений, оставить текущую revision.

## Кандидаты для исходного проекта

Ошибки и улучшения, которые потенциально относятся не только к русской версии, ведутся отдельно в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md). Не дублировать их здесь.
