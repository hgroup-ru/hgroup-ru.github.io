# Variant-Specific discovery

**Статус:** `candidate`  
**Сложность переноса:** `medium` — использует общий catalog/search layer и отдельный UI для Variant-Specific.

## Что предлагаем upstream

Дать Variant-Specific отдельный browse/search и возможность явно подключать variant results к Reference search.

**Зачем:** Core conventions и Variant-Specific остаются разделены, но variant-материал становится нормально находимым.

## Текущая реализация

- [`src/components/VariantExplorer/index.tsx`](../../../src/components/VariantExplorer/index.tsx)
- [`src/components/ReferenceExplorer/index.tsx`](../../../src/components/ReferenceExplorer/index.tsx)
- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific.mdx)
- [`scripts/generateProductData.mts`](../../../scripts/generateProductData.mts)
- [`src/utils/productSearch.ts`](../../../src/utils/productSearch.ts)

## Перед PR

Проверить текущую навигацию и поиск Variant-Specific upstream.

## Как переносить

Переиспользовать общий search layer; не переносить русские названия и locale-specific normalization.

**QA:** Проверить browse, отдельные variant results, URL state и отсутствие смешивания с core по умолчанию.

**Draft PR:** `Improve Variant-Specific discovery`
