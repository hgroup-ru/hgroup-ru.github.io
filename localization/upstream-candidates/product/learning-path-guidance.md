# Learning Path current/next guidance

**Статус:** `candidate`  
**Сложность переноса:** `medium` — UI небольшой, но использует generated Level metadata и player-level preference.

## Что предлагаем upstream

Показывать в Learning Path текущий и следующий canonical Level с прямыми переходами.

**Зачем:** Learning Path становится инструментом продолжения обучения, не меняя официальный порядок Levels.

## Текущая реализация

- [`src/components/LearningPathLevelGuide/index.tsx`](../../../src/components/LearningPathLevelGuide/index.tsx)
- [`src/components/LearningPathLevelGuide/styles.module.css`](../../../src/components/LearningPathLevelGuide/styles.module.css)
- [`i18n/ru/docusaurus-plugin-content-docs/current/learning-path.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/learning-path.mdx)
- [`scripts/generateProductData.mts`](../../../scripts/generateProductData.mts)
- [`src/hooks/usePlayerLevel.ts`](../../../src/hooks/usePlayerLevel.ts)

## Перед PR

Проверить текущий Learning Path upstream и canonical titles/links Levels.

## Как переносить

Сохранить official progression; не добавлять completion/gamification.

**QA:** Проверить Beginner/L1/L25 boundaries, current/next links и соответствие canonical Level titles.

**Draft PR:** `Add current and next Level guidance to Learning Path`
