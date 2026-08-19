#!/usr/bin/env python3

from __future__ import annotations

import os
import subprocess
import sys

NO_RELEASE_NOTE_MARKER = "[no release note]"
USER_FACING_PREFIXES = (
    "docs/",
    "i18n/",
    "src/",
    "static/",
)
USER_FACING_FILES = {
    "docusaurus.config.ts",
    "sidebars.ts",
}


def git_diff_names(base_sha: str, head_sha: str) -> list[str]:
    output = subprocess.check_output(
        ["git", "diff", "--name-only", f"{base_sha}...{head_sha}"],
        text=True,
    )
    return [line.strip() for line in output.splitlines() if line.strip()]


def is_user_facing(path: str) -> bool:
    return path in USER_FACING_FILES or path.startswith(USER_FACING_PREFIXES)


def main() -> int:
    base_sha = os.environ.get("PR_BASE_SHA", "").strip()
    head_sha = os.environ.get("PR_HEAD_SHA", "").strip()
    body = os.environ.get("PR_BODY", "")
    if not base_sha or not head_sha:
        print("release-note decision check: missing PR SHAs", file=sys.stderr)
        return 1

    changed = git_diff_names(base_sha, head_sha)
    user_facing = [path for path in changed if is_user_facing(path)]
    if not user_facing:
        print("release-note decision check: no user-facing files changed")
        return 0

    if "CHANGELOG.md" in changed:
        print("release-note decision check: CHANGELOG.md updated")
        return 0

    if NO_RELEASE_NOTE_MARKER in body.lower():
        print("release-note decision check: explicit no-release-note decision recorded")
        return 0

    print("User-facing files changed without a CHANGELOG.md update.", file=sys.stderr)
    print("Add a human-readable note to '## Следующий релиз'.", file=sys.stderr)
    print(
        f"If the change intentionally has no user-facing effect, add {NO_RELEASE_NOTE_MARKER} to the PR body.",
        file=sys.stderr,
    )
    print("User-facing paths:", file=sys.stderr)
    for path in user_facing:
        print(f"- {path}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
