# Бэклог H-Group RU

Здесь находятся только открытые задачи и идеи, которые ещё требуют отдельного продуктового, редакционного или технического решения. Завершённая работа в этом файле не архивируется: история остаётся в Git и в [журнале изменений](CHANGELOG.md).

## Продукт

### Jeff's 2-player Score Hunting Guide — BLOCKED

**BLOCKED pending Jeff permission.** Не переводить, не публиковать и не продолжать research по этому материалу до явного разрешения Jeff/IAMJEFF на локализацию и публикацию.

После получения разрешения вернуться к задаче отдельным решением: зафиксировать точную source revision, требования к attribution и допустимый scope перевода, а затем локализовать source-faithfully. До этого момента задача остаётся в бэклоге только как blocker record.

Источник на текущем сайте ведёт в репозиторий IAMJEFF (`iamwhoiamhahaha/hanabi`, `2-player/Score_Hunting_Guide.md`). Не представлять этот внешний материал как официальный H-Group text, если источник сам этого не утверждает.

Selfish Conventions и Number Mute links, которые находятся рядом в том же source-блоке, не включать автоматически в scope этой задачи; оценить их отдельно при инвентаризации 2-player ресурсов.

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

### Local Challenge Questions: одинаковый аудит и оставшиеся Levels

Сначала провести fresh page-by-page ruthless audit локальных Challenge Questions **Levels 9–22** по [`localization/LOCAL_CHALLENGE_QUESTIONS.md`](localization/LOCAL_CHALLENGE_QUESTIONS.md). Предыдущий PASS, массовый screening или недавняя правка не заменяют нового независимого review.

Для каждой страницы требуются blind solve, самостоятельные EN и RU editorial passes, EN ↔ RU parity, Solution review, adversarial/mutation checks, POV/epistemics/timeline и явный `KEEP / REWRITE / DELETE`. В рабочем evidence дополнительно отмечать, совпадает ли learning objective с Quick Check: `none` или `intentional prerequisite`.

**Levels 2–8 остаются заморожены** для повторного аудита Official Challenge Questions и официального материала.

После стабилизации Levels 9–22 отдельно подготовить локальные Challenge Questions для **Levels 23–25**. Обычные Level pages 23–25 существуют, но отдельный локальный challenge-question coverage для них нужно проектировать с нуля по актуальному стандарту; не выдавать его за Official Challenge Questions и не оптимизировать количество страниц.

Изменения интегрировать разумными небольшими batches/PR, даже если методологически аудит всего диапазона является единым проходом.

### Аудит встроенных Quick Checks

После стабилизации Local Challenge Questions отдельно пройти короткие вопросы `Тренировочные вопросы`, встроенные в Levels, и привести их к роли **Quick Checks / Быстрой самопроверки**, не смешивая их с Local Challenge Questions.

Для каждого вопроса применить лёгкий `KEEP / REWRITE / DELETE` review по [`localization/QUICK_CHECKS.md`](localization/QUICK_CHECKS.md): сохранить полезные micro-cases на boundary, modality, precedence и misconception; definition/vocabulary recall переписать в короткое применение либо удалить, если отдельной педагогической функции нет.

Начать с калибровки на Levels 10, 1 и 25, затем масштабировать аудит на Levels 1–25. В Levels 2–8 можно редактировать только локальный Quick Check layer; это не основание заново аудировать Official CQ, source text или official diagrams.

Проверить наборы целиком: не дублируют ли Quick Checks cognitive task уже существующего Local Challenge Question, не возникли ли искусственные квоты, и достаточно ли естественно написан русский текст. Не превращать Quick Checks в скрытый второй набор Challenge Questions.

Сейчас Quick Checks являются RU-only локальным слоем. Подготовка английских версий и предложение этого формата upstream **не входят в текущий план**; решение можно пересмотреть отдельно позже.

### Level 10: возможный вопрос про Double Gentleman's Discard

При следующем полном review Level 10 отдельно решить, нужен ли локальный Challenge Question на запрещённый **Double Gentleman's Discard** и связанную с ним asymmetric-information ошибку из Common Mistakes.

Не добавлять вопрос автоматически ради coverage. Сначала проверить, добавляет ли он самостоятельную педагогическую ценность по сравнению с уже сильным набором Level 10, и при необходимости заменить им более слабый/избыточный вопрос, а не просто увеличивать количество страниц.

Хороший кандидат должен проверять именно misconception «если для наблюдателя discard мог означать две identities, значит он переносит обе», а не просить пересказать запрет из текста Level.

### Аудит внешних англоязычных материалов и ссылок

Автоматически проинвентаризировать пользовательские ссылки по всему RU-сайту, которые ведут на внешние текстовые материалы и могут оставлять читателя на английской странице: GitHub `blob`/`raw`, Markdown/MDX-файлы, внешние guides, appendices, examples и аналогичные документы.

Каждую такую ссылку классифицировать:

- официальный H-Group upstream material;
- сторонний авторский ресурс;
- source/attribution link, который должен оставаться внешним;
- техническая или служебная ссылка, не являющаяся частью пользовательского reading flow.

Для пользовательских англоязычных материалов, которые реально нужны русской версии:

- если это официальный материал из нашего pinned upstream, локализовать его source-faithfully и опубликовать на нормальном RU destination;
- если это сторонний ресурс, сначала зафиксировать точную revision/version и проверить license/permission и attribution; переносить перевод к нам только когда это разрешено;
- сохранить авторство и оригинальную source-ссылку рядом с локальной версией, когда это важно для provenance;
- после появления локальной версии заменить пользовательские переходы на canonical RU-link, не удаляя необходимый source/attribution access;
- если републикация невозможна по лицензии или разрешению, не копировать текст молча: отдельно решить допустимый RU-сопроводительный вариант и сохранить внешний источник;
- прогнать link QA, чтобы не осталось маршрутов, где русская статья неожиданно отправляет пользователя читать английский файл только потому, что так было устроено в upstream.

Этот аудит должен включать не только основной H-Group repository: внешние репозитории и авторские guides тоже входят в scope.

### QA coverage registry

Продумать лёгкий способ фиксировать, какие материалы уже прошли отдельные виды review: source-fidelity, Local Challenge Questions, Quick Checks, diagram review и whole-site consistency.

Цель — при будущих обновлениях перепроверять в первую очередь новые и изменившиеся материалы, а не запускать полный ручной аудит всего сайта с нуля.

Не превращать registry в тяжёлую ручную базу данных или формальную бюрократию.

### Единый audit pipeline

По возможности свести повторяемые проверки в один воспроизводимый pipeline/report: upstream drift, структура, терминология, подозрительные translation pairs, Local Challenge Questions, Quick Checks, ссылки, labels/consistency и diagram coverage.

Итог должен быть ориентирован на проблемы и предлагаемые исправления, чтобы человеку не приходилось вручную просматривать успешные проверки.

## Contributor experience

### CI autofix для внешних контрибьюторов

Добавить безопасный механизм автоматического исправления технических ошибок в PR от внешних контрибьюторов там, где исправление детерминировано и не меняет смысл материала.

В первую очередь рассмотреть:

- Prettier и другие formatter-only исправления;
- простые ESLint fixes, для которых `--fix` не меняет семантику;
- нормализацию trailing newline / whitespace и аналогичные механические проблемы;
- при необходимости — понятный комментарий CI о том, что было исправлено автоматически, а что осталось ручным.

Отдельно проверить модель GitHub permissions для fork PR. Нельзя небезопасно выполнять непроверенный код из внешнего PR с write-token или secrets. Если прямой push в ветку автора невозможен или небезопасен, выбрать безопасную архитектуру: например, разделить untrusted validation и privileged autofix, использовать maintainer-triggered workflow либо выдавать готовый patch/commit suggestion.

Autofix не должен пытаться самостоятельно исправлять source-fidelity, терминологические решения, смысл Hanabi-конвенций или другие semantic failures. Такие проверки должны оставаться diagnostic-only и объяснять контрибьютору, что именно нужно решить.

### Ревизия публичной документации для контрибьюторов

Вычитать Markdown-документы публичного репозитория как contributor-facing продукт и определить, какие из них действительно нужны внешнему участнику, насколько понятно они написаны и нет ли там исторического или внутреннего maintainer-контекста, который только мешает.

Начальный scope включает как минимум `README.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `LOCALIZATION_NOTICE_RU.md`, `Reference.md` и другие корневые/служебные `.md`, которые видит потенциальный контрибьютор. Для каждого файла классифицировать назначение: onboarding, contribution workflow, архитектура, provenance/legal, compatibility redirect, maintainer-only или кандидат на удаление/слияние.

Проверить:

- понятно ли человеку без внутреннего контекста, что это за проект и куда отправлять разные типы правок;
- достаточно ли короток путь от README до первого успешного PR;
- не дублируют ли README/CONTRIBUTING/ARCHITECTURE друг друга;
- актуальны ли команды, CI expectations, naming/branch conventions и описание структуры репозитория;
- хорошо ли объяснена граница между upstream H-Group content и локальными RU-дополнениями;
- нет ли инструкций, которые нужны только maintainers и должны жить в приватном maintainer repo;
- можно ли что-то сократить, объединить или удалить без потери полезного contributor guidance;
- нужны ли дополнительные короткие разделы вроде «быстрый старт», «что можно править», «как проверить изменение» и «что произойдёт после открытия PR».

Результатом должен быть конкретный proposal по каждому contributor-facing `.md`: оставить, переписать, сократить, дополнить, объединить, перенести или удалить. После согласования сделать один компактный docs cleanup batch, а не серию косметических PR.

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

### Upstream drift check перед крупными продуктовым изменениями

Перед следующим большим product batch сравнить закреплённую revision из [`upstream.json`](upstream.json) с текущим official upstream и понять, появились ли изменения MDX/YML/структуры, которые разумнее забрать до новой реализации.

Не обновлять pin автоматически только ради свежести. Если drift не затрагивает наш scope или не даёт полезных изменений, оставить текущую revision.

## Кандидаты для исходного проекта

Ошибки и улучшения, которые потенциально относятся не только к русской версии, ведутся отдельно в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md). Не дублировать их здесь.
