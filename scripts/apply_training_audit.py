from pathlib import Path
import re

root = Path("i18n/ru/docusaurus-plugin-content-docs/current")
details_re = re.compile(r'<details className="ru-training">[\s\S]*?</details>')
summary_re = re.compile(r'<summary>([\s\S]*?)</summary>')

replacements = {
    ("level-2.mdx", 4): """<details className=\"ru-training\">\n\n<summary>\n  4. Чем отличается <em>Prompt + Finesse</em> от <em>Double Finesse</em>?\n</summary>\n\n<div className=\"ru-training-answer\" data-ru-search-exclude=\"true\">\n\nВ _Prompt + Finesse_ одна из связующих карт уже имеет подсказку и поэтому разыгрывается через _Prompt_, а другая остаётся без подсказки и требует blind-play через _Finesse_. В _Double Finesse_ две связующие карты разыгрываются вслепую. Эти два blind-play могут принадлежать разным игрокам или одному игроку на последовательных ходах.\n\n</div>\n\n</details>""",
    ("level-2.mdx", 5): """<details className=\"ru-training\">\n\n<summary>\n  5. Чем <em>Reverse Finesse</em> отличается от обычного Finesse по порядку ходов?\n</summary>\n\n<div className=\"ru-training-answer\" data-ru-search-exclude=\"true\">\n\nВ обычном _Finesse_ blind-play происходит до хода получателя исходной подсказки. В _Reverse Finesse_ получатель подсказки успевает сделать ход раньше игрока, который должен выполнить blind-play, поэтому он откладывает розыгрыш подсказанной карты и даёт скрытой связи время проявиться.\n\n</div>\n\n</details>""",
    ("level-2.mdx", 6): """<details className=\"ru-training\">\n\n<summary>\n  6. В <em>Self-Finesse</em> предыдущие игроки не показали связующую карту. Где получатель должен искать её?\n</summary>\n\n<div className=\"ru-training-answer\" data-ru-search-exclude=\"true\">\n\nВ собственной _Finesse Position_. Если подсказанная карта должна стать играбельной, а подходящей связи в руках предыдущих игроков не оказалось, получатель заключает, что связующая карта находится у него самого, и делает соответствующий blind-play.\n\n</div>\n\n</details>""",
    ("level-7.mdx", 6): """<details className=\"ru-training\">\n\n<summary>\n  6. Когда по накопленной информации можно безопасно сыграть Chop Moved-карту вслепую?\n</summary>\n\n<div className=\"ru-training-answer\" data-ru-search-exclude=\"true\">\n\nКогда после исключения вариантов **все оставшиеся возможные значения карты играбельны**. Если среди оставшихся вариантов есть неиграбельная карта, такой blind-play уже не гарантирован конвенцией.\n\n</div>\n\n</details>""",
    ("level-9.mdx", 1): """<details className=\"ru-training\">\n\n<summary>1. Что такое Stalling Situation?</summary>\n\n<div className=\"ru-training-answer\" data-ru-search-exclude=\"true\">\n\nЭто ситуация, в которой обычный сброс chop опасен и по конвенциям вместо него разрешена или требуется низкоценная подсказка. Конкретные допустимые Stall Clues и их очередность задаёт _Stall Table_; нельзя произвольно объявить любой неудобный ход Stall.\n\n</div>\n\n</details>""",
}

replaced = set()
suffixes_removed = 0

for path in sorted(root.glob("level-*.mdx")):
    text = path.read_text(encoding="utf-8")
    marker = "## Тренировочные вопросы"
    idx = text.find(marker)
    if idx < 0:
        continue
    head, tail = text[:idx], text[idx:]

    def transform_details(match):
        global suffixes_removed
        block = match.group(0)
        sm = summary_re.search(block)
        if not sm:
            return block
        plain = re.sub(r"<[^>]+>|\{[^{}]*\}", "", sm.group(1))
        nm = re.search(r"\b(\d+)\.", plain)
        number = int(nm.group(1)) if nm else None
        key = (path.name, number)
        if key in replacements:
            replaced.add(key)
            return replacements[key]

        body = sm.group(1)
        q = body.rfind("?")
        if q < 0:
            return block
        trailing = body[q + 1 :]
        visible = re.sub(r"<[^>]+>|\{[^{}]*\}", "", trailing).strip()
        if not visible:
            return block
        cleaned_summary = "<summary>" + body[: q + 1].rstrip() + "\n</summary>"
        suffixes_removed += 1
        return block[: sm.start()] + cleaned_summary + block[sm.end() :]

    tail = details_re.sub(transform_details, tail)
    path.write_text(head + tail, encoding="utf-8")

missing = set(replacements) - replaced
if missing:
    raise SystemExit(f"Missing targeted Training replacements: {sorted(missing)}")
if suffixes_removed < 20:
    raise SystemExit(f"Unexpectedly few visible Training suffixes removed: {suffixes_removed}")

backlog = Path("BACKLOG.md")
text = backlog.read_text(encoding="utf-8")
text, count = re.subn(
    r"\n### Полная вычитка Training Questions\n[\s\S]*?(?=\n### Whole-site consistency audit\n)",
    "\n",
    text,
    count=1,
)
if count != 1:
    raise SystemExit("Could not remove completed Training Questions backlog section")
backlog.write_text(text, encoding="utf-8")

changelog = Path("CHANGELOG.md")
text = changelog.read_text(encoding="utf-8")
intro = "# Журнал изменений\n\nЗдесь фиксируются заметные пользовательские изменения русской версии сайта H-Group Conventions.\n"
if not text.startswith(intro):
    raise SystemExit("Unexpected CHANGELOG.md header")
if "## Следующий релиз" not in text:
    notes = """

## Следующий релиз

### Исправлено

- У Training Questions удалены видимые topic/suffix-подсказки после текста вопроса: вопрос больше не подсказывает проверяемую конвенцию своим названием.
- В Level 2 уточнено отличие `Prompt + Finesse` от `Double Finesse`: Double Finesse не обязан проходить через двух разных игроков.
- В Level 2 вопрос про `Reverse Finesse` теперь проверяет точное правило порядка ходов, а субъективный вопрос про «рискованность» `Self-Finesse` заменён на проверку механики из official material.
- В Level 7 убрано опасное разрешение рисковать Chop Moved-картой: blind-play допустим только когда все оставшиеся варианты играбельны.
- В Level 9 определение `Stalling Situation` приведено к формулировке страницы и `Stall Table`.

### Проверено

- Проведён отдельный semantic/editorial audit локальных Training Questions для Levels 1–25.
- Проверены вопросы и ответы на соответствие окружающему official material, progression, отсутствие придуманных правил, достаточность контекста и полезность проверки.
- Official Challenge Questions не изменялись и не смешивались с локальными Training Questions.
"""
    changelog.write_text(intro + notes + text[len(intro) :], encoding="utf-8")

Path(".github/workflows/apply-training-audit.yml").unlink()
Path("scripts/apply_training_audit.py").unlink()
print(f"Removed {suffixes_removed} visible Training suffixes; applied {len(replaced)} semantic fixes.")
