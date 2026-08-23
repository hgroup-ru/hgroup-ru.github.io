# Стандарт Quick Checks

Quick Checks (`Быстрая самопроверка`) — короткий локальный учебный слой H-Group RU в конце Level. Это не Official Challenge Questions и не Local Challenge Questions.

Базовый reading flow:

`Level -> Быстрая самопроверка -> Local Challenge Questions`.

## 1. Назначение

Quick Check быстро проверяет, удержал ли читатель один важный building block: invariant, boundary, precedence, modality, discrimination или типичную misconception.

Главное отличие от CQ — **малый объём контекста**, а не обязательно простота мысли. Тонкая precedence вполне подходит, если её можно проверить без полноценной многоходовой позиции.

Не превращайте слабый Quick Check в скрытый второй CQ. Если нужны несколько рук, длинный timeline, много competing moves или несколько диаграмм, задаче, вероятно, место среди Local Challenge Questions.

## 2. Что стоит спрашивать

Предпочтительны:

- **boundary** — какой факт делает convention применимой/неприменимой;
- **modality** — действие разрешено, предпочтительно, обязательно или last resort;
- **precedence** — какая interpretation выигрывает;
- **discrimination** — чем два похожих случая различаются;
- **micro-application** — короткое событие и вывод;
- **misconception** — правдоподобное неверное утверждение и решающая причина ошибки.

Чистый recall (`Что такое X?`, `Перечислите условия Y`) оставляйте только когда точная формулировка сама является важным invariant. Название convention не должно подменять понимание механики.

## 3. Короткость и self-contained формат

Один Quick Check — одна основная мысль. Он не зависит от ответа соседнего вопроса.

Ответ обычно занимает 1–3 коротких предложения: прямой вывод + решающий факт. Он не превращается в мини-Solution или пересказ Level.

Для сложной boundary допустима короткая remediation link на конкретный раздел Level, но она не заменяет ответ и не обязательна для каждого вопроса.

Диаграмма допустима, если состояние проще показать, чем описать одной фразой. Необходимость scenario timeline — сильный сигнал, что задача уже CQ.

## 4. Не дублировать Local CQ

Quick Check и CQ могут касаться одной convention, если выполняют разные функции:

`Quick Check: базовая boundary -> CQ: применение boundary среди competing lines`.

Плохая связка дважды задаёт тот же cognitive task, только второй раз добавляет лишние карты.

При review сравнивайте learning objectives обоих слоёв. Quick Check сохраняется как prerequisite/contrast anchor только если эта функция действительно нужна.

## 5. Русская редактура

Quick Checks сейчас являются RU-only материалом, поэтому искусственная EN-пара не требуется.

Текст должен быть коротким и естественным:

- нормальный русский порядок слов;
- без канцелярита и ненужных кальк;
- стабильная H-Group терминология;
- точная modality (`может`, `следует`, `должен`, `запрещено`);
- convention name не используется как ненужная подсказка.

## 6. KEEP / REWRITE / DELETE

При review каждый Quick Check получает:

- `KEEP` — компактный и действительно проверяет полезный building block;
- `REWRITE` — тема полезна, но вопрос стал recall/пересказом или написан слабо;
- `DELETE` — vocabulary filler либо cognitive duplicate без отдельной педагогической функции.

Нет квоты на число Quick Checks. Несколько сильных вопросов лучше чек-листа всех терминов главы.

Для Level/corpus review проверьте:

1. какие вопросы являются чистым recall;
2. какие работают как хорошие micro-cases;
3. где есть cognitive duplicate с Local CQ;
4. какие важные invariants/boundaries вообще не проверяются;
5. не слишком ли длинен/однообразен блок;
6. естественность русского текста.

## 7. Scope boundary

Review локального Quick Check сам по себе **не открывает и не закрывает** scope повторного аудита Official Challenge Questions, official prose или official diagrams того же Level. Это разные артефакты и разные lifecycle decisions.

Текущий frozen/deferred scope официального материала и Local CQ хранится в project state/coverage, а не в этом вечном editorial-стандарте. Смотрите [`QA_COVERAGE.md`](QA_COVERAGE.md), [`LOCAL_CQ_QA_SCOPE.json`](LOCAL_CQ_QA_SCOPE.json) и [`../BACKLOG.md`](../BACKLOG.md).
