# Как устроен проект

H-Group RU основан на официальном [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io) и старается сохранять совместимую структуру. Это упрощает обновление перевода и помогает не превращать русскую версию в отдельную редакцию правил.

## Источник и локализация

Точная версия исходного проекта записана в [`upstream.json`](upstream.json).

Официальные английские страницы и YML-файлы остаются основой содержательной структуры. Русский перевод хранится в стандартной структуре Docusaurus:

[`i18n/ru/docusaurus-plugin-content-docs/current/`](i18n/ru/docusaurus-plugin-content-docs/current)

Подробные правила локализации находятся в [`localization/README.md`](localization/README.md).

## Что добавляет H-Group RU

Помимо перевода проект содержит несколько локальных слоёв:

- принятую русскую терминологию;
- Training Questions для уровней 1–25;
- явно обозначенные локальные учебные YML-диаграммы;
- локализованные Mermaid-схемы там, где они входят в русские материалы;
- локальные продуктовые компоненты и поиск по русской версии.

Локальные материалы должны быть явно отличимы от официального контента H-Group.

## Сборка и сгенерированные данные

Русская версия собирается командой:

```bash
npm run build:ru
```

Перед сборкой проект компилирует локальный Docusaurus plugin и генерирует часть продуктовых данных из локализованного MDX-корпуса. Эти данные не должны поддерживаться как второй ручной каталог.

Сгенерированный каталог `build/` в Git не хранится.

## Диаграммы

Официальные диаграммы используют YML из закреплённой версии upstream и штатный Docusaurus plugin H-Group. Локальные учебные диаграммы рендерятся тем же механизмом, но явно относятся к H-Group RU.

## Pull Request и CI

Обычная работа идёт через отдельные ветки и Pull Request.

Каждый PR проходит форматирование, типы, линтеры и invariant checks. Полный `npm run build:ru` зависит не от того, внутренний PR или fork, а от того, может ли изменение повлиять на production site.

Единственный список production-входов задаётся в `.github/workflows/publish.yml` через `on.push.paths`. PR CI определяет необходимость полного build по этому же списку через `scripts/site_build_required.py`; отдельного второго path-list в CI нет. Поэтому добавление нового production-входа делается один раз — в `publish.yml` — и автоматически влияет и на auto-publish после merge, и на pre-merge build requirement.

Чистые изменения CI/release machinery и другой служебной документации, не являющейся production input, проходят быстрый CI без Docusaurus build. Изменения `docs`, `i18n`, компонентов, плагинов, конфигурации или других production inputs получают полный RU build до merge.

Release notes ведут мейнтейнеры. Автор PR не обязан менять `CHANGELOG.md`, классифицировать изменение для релиза или добавлять `[no release note]`.

## Публикация и официальный релиз

Публикация сайта и официальный релиз — разные жизненные циклы.

Canonical `Publish Site` (`.github/workflows/publish.yml`) — единственное место, где реализован GitHub Pages deployment. Изменения production-входов сайта после merge в `main` автоматически запускают build и deploy. Тот же workflow можно вызвать вручную или из Official Release.

`Publish Site` не создаёт release tag, GitHub Release и не потребляет накопленные release notes.

Canonical `Release` (`.github/workflows/release.yml`) сначала вызывает тот же Publish для точного source SHA, а затем оформляет официальный checkpoint: создаёт `prod-*` tag и GitHub Release, архивирует `## Следующий релиз` и синхронизирует maintainer state.

Так сайт может обновляться чаще официальных релизов, а человекочитаемая история продолжает накапливаться до следующего release checkpoint.

Подробный operational contract описан в [`RELEASING.md`](RELEASING.md).

Для обычного внешнего контрибьютора деталей release pipeline знать не требуется; практический процесс описан в [`CONTRIBUTING.md`](CONTRIBUTING.md).
