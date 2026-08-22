# Variant-Specific — 5 Odd Ejection

**Статус:** `candidate`  
**Сложность переноса:** `medium` — teaching YML уже существует, но текущая локальная схема использует `clueArrow: true`, которого нет в upstream renderer на закреплённой revision.

## Что предлагаем upstream

Рассмотреть локальную учебную диаграмму H-Group RU для примера _5 Odd Ejection_ в `variant-specific/odds-and-evens`.

**Что показывает:** исходное знание Кэти о красной 5, odd Play Clue по жёлтой 5, Ejection Боба и последующий вывод Кэти, что odd-карта является 5 любого цвета, кроме красного.

**Зачем:** пример требует отслеживать изменение знания по шагам; без схемы легко спутать prior red clue, текущую odd clue и итоговую дедукцию после Ejection.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens/5-odd-ejection.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens/5-odd-ejection.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/odds-and-evens.mdx)

## Provenance

Это **локальный teaching YML H-Group RU, построенный по официальному текстовому примеру**, а не official upstream YML.

## Перед PR

Проверить текущий upstream-раздел и отсутствие эквивалентной official diagram. Отдельно перепроверить сам пример: его формулировку уже считаем кандидатом на будущую переработку upstream.

Не изображать odd clue обычной rank/color clue. Если используется arrow-only marker, renderer dependency должна быть перенесена отдельно и минимально.

## Как переносить

Перенести YML и минимальное подключение к MDX. При необходимости добавить минимальную поддержку `clueArrow` в schema/renderer либо подобрать другое корректное представление odd clue без ложной позитивной информации.

**QA:** schema/render, semantic review Ejection sequence, проверка knowledge state до/после Ejection.

**Draft PR:** `Add a 5 Odd Ejection teaching diagram`
