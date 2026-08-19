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

    ci_required = (
        "pull-requests: read",
        "RUN_HEAD_SHA:",
        "notification_is_current()",
        'current_state="$(printf',
        'current_head="$(printf',
        'if [ "$current_state" != "open" ]',
        'if [ "$current_head" != "$RUN_HEAD_SHA" ]',
        'case "$CI_RESULT" in',
        "cancelled|skipped)",
        'CI result is $CI_RESULT; this is not a failure notification.',
    )
    for marker in ci_required:
        require(ci, marker, "ci.yml")

    if ci.count("if ! notification_is_current; then") < 2:
        fail("ci.yml must verify the current PR head both before composing and before sending")

    if 'if [ "$CI_RESULT" = "success" ]; then' in ci:
        fail("ci.yml must not classify every non-success result as a failure")

    release_required = (
        'elif release_result == "cancelled":',
        "Production уже задеплоен, но публикация",
        "отменена до успешного deploy",
        'release_result != "cancelled"',
        '--data-urlencode "chat_id=${TELEGRAM_CHAT_ID}"',
        "fix_mode=$(step_result build 'Record production-fix mode')",
        'if [ "$FIX_MODE_RESULT" = "success" ]; then',
    )
    for marker in release_required:
        require(release, marker, "release-notify.yml")

    if "ALGOLIA_RESULT" in release or "job_result algolia" in release or "algolia:" in release:
        fail("release-notify.yml must not report retired release-time Algolia reindex status")

    print("notification workflow invariants: OK")


if __name__ == "__main__":
    main()
