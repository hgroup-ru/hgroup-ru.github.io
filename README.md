# H-Group RU

Русская локализация H-Group Conventions for Hanabi.

Сайт: <https://hgroup-ru.github.io/>

Проект основан на официальном репозитории `hanabi/hanabi.github.io` и сохраняет upstream-first архитектуру Docusaurus. Официальный английский MDX/YML остаётся источником игрового смысла, структуры и официальных диаграмм; русская локализация живёт в Docusaurus locale-слое.

## Что это за проект

H-Group RU не создаёт отдельную систему конвенций и не подменяет оригинальный H-Group. Наша задача — сделать официальные материалы H-Group доступными на русском, сохраняя их смысл, структуру, progression и официальные диаграммы, а RU-specific дополнения явно отделять от upstream.

Основной источник — официальный проект [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). На сайте также встречаются ссылки на внешние ресурсы, которыми пользуется или на которые ссылается оригинальный проект, например Hanab Live, Discord, BoardGameGeek и другие сервисы. Такие ссылки не означают, что H-Group RU владеет этими сервисами или представляет их.

## Как помочь

Есть два разных направления вклада:

- ошибка, неточность или улучшение **русского перевода**, терминологии, RU-интерфейса или локальных материалов — открывайте Pull Request в этом репозитории;
- изменение **оригинальной английской статьи**, игровой семантики, official YML или официальной диаграммы — предлагайте изменение в upstream [`hanabi/hanabi.github.io`](https://github.com/hanabi/hanabi.github.io). После принятия upstream-изменения H-Group RU синхронизирует источник и обновляет перевод.

Подробный процесс описан в [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Быстрый старт

```bash
npm ci
npm run start
```

Основная проверка перед PR:

```bash
npm run lint
```

Production RU build:

```bash
npm run build:ru
```

Подробности:

- [как внести изменение](CONTRIBUTING.md);
- [архитектура, CI и релизы](ARCHITECTURE.md);
- [правила русской локализации](localization/README.md);
- [терминология](localization/TERMINOLOGY_RU.md);
- [осознанные отклонения от upstream](localization/SOURCE_EXCEPTIONS.md);
- [кандидаты на улучшения upstream](localization/UPSTREAM_CANDIDATES.md).

## Где лежит русский контент

`i18n/ru/docusaurus-plugin-content-docs/current/`

## Upstream

Точная закреплённая ревизия записана в [`upstream.json`](upstream.json).

## Лицензия и атрибуция

См. [`LOCALIZATION_NOTICE_RU.md`](LOCALIZATION_NOTICE_RU.md), [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) и [`LICENSE`](LICENSE).
