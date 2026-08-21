# QA coverage registry

Этот файл фиксирует, **какие виды review уже выполнялись и где лежит evidence**. Он нужен для будущих обновлений: перепроверять в первую очередь изменившийся scope, а не автоматически начинать полный аудит всего сайта с нуля.

Registry не заменяет содержательный review и не превращает старый PASS в вечную гарантию. Если source revision, текст, YML, renderer или локальный материал после указанного evidence изменились, соответствующее покрытие нужно считать потенциально устаревшим для затронутого scope.

## Статусы

- **🟢 PASS** — указанный review действительно выполнен для указанного scope и evidence сохранён в Git/PR history.
- **🟡 PENDING** — review начат или подготовлен, но явный следующий acceptance layer ещё не завершён.
- **⚪ NOT RUN** — отдельного подтверждённого review этого типа пока нет.

## Текущее покрытие

<!-- prettier-ignore -->
| Материал / scope                                           | Source-fidelity                   | Semantic / editorial                           | Diagrams / state                                                    | Cross-consistency                            | Evidence / границы                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------- | --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local Challenge Questions, Levels 9–10                     | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #168. Level 10 Composition answer leakage исправлен; финальный batch прошёл повторный CQ/diagram review. Это не заменяет будущую полную человеческую вычитку формулировок.                                                                                                         |
| Local Challenge Questions, Levels 11–12                    | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #169. Две Level 12 diagram-state ошибки исправлены; финальный batch повторно проверен.                                                                                                                                                                                             |
| Local Challenge Questions, Levels 13–14                    | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #170. Восемь Level 13 question diagrams исправлены от answer leakage; финальные страницы/диаграммы повторно проверены.                                                                                                                                                             |
| Local Challenge Questions, Levels 15–16                    | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #171. Все 19 question-state diagrams в scope прошли review без новых diagram fixes.                                                                                                                                                                                                |
| Local Challenge Questions, Levels 17–18                    | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #172. Все 26 question-state diagrams просмотрены; одна Level 18 semantic rewrite; финальный scope повторно проверен.                                                                                                                                                               |
| Local Challenge Questions, Levels 19–20                    | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #173. Все 28 question-state diagrams просмотрены; финальный scope без новых diagram defects.                                                                                                                                                                                       |
| Local Challenge Questions, Level 21                        | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #161 и последующий global review. Official solution-diagram provenance сохранён; локальные CQ не являются Official Challenge Questions.                                                                                                                                            |
| Local Challenge Questions, Level 22                        | —                                 | 🟢 PASS                                        | 🟢 PASS                                                             | частично                                     | #162 и последующий global review. Official solution-diagram provenance сохранён; локальные CQ не являются Official Challenge Questions.                                                                                                                                            |
| Local Challenge Questions, Levels 23–25                    | —                                 | 🟢 PASS                                        | применимо по фактическим состояниям                                 | частично                                     | #174–#176 создали clean level-by-level replacements из актуального `main`; последующий #178 проверил их вместе с остальным активным CQ corpus.                                                                                                                                     |
| Active Local Challenge Question corpus, Levels 2–25        | —                                 | 🟢 PASS red-team; 🟡 PENDING full proofreading | 🟢 PASS для исторических level audits + filtered state anomaly pass | 🟢 PASS red-team в пределах проверенных атак | #178: 255 CQ reviewed, 13 redundant/failed CQ removed, 242 remain. Корректная формулировка результата: red-team не нашёл нового контрпримера для оставшихся 242, а не «242 доказаны идеальными». #179 содержит pre-proof triage и остаётся pending полной человеческой вычитки.    |
| Quick Checks, Levels 1–25                                  | —                                 | 🟢 PASS                                        | n/a                                                                 | 🟢 PASS внутри Quick Check layer             | #177: отдельный review Quick Checks как короткого локального слоя; не считать его повторным аудитом Official CQ/source material Levels 2–8.                                                                                                                                        |
| Official Challenge Questions / official source, Levels 2–8 | по pinned upstream                | заморожено для повторного локального аудита    | official YML policy применяется                                     | progression-sensitive                        | Не выводить новый PASS из Local CQ/Quick Check работы. Если затрагивается официальный текст или YML, нужен обычный source-fidelity workflow по pinned upstream.                                                                                                                    |
| External document-like reading links on RU site            | —                                 | 🟢 PASS                                         | n/a                                                                 | n/a                                          | #182: 22 links / 8 RU pages. Reactor/Easy Reactor и другие separate-system docs намеренно остаются внешними; Jeff/IAMJEFF docs остаются permission/licensing-gated. Это не полный аудит обычных внешних HTML-ссылок.                                                               |
| Whole-site source-fidelity                                 | ⚪ NOT RUN как единый свежий pass | ⚪ NOT RUN                                     | ⚪ NOT RUN как единый свежий pass                                   | ⚪ NOT RUN как единый свежий pass            | Нельзя выводить whole-site coverage из отдельных level/CQ/Quick Check batches. Запускать только при реальной необходимости или upstream drift.                                                                                                                                     |

## Как обновлять registry

Обновлять только после реально завершённого review или после изменения, которое инвалидирует существующее покрытие.

Для новой записи достаточно пяти вещей:

1. точный scope;
2. тип review;
3. evidence — PR, commit или audit report;
4. кратко, что именно проверялось и какие defects были исправлены;
5. явная граница — что этот PASS **не** доказывает.

Не заводить per-page строки только ради полноты. Детальный audit trail нужен там, где без него нельзя понять, что конкретно проверялось; общий registry должен оставаться короткой картой покрытия.

## Что считать устаревшим покрытием

Coverage нужно пересмотреть для затронутого scope, если произошло хотя бы одно из следующего:

- изменился substantive source text или pinned upstream revision;
- изменился RU semantic content;
- изменился YML/state, diagram renderer или interpretation contract;
- локальный CQ/Quick Check был существенно переписан, добавлен или удалён;
- новый cross-consistency review обнаружил условие, modality или progression issue, которое влияет на ранее проверенный материал.

Косметическая правка, не меняющая смысл/структуру/рендеринг, сама по себе не обнуляет semantic coverage, но всё равно должна пройти обычный risk-scoped CI.
