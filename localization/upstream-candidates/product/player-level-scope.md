# Reference scope по уровню игрока

**Статус:** `candidate`  
**Сложность переноса:** `medium` — небольшой UI-фильтр, но зависит от player-level preference и структуры Reference.

## Что предлагаем upstream

Опционально ограничивать Reference материалом до выбранного Beginner/Level, сохраняя полный Reference по умолчанию.

**Зачем:** Позволяет новичку искать знакомые правила без удаления полного справочника для опытных игроков.

## Текущая реализация

- [`src/components/ReferenceExplorer/index.tsx`](../../../src/components/ReferenceExplorer/index.tsx)
- [`src/hooks/usePlayerLevel.ts`](../../../src/hooks/usePlayerLevel.ts)
- [`src/components/MyLevelNavbarItem/index.tsx`](../../../src/components/MyLevelNavbarItem/index.tsx)

## Перед PR

Проверить, нужен ли upstream такой progression-aware filter и как там сейчас представлен player level.

## Как переносить

Переносить как optional enhancement; не тащить completion/readiness или другие RU-only идеи прогресса.

**QA:** Проверить Beginner, Levels 1–25, полный режим и Extras.

**Draft PR:** `Add optional player-level scope to Reference`
