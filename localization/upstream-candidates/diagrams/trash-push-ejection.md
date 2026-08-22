# Extras — Trash Push Ejection

**Статус:** `candidate`  
**Сложность переноса:** `low` — локальный teaching YML использует существующий renderer; потребуется semantic review и точечное подключение.

## Что предлагаем upstream

Рассмотреть локальную учебную диаграмму H-Group RU для раздела _Trash Push Ejection_ в `extras/ejections`.

**Что показывает:** pushed-карта до Ejection и тот же слот после blind-play Боба, когда карта становится Chop Moved.

**Зачем:** правило описывает именно изменение состояния после Ejection; двухфазная схема делает этот переход очевидным и не раскрывает Chop Move раньше времени.

## Текущая реализация

- [`i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections/trash-push-ejection.yml`](../../../i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections/trash-push-ejection.yml)
- [`i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections.mdx`](../../../i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections.mdx)

## Provenance

Это **локальный teaching YML H-Group RU**, а не official upstream YML. Позиция минимально варьирует официальный пример _Trash Push_, чтобы pushed-карта была two-or-more-away-from-playable и наглядно показывала переход к Ejection.

## Перед PR

Проверить текущий upstream-раздел, отсутствие эквивалентной official diagram и ещё раз подтвердить, что состояние до Ejection не помечает pushed-карту как Chop Moved преждевременно.

## Как переносить

Перенести YML и минимальное подключение к MDX через существующий upstream renderer.

**QA:** schema/render и semantic review перехода `Pushed` → `Chop Moved` после Ejection.

**Draft PR:** `Add a Trash Push Ejection teaching diagram`
