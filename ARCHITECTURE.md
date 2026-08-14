# Архитектура H-Group RU

## Основной принцип

H-Group RU — upstream-first локализация `hanabi/hanabi.github.io`, а не независимая реализация H-Group conventions.

Закреплённый upstream определяет:

- официальный английский MDX;
- структуру материала;
- official YML;
- Hanabi Docusaurus renderer;
- основу сайта.

Русский проект добавляет локализацию и минимальные RU-specific расширения поверх этой основы.

## Единственный source repository

`hgroup-ru/hgroup-ru.github.io` — единственный живой source tree сайта.

Generated `build/` не коммитится в Git: опубликованный сайт разворачивается из GitHub Pages artifact.

## Русский locale

Основной путь:

`i18n/ru/docusaurus-plugin-content-docs/current/`

Production публикует только RU locale в корне `https://hgroup-ru.github.io/`.

Production build:

```bash
npm run build:ru
```

`npm run build` собирает все настроенные locale и используется только как редкая compatibility-проверка для shared/upstream изменений.

## Локальные расширения

Проект сохраняет:

- русскую терминологию и редакционную политику;
- локальные Training Questions для Levels 1–25;
- семь явно локальных учебных YML-диаграмм, рендеримых штатным Hanabi plugin;
- локализованные Mermaid flowcharts там, где они уже являются частью RU-контента;
- RU-owned Algolia search/index policy.

Старые custom Python builders, custom SPA/runtime, autonomous single-file profile, custom official-diagram renderer и parity/oracle QA не являются текущей архитектурой.

## Поиск

Frontend использует стандартную Docusaurus Algolia/DocSearch integration и RU-owned index `hgroup-ru-docs`.

Training answers помечены `data-ru-search-exclude="true"`; crawler удаляет эти узлы до DocSearch extraction, сохраняя Training question `<summary>` индексируемым.

Exact crawler behavior хранится в `localization/ALGOLIA_RU_SEARCH.md`.

## CI

### PR из ветки основного репозитория

CI выполняет `npm run lint`.

### PR из внешнего fork

CI выполняет:

1. `npm run lint`;
2. `npm run build:ru` даже если lint уже нашёл ошибку, чтобы автор сразу получил полный технический feedback.

PR CI не получает release secrets и ничего не деплоит.

## Build Check

`Build Check` — ручной maintainer workflow только для `npm run build:ru`. `npm run build` (все locale) намеренно не вынесен в GitHub Actions и остаётся редкой локальной compatibility-командой для upstream/shared изменений.

## Release

Merge в `main` не означает публикацию.

Ручной `Release` из `main` выполняет:

1. lint;
2. `npm run build:ru`;
3. загрузку Pages artifact;
4. deployment в GitHub Pages;
5. создание production tag `prod-*` на опубликованном source SHA;
6. запуск Algolia crawler.

Release build обязателен даже если отдельный PR уже успешно собирался: публикуется совокупное текущее состояние `main`, и именно Release создаёт production artifact.

## Production tags

Каждый успешный Pages deployment получает новый `prod-*` Git tag. Tag не двигается и не переиспользуется.

GitHub Release objects пока не являются частью release lifecycle; при необходимости их можно добавить позже как публичный changelog.

## Upstream sync

Текущая закреплённая upstream revision хранится в `upstream.json`. В одном update нельзя молча смешивать файлы из разных upstream revisions.
