# MDX-derived Knowledge Catalog

**Статус:** `candidate`  
**Сложность переноса:** `high` — генератор формирует общий data layer, от которого зависят несколько UI-фич.

## Что предлагаем upstream

Получать структурированный каталог страниц, sections, aliases, Levels и Variant-Specific из canonical MDX вместо отдельного ручного каталога.

**Зачем:** Один источник данных уменьшает дублирование и позволяет строить Reference, Learning Path и другие discovery-интерфейсы поверх существующего контента.

## Текущая реализация

- [`scripts/generateProductData.mts`](../../../scripts/generateProductData.mts)

## Перед PR

Проверить текущую структуру MDX и генерации данных upstream; убедиться, что аналогичный catalog layer ещё не появился.

## Как переносить

Перенести locale-neutral parsing/generation. Русские labels, aliases и локальные content overrides не переносить.

**QA:** Сверить generated entries с MDX, проверить стабильность anchors/redirects и выполнить проверки текущего upstream.

**Draft PR:** `Add an MDX-derived knowledge catalog`
