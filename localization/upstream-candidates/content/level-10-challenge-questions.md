# Level 10 — локальные Challenge Questions

**Статус:** `candidate`  
**Сложность переноса:** `medium` — нужно подготовить английскую версию набора, перепроверить семантику по актуальному upstream и адаптировать под структуру Official Challenge Questions.

## Что предлагаем upstream

H-Group RU подготовил локальный набор Challenge Questions для Level 10, где upstream сейчас не содержит соответствующего официального набора. Вопросы покрывают, среди прочего, Gentleman's Discard, Layered Gentleman's Discard, Baton Discard, Generation Discard, Certain Discard / Certain Play и Composition Finesse.

После стабилизации локального набора его можно перевести на английский и предложить в `hanabi/hanabi.github.io` как новый upstream-набор Challenge Questions для Level 10.

Это потенциально полезное улучшение upstream, но **не текущий приоритет**. Возвращаться к нему имеет смысл позже, когда будет желание заниматься подготовкой и review отдельного upstream PR.

## Текущая реализация

- локальные Level 10 вопросы в `docs/challenge-questions/level-10-*.mdx` и соответствующих YML;
- русская версия в `i18n/ru/docusaurus-plugin-content-docs/current/challenge-questions/`;
- правила авторинга и semantic review в [`LOCAL_CHALLENGE_QUESTIONS.md`](../../LOCAL_CHALLENGE_QUESTIONS.md).

Пока набор остаётся материалом H-Group RU и **не должен называться Official Challenge Questions**.

## Перед переводом и PR

1. Сверить актуальный Level 10 и связанные Extras/более ранние Levels в текущем upstream, чтобы не переносить устаревшую локальную трактовку.
2. Ещё раз пройти semantic/adversarial review всего набора после возможных upstream-изменений.
3. Решить, какие вопросы действительно полезны upstream как общий учебный материал, а какие слишком завязаны на локальную подачу.
4. Подготовить естественные английские Question/Solution тексты, а не механический перевод русского.
5. Перепроверить все YML, turn order, POV, clue counts, labels и continuity.
6. Проверить нейтральность titles и однозначность типа каждого вопроса (`best move`, `legality`, `interpretation`, `deduction`).
7. Согласовать формат и объём с существующими upstream Challenge Questions.

## Как переносить

Предпочтительно отдельным содержательным PR в `hanabi/hanabi.github.io`, без привязки к русской локализации. PR должен объяснять, что это новый Level 10 Challenge Question set, какие conventions он покрывает и почему выбранные позиции полезны для обучения.

Не нужно переносить H-Group RU-specific тексты про локальность, release process или внутренний QA. Английская версия должна выглядеть как самостоятельный upstream-контент.

**QA:** полный semantic/adversarial review + upstream lint/build + визуальная проверка всех диаграмм.

**Draft PR:** `Add Level 10 challenge questions`
