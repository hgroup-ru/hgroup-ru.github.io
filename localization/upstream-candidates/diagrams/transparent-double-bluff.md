# Variant-Specific — Transparent Double Bluff

**Статус:** `candidate`  
**Сложность переноса:** `medium` — teaching YML уже существует, но текущая локальная схема использует `clueArrow: true`, которого нет в upstream renderer на закреплённой revision.

## Что предлагаем upstream

Рассмотреть локальную учебную диаграмму H-Group RU для примера _Transparent Double Bluff_ в `variant-specific/no-positive-clues`.

**Что показывает:** две последовательные blind-play и изменение знания получателя подсказки: первая очевидная интерпретация цели оказывается неверной, а после второго blind-play остаётся множество допустимых one-away-from-playable карт.

**Зачем:** текстовый пример требует отслеживать одновременно реальную карту, ожидаемую интерпретацию Боба и то, как после двух blind-play меняется знание Дональда. Двухфазная схема делает этот reasoning явным.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues/transparent-double-bluff.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues/transparent-double-bluff.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/no-positive-clues.mdx)

## Provenance

Это **локальный teaching YML H-Group RU, построенный по официальному текстовому примеру**, а не official upstream YML. Не выдавать его за official diagram до review upstream-maintainers.

## Перед PR

Проверить текущий upstream-раздел, отсутствие эквивалентной official diagram и ещё раз подтвердить knowledge states до и после двух blind-play.

Отдельно решить renderer dependency: либо перенести минимальную поддержку arrow-only clue marker, либо адаптировать схему так, чтобы не изображать variant-specific clue как обычную color/rank clue.

## Как переносить

Перенести YML и минимальное подключение к MDX. Если сохраняется `clueArrow`, отдельно перенести минимальную renderer/schema поддержку без изменения обычного `clue` behavior.

**QA:** schema/render, semantic review knowledge flow, проверка отсутствия ложной позитивной clue-информации.

**Draft PR:** `Add a Transparent Double Bluff teaching diagram`
