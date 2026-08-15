# Level 24 — player count

**Статус:** `candidate`  
**Сложность переноса:** `low` — точечная правка текста.

## Что предлагаем upstream

В Example 3 названы четыре игрока, но ситуация описана как `3-player game`.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/level-24.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/level-24.mdx)
- [SOURCE_EXCEPTIONS](../../SOURCE_EXCEPTIONS.md)

## Перед PR

Проверить актуальный Example 3 и подтвердить, что все четыре игрока относятся к одному примеру.

## Как переносить

Исправить только количество игроков.

**QA:** перечитать соседний контекст и выполнить проверки текущего upstream.

**Draft PR:** `Fix player count in Level 24 example`
