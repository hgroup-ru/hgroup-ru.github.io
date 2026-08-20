# Правила русской локализации

## Источник

Игровой смысл, структура материала и официальные диаграммы сверяются с закреплённой версией [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). Точная версия записана в [`../upstream.json`](../upstream.json).

Русский перевод находится в [`i18n/ru/docusaurus-plugin-content-docs/current/`](../i18n/ru/docusaurus-plugin-content-docs/current).

## Основные правила

Перевод должен сохранять:

- все условия и исключения;
- степень обязательности формулировок;
- существенные примеры и контрпримеры;
- предупреждения и объяснения;
- последовательность рассуждения;
- намеренные уточнения, которые появляются по мере перехода к более высоким Levels.

Не сокращайте содержание только потому, что часть объяснения кажется повторяющейся. Совпадение структуры с исходником полезно для проверки, но само по себе не доказывает точность перевода.

Принятая терминология собрана в [`TERMINOLOGY_RU.md`](TERMINOLOGY_RU.md). Если формулировка неоднозначна и существенно влияет на смысл, лучше явно обсудить её в Pull Request, чем принимать решение молча.

## Официальные диаграммы

Официальные диаграммы берутся из YML закреплённой версии исходного проекта и рендерятся штатным Docusaurus plugin H-Group. Не восстанавливайте состояние официальной диаграммы вручную по описанию в тексте.

## Локальные учебные диаграммы

Семь YML-файлов являются учебным материалом H-Group RU, а не официальными YML H-Group:

- Level 3: `local-information-lock-identity.yml`;
- Level 3: `local-information-lock-superposition.yml`;
- Level 3: `local-information-lock-break.yml`;
- Level 15: `local-truth-vs-occam.yml`;
- Level 18: `local-riding-deduction.yml`;
- Level 24: `local-unnecessary-utd-bcme.yml`;
- Level 25: `local-important-2-save.yml`.

Они хранятся рядом с соответствующими русскими страницами и рендерятся тем же штатным плагином, что и официальные диаграммы.

## Training Questions

Levels 1–25 содержат локальные Training Questions. Они созданы H-Group RU и не являются Official Challenge Questions.

Полный стандарт составления и проверки локальных вопросов описан в [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md). Он задаёт требования к педагогической ценности, blind solve, однозначности, EN/RU review, диаграммам и многошаговым scenario timelines.

Ответы Training исключаются из поискового индекса, чтобы поиск не раскрывал решение до открытия вопроса; сами вопросы остаются доступными для поиска.

## Mermaid

В русских материалах Levels 1, 19, 22 и 25 используются локализованные Mermaid-схемы.

## Новый локальный материал

Не добавляйте новые Training Questions, диаграммы, объяснения, примеры или мнемоники без явного обоснования. В Pull Request должно быть понятно, зачем материал нужен именно русской версии и почему его нельзя или не нужно предложить исходному проекту.

## Связанные документы

- [`TERMINOLOGY_RU.md`](TERMINOLOGY_RU.md) — принятая терминология;
- [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md) — единый стандарт составления, вычитки и semantic QA локальных Training Questions;
- [`SOURCE_EXCEPTIONS.md`](SOURCE_EXCEPTIONS.md) — осознанные отличия от закреплённой версии источника;
- [`UPSTREAM_CANDIDATES.md`](UPSTREAM_CANDIDATES.md) — находки, которые могут быть полезны исходному проекту.
- [`upstream-candidates/README.md`](upstream-candidates/README.md) — подробные рабочие карточки для подготовки upstream Pull Request.
