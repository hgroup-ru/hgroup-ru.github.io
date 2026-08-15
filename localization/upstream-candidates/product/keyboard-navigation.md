# Keyboard/navigation hardening

**Статус:** `candidate`  
**Сложность переноса:** `low` — точечное улучшение существующего hotkey script.

## Что предлагаем upstream

Сделать существующие keyboard shortcuts безопаснее для input/editable controls и менее зависимыми от locale/URL assumptions.

**Зачем:** Убирает случайные срабатывания при вводе и делает навигацию устойчивее.

## Текущая реализация

- [`static/js/hotkey.js`](../../../static/js/hotkey.js)

## Перед PR

Сравнить текущий hotkey implementation upstream и оставить только всё ещё актуальные исправления.

## Как переносить

Переносить маленькими locale-neutral изменениями; русские prompt strings не переносить.

**QA:** Проверить shortcuts на обычной странице и отсутствие interception в editable controls.

**Draft PR:** `Harden keyboard navigation`
