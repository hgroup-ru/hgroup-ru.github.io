# Structured Reference

**Статус:** `candidate`  
**Сложность переноса:** `high` — UI опирается на generated catalog, ranking и canonicalization redirects.

## Что предлагаем upstream

Добавить компактный Reference с поиском по pages/sections, aliases, ranked results, canonical links и алфавитным browse.

**Зачем:** Reference становится инструментом быстрого поиска правила, не дублируя сами объяснения.

## Текущая реализация

- [`src/components/ReferenceExplorer/index.tsx`](../../../src/components/ReferenceExplorer/index.tsx)
- [`src/components/ReferenceExplorer/styles.module.css`](../../../src/components/ReferenceExplorer/styles.module.css)
- [`src/components/ProductSearchResultList/index.tsx`](../../../src/components/ProductSearchResultList/index.tsx)
- [`src/utils/productSearch.ts`](../../../src/utils/productSearch.ts)
- [`i18n/ru/docusaurus-plugin-content-docs/current/reference.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/reference.mdx)
- [`scripts/generateProductData.mts`](../../../scripts/generateProductData.mts)

## Перед PR

Сравнить с текущим Reference upstream и проверить, какие части уже реализованы или обсуждаются.

## Как переносить

Лучше переносить после или вместе с catalog layer. RU-specific labels и curated aliases отделить.

**QA:** Проверить exact/alias/prefix search, redirects, direct section links, empty state и responsive layout.

**Draft PR:** `Add structured Reference discovery`
