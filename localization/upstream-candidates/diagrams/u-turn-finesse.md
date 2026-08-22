# Variant-Specific — U-Turn Finesse

**Статус:** `candidate`  
**Сложность переноса:** `low` — локальный teaching YML использует существующий renderer; потребуется только semantic review и точечное подключение.

## Что предлагаем upstream

Рассмотреть локальную учебную диаграмму H-Group RU для примера _U-Turn Finesse_ в `variant-specific/up-or-down`.

**Что показывает:** состояние после повторной красной подсказки: Кэти получает retouched red Play Clue по красной 5, а Алиса выводит собственные карты как `Red 1`–`Red 4` слева направо.

**Зачем:** пример строится на необычной интерпретации повторной подсказки и на полном выводе собственной руки; схема сразу показывает обе части reasoning.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down/u-turn-finesse.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down/u-turn-finesse.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/variant-specific/up-or-down.mdx)

## Provenance

Это **локальный teaching YML H-Group RU, построенный по официальному текстовому примеру**, а не official upstream YML.

## Перед PR

Проверить текущий upstream-раздел, отсутствие эквивалентной official diagram и ещё раз сверить card identities/ordering с текстом примера.

## Как переносить

Перенести YML и минимальное подключение к MDX через существующий upstream renderer. Использовать canonical colored labels (`Red 1` ... `Red 4`), а не сырые `r1` ... `r4`.

**QA:** schema/render и semantic review повторной clue-интерпретации.

**Draft PR:** `Add a U-Turn Finesse teaching diagram`
