# H-Group RU

Русский перевод материалов H-Group по Hanabi.

Сайт: <https://hgroup-ru.github.io/>

За основу взят официальный проект [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). Английские материалы и официальные YML-файлы берутся из закреплённой версии исходного проекта, а русский перевод хранится в стандартной структуре локализации Docusaurus.

## О проекте

Цель H-Group RU — сделать материалы H-Group доступными на русском языке, не создавая отдельную редакцию правил. Мы сохраняем смысл, структуру и официальные диаграммы исходных материалов, а собственные дополнения явно отмечаем как локальные.

На страницах могут встречаться ссылки на Hanab Live, Discord, BoardGameGeek и другие внешние сайты и сервисы. Они приведены как ссылки на сторонние ресурсы и не означают принадлежность этих проектов H-Group RU.

## Как помочь

Если вы нашли ошибку в русском переводе, терминологии, интерфейсе русской версии или локальных материалах, открывайте Pull Request в этом репозитории.

Если исправление относится к оригинальному английскому тексту, игровой семантике, официальному YML-файлу или официальной диаграмме, лучше предложить его в [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). После принятия изменения мы сможем обновить закреплённую версию источника и русский перевод.

Подробности — в [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Локальный запуск

```bash
npm ci
npm run start
```

Основная проверка перед Pull Request:

```bash
npm run lint
```

Сборка русской версии:

```bash
npm run build:ru
```

## Полезные документы

- [как внести изменение](CONTRIBUTING.md);
- [как устроен проект](ARCHITECTURE.md);
- [открытый бэклог](BACKLOG.md);
- [правила перевода](localization/README.md);
- [русская терминология](localization/TERMINOLOGY_RU.md);
- [осознанные отличия от закреплённого источника](localization/SOURCE_EXCEPTIONS.md);
- [кандидаты на исправления и улучшения исходного проекта](localization/UPSTREAM_CANDIDATES.md).

Русский контент находится в [`i18n/ru/docusaurus-plugin-content-docs/current/`](i18n/ru/docusaurus-plugin-content-docs/current). Точная версия исходного проекта записана в [`upstream.json`](upstream.json).

## Лицензия и атрибуция

См. [`LOCALIZATION_NOTICE_RU.md`](LOCALIZATION_NOTICE_RU.md), [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) и [`LICENSE`](LICENSE).
