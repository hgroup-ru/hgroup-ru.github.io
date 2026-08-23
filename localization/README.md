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

Локальные teaching YML явно относятся к H-Group RU, хранятся рядом с соответствующими русскими страницами и рендерятся тем же штатным плагином, что и официальные диаграммы. Их актуальный inventory не дублируется в этом нормативном файле: конкретные файлы находятся по префиксу `local-`, а потенциально полезные upstream материалы отдельно отслеживаются в [`UPSTREAM_CANDIDATES.md`](UPSTREAM_CANDIDATES.md) и карточках [`upstream-candidates/diagrams/`](upstream-candidates/diagrams/).

## Локальные учебные вопросы

На сайте есть два разных локальных учебных слоя, и их не следует смешивать.

**Local Challenge Questions** — отдельные полноценные challenge-style страницы с игровыми позициями, Solutions, а при необходимости диаграммами и scenario timelines. Они созданы H-Group RU и не являются Official Challenge Questions.

Для них есть два канонических документа:

- [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md) — редакционный и semantic-стандарт: что делает вопрос хорошим;
- [`LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](LOCAL_CQ_AUTONOMOUS_WORKFLOW.md) — исполняемый release contract: какое evidence и QA нужны перед выпуском и clean-baseline.

Старый [`LOCAL_CHALLENGE_AUDIT_PROTOCOL.md`](LOCAL_CHALLENGE_AUDIT_PROTOCOL.md) сохранён только как redirect для исторических ссылок и не является третьим источником правил.

**Quick Checks / Быстрая самопроверка** — короткие встроенные вопросы в конце Level для проверки ключевых invariants, boundaries, precedence и misconceptions. Это RU-only материал; сейчас upstream для него не планируется. Стандарт описан в [`QUICK_CHECKS.md`](QUICK_CHECKS.md).

Ответы обоих локальных учебных слоёв исключаются из поискового индекса, чтобы поиск не раскрывал решение до открытия вопроса; сами вопросы остаются доступными для поиска.

Текущие frozen/deferred scopes, coverage и acceptance state не кодируются в нормативных правилах как вечные свойства проекта. Их источник истины — [`QA_COVERAGE.md`](QA_COVERAGE.md), [`LOCAL_CQ_QA_SCOPE.json`](LOCAL_CQ_QA_SCOPE.json) и открытые задачи в [`../BACKLOG.md`](../BACKLOG.md).

## Mermaid

Локализованные Mermaid-схемы являются обычным локальным presentation layer. Их актуальный inventory определяется фактическими imports/content, а не ручным списком Levels в этом файле.

## Новый локальный материал

Не добавляйте новые Local Challenge Questions, Quick Checks, диаграммы, объяснения, примеры или мнемоники без явного обоснования. В Pull Request должно быть понятно, зачем материал нужен именно русской версии и почему его нельзя или не нужно предложить исходному проекту.

## Связанные документы

- [`TERMINOLOGY_RU.md`](TERMINOLOGY_RU.md) — принятая терминология;
- [`LOCAL_CHALLENGE_QUESTIONS.md`](LOCAL_CHALLENGE_QUESTIONS.md) — editorial/semantic стандарт Local CQ;
- [`LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](LOCAL_CQ_AUTONOMOUS_WORKFLOW.md) — release contract Local CQ;
- [`LOCAL_CQ_QA_SCOPE.json`](LOCAL_CQ_QA_SCOPE.json) — явная граница включённых и deferred deterministic gates;
- [`QUICK_CHECKS.md`](QUICK_CHECKS.md) — короткий стандарт встроенной быстрой самопроверки;
- [`QA_COVERAGE.md`](QA_COVERAGE.md) — registry реально выполненных review, их scope, evidence и границ покрытия;
- [`SOURCE_EXCEPTIONS.md`](SOURCE_EXCEPTIONS.md) — осознанные отличия от закреплённой версии источника;
- [`UPSTREAM_CANDIDATES.md`](UPSTREAM_CANDIDATES.md) — находки, которые могут быть полезны исходному проекту;
- [`upstream-candidates/README.md`](upstream-candidates/README.md) — подробные рабочие карточки для подготовки upstream Pull Request.
