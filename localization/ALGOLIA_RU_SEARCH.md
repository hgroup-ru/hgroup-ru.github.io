# Поиск RU и Algolia

Глобальный поиск русской версии использует отдельные, принадлежащие H-Group RU приложение Algolia, crawler и index. Официальный английский index upstream не переиспользуется.

## Текущая конфигурация

- приложение: `H-Group RU`;
- Application ID: `Z7BSOZO4QZ`;
- crawler: `hgroup-ru-docs`;
- index: `hgroup-ru-docs`;
- start URL: `https://hgroup-ru.github.io/`;
- `maxUrls`: `1000`;
- frontend: стандартная интеграция Docusaurus Algolia/DocSearch;
- `contextualSearch: false`;
- страница поиска: `/search`.

Frontend использует Search-only API key. Admin API key нельзя публиковать или хранить в Git.

## Исключение ответов Training из индекса

Локальные ответы Training рендерятся с атрибутом:

```html
<div class="ru-training-answer" data-ru-search-exclude="true">...</div>
```

Crawler удаляет такие узлы до обычного DocSearch extraction, но оставляет текст вопроса в `<summary>` индексируемым.

Текущий `recordExtractor`:

```js
recordExtractor: ({ $, helpers }) => {
  // RU-only Training answers must never enter the search index.
  $('[data-ru-search-exclude="true"]').remove();

  const lvl0 =
    $(
      ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active",
    )
      .last()
      .text() || "Documentation";

  return helpers.docsearch({
    recordProps: {
      lvl0: {
        selectors: "",
        defaultValue: lvl0,
      },
      lvl1: ["header h1", "article h1"],
      lvl2: "article h2",
      lvl3: "article h3",
      lvl4: "article h4",
      lvl5: "article h5, article td:first-child",
      lvl6: "article h6",
      content:
        "article p, article li, article td:last-child, article summary",
    },
    aggregateContent: false,
    recordVersion: "v3",
  });
},
```

`aggregateContent: false` задан намеренно: при агрегации длинные русские страницы превышали лимит размера одной записи Algolia.

## Проверяемые инварианты

При изменениях поиска необходимо сохранять следующее поведение:

- обычный русский текст статьи находится поиском;
- текст Training question находится поиском;
- точная фраза, встречающаяся только внутри Training answer, не возвращает результатов;
- Search button, `/` и `Ctrl + K` открывают поиск;
- переход по результату ведёт на правильный route/anchor;
- опубликованные страницы попадают в index после crawler run.

Конфигурация crawler живёт в Algolia dashboard. Этот файл является публичной канонической записью RU-specific extraction policy; значения секретов в нём не хранятся.
