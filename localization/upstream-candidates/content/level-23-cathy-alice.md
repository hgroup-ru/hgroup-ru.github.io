# Level 23 — Cathy / Alice

**Статус:** `candidate`  
**Сложность переноса:** `low` — точечная правка текста.

## Что предлагаем upstream

В примере Blaze Discard upstream переключает имя Cathy на Alice, хотя рассуждение продолжает относиться к Cathy.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/level-23.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-23.mdx)
- [SOURCE_EXCEPTIONS](../../SOURCE_EXCEPTIONS.md)

## Перед PR

Проверить актуальный Level 23 и убедиться, что ошибка ещё существует.

## Как переносить

Исправить только ошибочное имя; остальной пример не менять.

**QA:** перечитать соседний контекст и выполнить проверки текущего upstream.

**Draft PR:** `Fix player name in Level 23 Blaze Discard example`
