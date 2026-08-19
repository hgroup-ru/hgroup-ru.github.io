#!/usr/bin/env python3

from pathlib import Path
import sys

CI_WORKFLOW = Path(".github/workflows/ci.yml")
RELEASE_NOTIFY_WORKFLOW = Path(".github/workflows/release-notify.yml")


def fail(message: str) -> None:
    print(f"notification workflow invariant failed: {message}", file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"missing workflow: {path}")
    return path.read_text(encoding="utf-8")


def require(text: str, marker: str, scope: str) -> None:
    if marker not in text:
        fail(f"{scope} is missing required marker: {marker!r}")


def main() -> None:
    ci = read(CI_WORKFLOW)
    release = read(RELEASE_NOTIFY_WORKFLOW)

    for marker in (
        "pull-requests: read",
        "RUN_HEAD_SHA:",
        "notification_is_current()",
        'if [ "$current_state" != "open" ]',
        'if [ "$current_head" != "$RUN_HEAD_SHA" ]',
        'case "$CI_RESULT" in',
        "cancelled|skipped)",
        "fetch-depth: 2",
        "- name: Detect site build requirement",
        "git diff --name-only HEAD^1 HEAD^2",
        "scripts/site_build_required.py",
        "steps.site-build.outputs.required == 'true'",
        "- name: Build RU site",
        "run: npm run build:ru",
    ):
        require(ci, marker, "ci.yml")

    if "fetch-depth: 0" in ci:
        fail("ci.yml must not fetch the full repository history for pull-request diff detection")

    if "Build RU site for fork pull requests" in ci:
        fail("ci.yml contains the retired fork-only build policy")

    if "github.event.pull_request.head.repo.full_name != github.repository" in ci:
        fail("ci.yml contains the retired fork-only build condition")

    if ci.count("if ! notification_is_current; then") < 2:
        fail("ci.yml must verify the current PR head before sending")

    for marker in (
        "workflows:",
        "- Release",
        "Официальный релиз опубликован",
        "elif release_url:",
        "опубликован, но post-release завершился неуспешно",
        "отменён до публикации GitHub Release",
        "упал до публикации GitHub Release",
        "Что нового",
        '--data-urlencode "chat_id=${TELEGRAM_CHAT_ID}"',
    ):
        require(release, marker, "release-notify.yml")

    for retired in ("ALGOLIA_RESULT", "Production fix", "IS_FIX", "fix_mode"):
        if retired in release:
            fail(f"release-notify.yml contains retired release concept: {retired!r}")

    print("notification workflow invariants: OK")


if __name__ == "__main__":
    main()
