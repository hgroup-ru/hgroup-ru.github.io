# Level 15 — Truth vs. Occam

**Статус:** `candidate`  
**Сложность переноса:** `low` — YML и точечное подключение к странице; перед PR нужна semantic review состояния.

## Что предлагаем upstream

Рассмотреть существующую учебную диаграмму H-Group RU для соответствующего раздела Level 15 как дополнение к официальной странице.

**Что показывает:** Показывает выбор Reverse Finesse вместо более простого Double Bluff: Bob's Truth Principle здесь имеет приоритет над Occam's Razor.
**Зачем:** сложный пример уже имеет визуальное представление и не требует отдельного renderer.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/level-15/local-truth-vs-occam.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-15/local-truth-vs-occam.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/level-15.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-15.mdx)

## Provenance

Это **локальный teaching YML H-Group RU, построенный по тексту примера**, а не официальный YML upstream. Состояние нельзя выдавать за official diagram до review upstream-maintainers.

## Перед PR

Проверить текущий Level 15, отсутствие эквивалентной official diagram и семантическую точность состояния относительно текста.

## Как переносить

Перенести YML и минимальное подключение к MDX через существующий upstream renderer. Русские подписи/текст не переносить.

**QA:** проверить YML/schema, render и соответствие состояния правилу/примеру.

**Draft PR:** `Add a teaching diagram to Level 15`
