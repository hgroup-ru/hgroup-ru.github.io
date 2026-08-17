#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path

CHANGELOG = Path("CHANGELOG.md")
NEXT_RELEASE_HEADING = "## Следующий релиз"
EMPTY_PLACEHOLDER = "_Изменений для следующего релиза пока нет._"
TITLE_RE = re.compile(r"^<!-- release-title: (.+?) -->$")


def next_release_body(text: str) -> str:
    marker = f"{NEXT_RELEASE_HEADING}\n"
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"Missing heading: {NEXT_RELEASE_HEADING}")

    body_start = start + len(marker)
    next_heading = re.search(r"^## ", text[body_start:], re.MULTILINE)
    body_end = len(text) if next_heading is None else body_start + next_heading.start()
    return text[body_start:body_end]


def validate(body: str) -> None:
    nonempty = [line.strip() for line in body.splitlines() if line.strip()]
    title_lines = [line for line in nonempty if TITLE_RE.fullmatch(line)]
    without_title = [line for line in nonempty if not TITLE_RE.fullmatch(line)]

    if without_title == [EMPTY_PLACEHOLDER]:
        if title_lines:
            raise ValueError("Empty next release must not contain release-title metadata.")
        return

    if EMPTY_PLACEHOLDER in without_title:
        raise ValueError("Remove the empty-release placeholder when release notes are present.")

    if len(title_lines) != 1:
        raise ValueError(
            "Non-empty next release must contain exactly one "
            "'<!-- release-title: ... -->' line."
        )

    title = TITLE_RE.fullmatch(title_lines[0]).group(1).strip()
    if not title:
        raise ValueError("release-title metadata must not be empty.")

    if not without_title:
        raise ValueError("Next release has a title but no public release notes.")

    if any(line == "### Трассировка" for line in without_title):
        raise ValueError("Do not add tracing manually to the next-release section.")


def main() -> int:
    body = next_release_body(CHANGELOG.read_text(encoding="utf-8"))
    try:
        validate(body)
    except ValueError as error:
        print(f"Release notes validation failed: {error}")
        return 1

    print("Release notes format is valid.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
