# H-Group RU

Русская локализация материалов H-Group по Hanabi.

Сайт: <https://hgroup-ru.github.io/>

Проект основан на официальном [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). Игровой смысл, структура официальных материалов и официальные YML-файлы сверяются с закреплённой версией исходного проекта; русский перевод и явно обозначенные локальные дополнения развиваются здесь.

## Состояние проекта

- что планируется и ещё не завершено: [`BACKLOG.md`](BACKLOG.md);
- что изменилось после последнего официального релиза и история выпусков: [`CHANGELOG.md`](CHANGELOG.md);
- как устроены публикация сайта и официальные релизы: [`RELEASING.md`](RELEASING.md).

## Хотите помочь?

Если вы нашли ошибку в русском переводе, терминологии, интерфейсе русской версии или локальных материалах, открывайте Pull Request в этом репозитории.

Если исправление относится к оригинальному английскому тексту, игровой семантике, официальному YML-файлу или официальной диаграмме, его лучше предложить в [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io).

Для первого Pull Request достаточно сделать fork, создать ветку, внести изменение и открыть PR. Локальные проверки полезны, но не обязательны для открытия PR: GitHub Actions запустит CI автоматически.

Подробный процесс — в [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Быстрый локальный запуск

```bash
npm ci
npm run start
```

Основная проверка:

```bash
npm run lint
```

Если изменение затрагивает MDX, YML или рендеринг страниц, дополнительно полезно проверить русскую сборку:

```bash
npm run build:ru
```

## Где что лежит

- русский контент: [`i18n/ru/docusaurus-plugin-content-docs/current/`](i18n/ru/docusaurus-plugin-content-docs/current/);
- правила локализации: [`localization/README.md`](localization/README.md);
- русская терминология: [`localization/TERMINOLOGY_RU.md`](localization/TERMINOLOGY_RU.md);
- архитектура репозитория: [`ARCHITECTURE.md`](ARCHITECTURE.md);
- версия исходного проекта: [`upstream.json`](upstream.json).

Осознанные отличия от закреплённого источника перечислены в [`localization/SOURCE_EXCEPTIONS.md`](localization/SOURCE_EXCEPTIONS.md), а возможные исправления и улучшения для исходного проекта — в [`localization/UPSTREAM_CANDIDATES.md`](localization/UPSTREAM_CANDIDATES.md).

## Лицензия и атрибуция

См. [`LOCALIZATION_NOTICE_RU.md`](LOCALIZATION_NOTICE_RU.md), [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) и [`LICENSE`](LICENSE).
