# Бэклог H-Group RU

Здесь находятся только открытые задачи и идеи, которые ещё требуют отдельного продуктового, редакционного или технического решения. Завершённая работа в этом файле не архивируется: история остаётся в Git и в [журнале изменений](CHANGELOG.md).

## Продукт

### Прогресс обучения и готовность

«Мой уровень» уже реализован как постоянная пользовательская настройка Beginner / Levels 1–25.

Отдельным будущим продуктовым блоком остаются completion, review и readiness. Если completion появится, он должен быть явным действием пользователя, а не автоматически следовать из прокрутки страницы или открытия ответа.

### Контекстный возврат

Проверить необходимость отдельного Contextual Back только после реального использования обычной browser history, canonical links и сохранения состояния поиска в URL.

Не восстанавливать старую floating-кнопку только ради соответствия retired RU runtime.

### Тематическая навигация

Оценить пользу topic chips или другого тематического browse-режима для Справочника и Словаря. Не добавлять вторую ручную классификацию, если ту же задачу можно надёжно решить из существующих данных.

### Просмотр диаграмм

Возвращаться к отдельному полноэкранному diagram modal только если текущих zoom/pan-возможностей Mermaid и штатных H-Group diagrams реально недостаточно.

При реализации обязательны корректные close, Escape, backdrop и focus/accessibility semantics.

### Широкие таблицы

Добавлять отдельные стрелки или другие controls для широких таблиц только после подтверждённой проблемы текущего horizontal-overflow UX Docusaurus.

### Дополнительные клавиатурные сокращения

Текущую клавиатурную навигацию расширять только после отдельной оценки пользы. Возможные кандидаты: дополнительные переходы между Levels, ToC stepping и более быстрый выбор уровня.

### Главная страница для возвращающегося игрока

Позже можно оценить более насыщенный Home/dashboard для пользователя с сохранённым «Мой уровень»: например, более явное продолжение Learning Path. Product V1 намеренно оставляет главную страницу компактной.

## Локальные учебные диаграммы

Следующие места прошли редакторский review, но возможные дополнительные teaching diagrams остаются отдельными решениями. Ни один пункт не означает автоматического добавления авторской схемы:

- [`extras/ejections`](i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections.mdx) — Trash Push Ejection / Bad Chop Move Ejection;
- [`extras/special-bluffs`](i18n/ru/docusaurus-plugin-content-docs/current/extras/special-bluffs.mdx) — Pass / Double Pass / Triple Pass Bluff;
- [`extras/pushes-pulls`](i18n/ru/docusaurus-plugin-content-docs/current/extras/pushes-pulls.mdx) — Trash Pull и взаимодействие с Trash Double Ignition;
- [`extras/play-clues`](i18n/ru/docusaurus-plugin-content-docs/current/extras/play-clues.mdx) — Continuation Clue внутри/снаружи Layered Finesse;
- [`variant-specific/up-or-down`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down.mdx) — U-Turn Finesse;
- [`variant-specific/no-positive-clues`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues.mdx) — Transparent Double Bluff;
- [`variant-specific/odds-and-evens`](i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens.mdx) — 5 Odd Ejection.

## Лицензирование и атрибуция

Провести отдельный licensing review после Product V1:

- проверить лицензию и требования attribution исходного `hanabi/hanabi.github.io`;
- подтвердить условия публикации русских переводов, Training Questions и локальных teaching diagrams;
- проверить лицензии сторонних зависимостей и словарей, включая `@cspell/dict-ru_ru`;
- проверить полноту [`LICENSE`](LICENSE), [`LOCALIZATION_NOTICE_RU.md`](LOCALIZATION_NOTICE_RU.md) и [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md);
- убедиться, что условия внешних contributions корректно отражены в [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Кандидаты для исходного проекта

Ошибки и улучшения, которые потенциально относятся не только к русской версии, ведутся отдельно в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md). Не дублировать их здесь.
