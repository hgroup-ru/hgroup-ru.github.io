#!/usr/bin/env python3

from __future__ import annotations

import argparse
import re
from pathlib import Path

NEXT_RELEASE_HEADING = "## Следующий релиз"
EMPTY_PLACEHOLDER = "_Изменений для следующего релиза пока нет._"
TITLE_RE = re.compile(r"^<!-- release-title: (.+?) -->$", re.MULTILINE)


def split_next_release(text: str) -> tuple[str, str, str]:
    marker = f"{NEXT_RELEASE_HEADING}\n"
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"Missing heading: {NEXT_RELEASE_HEADING}")

    body_start = start + len(marker)
    next_heading = re.search(r"^## ", text[body_start:], re.MULTILINE)
    if next_heading is None:
        body_end = len(text)
    else:
        body_end = body_start + next_heading.start()

    prefix = text[:body_start]
    body = text[body_start:body_end]
    suffix = text[body_end:]
    return prefix, body, suffix


def normalize_section(body: str) -> str:
    return "\n".join(line.rstrip() for line in body.strip().splitlines())


def extract_title(body: str) -> str:
    match = TITLE_RE.search(body)
    if match is None:
        raise ValueError(
            "Next release is missing '<!-- release-title: ... -->' metadata."
        )
    title = match.group(1).strip()
    if not title:
        raise ValueError("Release title metadata is empty.")
    return title


def extract_notes(body: str) -> str:
    notes = TITLE_RE.sub("", body)
    notes = notes.replace(EMPTY_PLACEHOLDER, "")
    notes = notes.strip()
    if not notes:
        raise ValueError("Next release has no release notes to archive.")
    if re.search(r"^### Трассировка\s*$", notes, re.MULTILINE):
        raise ValueError("Next release already contains a tracing section.")
    return notes


def archive_release(
    current_text: str,
    released_text: str,
    release_date: str,
    released_source: str,
    production_tag: str,
    github_release: str,
) -> str:
    prefix, current_body, suffix = split_next_release(current_text)
    _, released_body, _ = split_next_release(released_text)

    if normalize_section(current_body) != normalize_section(released_body):
        raise ValueError(
            "Current 'Следующий релиз' changed after the released source was built; "
            "refusing to overwrite newer notes."
        )

    title = extract_title(released_body)
    notes = extract_notes(released_body)
    historical_heading = f"## {release_date} — {title}"

    if historical_heading in current_text:
        raise ValueError(f"Historical release heading already exists: {historical_heading}")

    tracing = "\n".join(
        [
            "### Трассировка",
            "",
            f"- Production source: `{released_source}`.",
            f"- Production tag: `{production_tag}`.",
            f"- GitHub Release: `{github_release}`.",
        ]
    )

    replacement = (
        f"\n{EMPTY_PLACEHOLDER}\n\n"
        f"{historical_heading}\n\n"
        f"{notes}\n\n"
        f"{tracing}\n\n"
    )
    return prefix + replacement + suffix.lstrip("\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--current", required=True, type=Path)
    parser.add_argument("--released", required=True, type=Path)
    parser.add_argument("--release-date", required=True)
    parser.add_argument("--released-source", required=True)
    parser.add_argument("--production-tag", required=True)
    parser.add_argument("--github-release", required=True)
    args = parser.parse_args()

    current_text = args.current.read_text(encoding="utf-8")
    released_text = args.released.read_text(encoding="utf-8")
    updated = archive_release(
        current_text=current_text,
        released_text=released_text,
        release_date=args.release_date,
        released_source=args.released_source,
        production_tag=args.production_tag,
        github_release=args.github_release,
    )
    args.current.write_text(updated, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
