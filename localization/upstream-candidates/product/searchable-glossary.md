# Searchable Glossary

**Статус:** `candidate`  
**Сложность переноса:** `medium` — компонент небольшой, но требует устойчивой разметки curated glossary.

## Что предлагаем upstream

Добавить компактный поиск по curated glossary без превращения его в второй Reference.

**Зачем:** Glossary отвечает на вопрос «что значит термин», а именованные conventions остаются в Reference.

## Текущая реализация

- [`src/components/GlossarySearch/index.tsx`](../../../src/components/GlossarySearch/index.tsx)
- [`i18n/ru/docusaurus-plugin-content-docs/current/glossary.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/glossary.mdx)

## Перед PR

Проверить текущий Glossary upstream и его фактический scope.

## Как переносить

Перенести UI-механику; английский curated vocabulary upstream должен определяться отдельно.

**QA:** Проверить search/reset/empty state и корректность ссылок на canonical sections.

**Draft PR:** `Add searchable Glossary`
