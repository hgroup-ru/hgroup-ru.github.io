# Persistent player level preference

**Статус:** `candidate`  
**Сложность переноса:** `medium` — сама state-модель простая, но есть navbar integration и consumers.

## Что предлагаем upstream

Добавить лёгкую persistent preference Beginner/Level 1–25 без completion semantics.

**Зачем:** Одна настройка может персонализировать Learning Path и optional Reference scope без отдельной progress system.

## Текущая реализация

- [`src/hooks/usePlayerLevel.ts`](../../../src/hooks/usePlayerLevel.ts)
- [`src/components/MyLevelNavbarItem/index.tsx`](../../../src/components/MyLevelNavbarItem/index.tsx)
- [`docusaurus.config.ts`](../../../docusaurus.config.ts)

## Перед PR

Проверить, нет ли уже аналогичной preference/state в upstream.

## Как переносить

Перенести только выбранный уровень и нейтральный storage contract. Completion/review/readiness не добавлять.

**QA:** Проверить initial state, persistence, смену уровня и работу без сохранённого значения.

**Draft PR:** `Add a persistent player level preference`
