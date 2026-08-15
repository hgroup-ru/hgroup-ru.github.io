# Level 24 — Unnecessary UTD / BCME

**Статус:** `candidate`  
**Сложность переноса:** `low` — YML и точечное подключение к странице; перед PR нужна semantic review состояния.

## Что предлагаем upstream

Рассмотреть существующую учебную диаграмму H-Group RU для соответствующего раздела Level 24 как дополнение к официальной странице.

**Что показывает:** Показывает Example 3: Unnecessary Unknown Trash Discharge сначала вызывает blind-play синей 2, а затем читается как Bad Chop Move Ejection с синей 3.
**Зачем:** сложный пример уже имеет визуальное представление и не требует отдельного renderer.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/level-24/local-unnecessary-utd-bcme.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-24/local-unnecessary-utd-bcme.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/level-24.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-24.mdx)

## Provenance

Это **локальный teaching YML H-Group RU, построенный по тексту примера**, а не официальный YML upstream. Состояние нельзя выдавать за official diagram до review upstream-maintainers.

## Перед PR

Проверить текущий Level 24, отсутствие эквивалентной official diagram и семантическую точность состояния относительно текста.

## Как переносить

Перенести YML и минимальное подключение к MDX через существующий upstream renderer. Русские подписи/текст не переносить.

**QA:** проверить YML/schema, render и соответствие состояния правилу/примеру.

**Draft PR:** `Add a teaching diagram to Level 24`
