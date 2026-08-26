# QA coverage registry

Этот файл фиксирует, **какие виды review уже выполнялись и где лежит evidence**. Он нужен для будущих обновлений: перепроверять в первую очередь изменившийся scope, а не автоматически начинать полный аудит всего сайта с нуля.

Registry не заменяет содержательный review и не превращает старый PASS в вечную гарантию. Если source revision, текст, YML, renderer или локальный материал после указанного evidence изменились, соответствующее покрытие нужно считать потенциально устаревшим для затронутого scope.

Датированные reports в [`audits/`](audits/) являются историческими snapshots. Текущий lifecycle/acceptance определяется этой таблицей и свежим evidence, а не тем, что старый report когда-то содержал PASS.

## Статусы

- **🟢 PASS** — указанный review действительно выполнен для указанного scope и evidence сохранён в Git/PR history.
- **🟡 PENDING** — review начат или подготовлен, но явный следующий acceptance layer ещё не завершён.
- **⚪ NOT RUN** — отдельного подтверждённого review этого типа пока нет.

## Текущее покрытие

<!-- prettier-ignore -->
| Материал / scope                                           | Source-fidelity                   | Semantic / editorial                           | Diagrams / state                                                         | Cross-consistency                            | Evidence / границы |
| ---------------------------------------------------------- | --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- | ------------------ |
| Local Challenge Questions, Levels 9–10                     | —                                 | 🟢 PASS model review; human wording review частично завершён | 🟢 PASS для применимых статических checks                                | частично                                     | Level 9: #204–#206 и human review 2026-08-23. Level 10: прежний level audit. Старые DELETE-кандидаты Level 9 не считать автоматически решёнными без отдельного решения. |
| Local Challenge Questions, Level 11                        | pinned `1ef83242…`                | 🟢 PASS model/semantic; 🟡 PENDING final human read | 🟢 PASS state preflight; ⚪ NOT RUN browser visual QA                    | частично                                     | #207, #209–#212. После #209–#212 answer/timeline YML существенно менялись, поэтому прежний diagram PASS из раннего corpus audit не является свежим browser evidence. Последний deterministic state gate зелёный; финальная визуальная/редакторская приёмка идёт на production site. |
| Local Challenge Questions, Level 12                        | pinned `1ef83242…`                | 🟢 PASS model/semantic; 🟢 PASS final human production read | 🟢 PASS state preflight; 🟢 PASS human production visual acceptance; ⚪ NOT RUN separate browser visual QA | частично                                     | #208, #233, #237, #239. После production rechecks пользователь явно закрыл Level 12 2026-08-26. Human acceptance покрывает финальную редактуру и фактически показанные production-диаграммы; отдельный автоматизированный browser visual QA не запускался. |
| Local Challenge Questions, Levels 13–14                    | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #170; fresh editorial proofread #227. Content-only pass, browser visual QA не запускался; human production read не заявлен. |
| Local Challenge Questions, Levels 15–16                    | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #171; fresh editorial proofread #227. Content-only pass, browser visual QA не запускался; human production read не заявлен. |
| Local Challenge Questions, Levels 17–18                    | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #172; fresh editorial proofread #228. Одна Level 18 semantic rewrite была включена в historical scope; свежий pass был редакторским. |
| Local Challenge Questions, Levels 19–20                    | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #173; fresh editorial proofread #228. Content-only pass, browser visual QA не запускался. |
| Local Challenge Questions, Level 21                        | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #161/global review; fresh editorial commit `3234a80e`. Official solution-diagram provenance сохраняется отдельно; human production read не заявлен. |
| Local Challenge Questions, Level 22                        | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | 🟢 PASS исторического level audit                                       | частично                                     | Historical #162/global review; fresh editorial commit `0fcff835`. Content-only pass, browser visual QA не запускался; human production read не заявлен. |
| Local Challenge Questions, Levels 23–25                    | pinned `1ef83242…`                | 🟢 PASS semantic + fresh model editorial proofread | применимо по фактическим состояниям                                      | частично                                     | Historical #174–#176 и #178; fresh editorial proofread #226. Content-only pass, browser visual QA не запускался; human production read не заявлен. |
| Active Local Challenge Question corpus, Levels 2–25        | —                                 | 🟢 PASS historical red-team; 🟢 PASS fresh model editorial for Levels 13–25; 🟡 PENDING remaining human/full-corpus proofreading | historical level evidence + filtered anomaly pass; не свежий browser pass | 🟢 PASS red-team в пределах проверенных атак | #178 reviewed corpus и удалил 13 failed/redundant CQ. Fresh editorial evidence: #226–#228 + commits `3234a80e`, `0fcff835`. Это не создаёт новый editorial PASS для Levels 2–12 и не заменяет человеческую production-вычитку. |
| Quick Checks, Levels 1–25                                  | —                                 | 🟢 PASS                                        | n/a                                                                      | 🟢 PASS внутри Quick Check layer             | #177. Не считать повторным аудитом Official CQ/source material. |
| Official Challenge Questions / official source, Levels 2–8 | по pinned upstream                | текущий scope повторного аудита задаётся project state, не этим стандартом | official YML policy применяется                                          | progression-sensitive                        | Local CQ/Quick Check работа не создаёт новый PASS для official material. При изменении official text/YML нужен обычный source-fidelity workflow. |
| External document-like reading links on RU site            | —                                 | 🟢 PASS                                        | n/a                                                                      | n/a                                          | #182: 22 links / 8 RU pages; это не полный аудит всех внешних HTML-ссылок. |
| Whole-site source-fidelity                                 | ⚪ NOT RUN как единый свежий pass | ⚪ NOT RUN                                     | ⚪ NOT RUN как единый свежий pass                                        | ⚪ NOT RUN как единый свежий pass            | Нельзя выводить whole-site coverage из отдельных level/CQ/Quick Check batches. |

## Как обновлять registry

Обновлять после реально завершённого review **или сразу после изменения, которое инвалидирует существующее покрытие**. Не оставлять старый `🟢 PASS` на изменённом YML только потому, что новый review ещё не выполнен: заменить его на точный `🟡 PENDING`/`⚪ NOT RUN` для затронутого слоя.

Для новой записи достаточно:

1. точного scope;
2. типа review;
3. evidence — PR, commit или audit report;
4. краткого описания реально проверенного;
5. явной границы — что этот PASS не доказывает;
6. source revision/commit, если без него evidence может стать неоднозначным после следующих изменений.

Не заводить per-page строки только ради полноты. Детальный audit trail нужен там, где без него нельзя понять, что конкретно проверялось; общий registry должен оставаться короткой картой покрытия.

## Что считать устаревшим покрытием

Coverage нужно пересмотреть для затронутого scope, если произошло хотя бы одно из следующего:

- изменился substantive source text или pinned upstream revision;
- изменился RU semantic content;
- изменился YML/state, diagram renderer или interpretation contract;
- локальный CQ/Quick Check был существенно переписан, добавлен или удалён;
- новый cross-consistency review обнаружил условие, modality или progression issue, которое влияет на ранее проверенный материал.

Косметическая правка, не меняющая смысл/структуру/рендеринг, сама по себе не обнуляет semantic coverage, но всё равно должна пройти обычный risk-scoped CI.
