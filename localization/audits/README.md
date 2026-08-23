# Local CQ audit evidence

Этот каталог содержит evidence, а не третий набор нормативных правил.

- `LEVEL_N_LOCAL_CQ_AUDIT.json` для Levels, включённых в `release_evidence.enforced` файла [`../LOCAL_CQ_QA_SCOPE.json`](../LOCAL_CQ_QA_SCOPE.json), — machine-readable release evidence и проверяется CI.
- Датированные Markdown reports (`*_2026-*.md`) — исторические snapshots конкретного review. Они не являются текущим source of truth для coverage, pinned upstream или lifecycle.
- Текущие границы QA/acceptance смотрите в [`../QA_COVERAGE.md`](../QA_COVERAGE.md), а нормативный release contract — в [`../LOCAL_CQ_AUTONOMOUS_WORKFLOW.md`](../LOCAL_CQ_AUTONOMOUS_WORKFLOW.md).

Старый report не становится актуальным снова только потому, что его вывод когда-то был PASS: изменение source revision, CQ prose/YML или renderer может инвалидировать соответствующее evidence.
