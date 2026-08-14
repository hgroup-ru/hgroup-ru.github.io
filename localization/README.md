# Русская локализация

## Источник

Официальный английский MDX/YML закреплённой upstream revision является источником смысла, структуры и official diagrams. Точная revision записана в `../upstream.json`.

Русская локализация живёт в `i18n/ru/docusaurus-plugin-content-docs/current/`.

## Приоритет решений

1. явно утверждённое актуальное project decision;
2. `TERMINOLOGY_RU.md`;
3. source-faithful естественный русский;
4. существенная неоднозначность не решается молча, а выносится на review.

## Source fidelity

Перевод должен сохранять:

- условия и исключения;
- силу формулировок;
- все существенные примеры и контрпримеры;
- предупреждения и обоснования;
- последовательность рассуждения;
- намеренную pedagogical progression между Levels.

Совпадение структуры само по себе не доказывает смысловую корректность.

## Official YML

Official diagrams берутся из закреплённого upstream точно и рендерятся штатным Hanabi Docusaurus plugin. Не реконструируйте official state по прозе.

## Локальные учебные диаграммы

Семь YML являются локальными учебными материалами H-Group RU, а не official H-Group YML:

- Level 3: `local-information-lock-identity.yml`;
- Level 3: `local-information-lock-superposition.yml`;
- Level 3: `local-information-lock-break.yml`;
- Level 15: `local-truth-vs-occam.yml`;
- Level 18: `local-riding-deduction.yml`;
- Level 24: `local-unnecessary-utd-bcme.yml`;
- Level 25: `local-important-2-save.yml`.

Они хранятся рядом с соответствующими RU-страницами и используют тот же штатный renderer.

## Training Questions

Levels 1–25 содержат локальные Training Questions. Это не Official Challenge Questions.

Training answers обёрнуты в `data-ru-search-exclude="true"`, чтобы ответы не попадали в Algolia index, а сами вопросы оставались searchable.

## Mermaid

Локализованные Mermaid flowcharts используются в RU Levels 1, 19, 22 и 25. Старый custom flowchart renderer не является частью проекта.

## Дополнительный авторский материал

Не добавляйте новые Training, диаграммы, объяснения, примеры или мнемоники поверх upstream без отдельного project decision.

## Связанные документы

- `TERMINOLOGY_RU.md` — утверждённая терминология;
- `SOURCE_EXCEPTIONS.md` — осознанные отклонения от закреплённого upstream;
- `UPSTREAM_CANDIDATES.md` — публичная очередь исправлений и общих улучшений, которые можно предложить upstream;
- `ALGOLIA_RU_SEARCH.md` — exact RU search/crawler policy.
