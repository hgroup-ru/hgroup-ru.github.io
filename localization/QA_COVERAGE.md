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
| Local Challenge Questions, Level 12                        | pinned `1ef83242…`                | 🟢 PASS model/semantic; 🟡 PENDING final human read | 🟢 PASS state preflight; ⚪ NOT RUN browser visual QA                    | частично                                     | #208. Static/CI evidence зелёный; served/rendered browser inspection и человеческая финальная вычитка ещё не закрыты. |
| Local Challenge Questions, Levels 13–14                    | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #170. Это historical evidence; Levels пока `deferred` в новом Local CQ QA scope и должны быть явно переведены в `enforced` при новом автономном проходе. |
| Local Challenge Questions, Levels 15–16                    | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #171; те же границы: historical evidence не заменяет новый release contract при следующем изменении. |
| Local Challenge Questions, Levels 17–18                    | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #172; одна Level 18 semantic rewrite была включена в тот scope. |
| Local Challenge Questions, Levels 19–20                    | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #173. |
| Local Challenge Questions, Level 21                        | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #161 и последующий global review. Official solution-diagram provenance сохраняется отдельно от Local CQ. |
| Local Challenge Questions, Level 22                        | —                                 | 🟢 PASS исторического level audit              | 🟢 PASS исторического level audit                                       | частично                                     | #162 и последующий global review. |
| Local Challenge Questions, Levels 23–25                    | —                                 | 🟢 PASS исторического level audit              | применимо по фактическим состояниям                                      | частично                                     | #174–#176 и #178. |
| Active Local Challenge Question corpus, Levels 2–25        | —                                 | 🟢 PASS historical red-team; 🟡 PENDING full proofreading | historical level evidence + filtered anomaly pass; не свежий browser pass | 🟢 PASS red-team в пределах проверенных атак | #178 reviewed corpus и удалил 13 failed/redundant CQ. Датированный pre-proof report 2026-08-20 — только historical triage и использовал более старый upstream pin; не считать его текущим release evidence. |
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
