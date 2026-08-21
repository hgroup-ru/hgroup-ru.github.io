#!/usr/bin/env python3

from pathlib import Path
import sys

CI_WORKFLOW = Path(".github/workflows/ci.yml")
RELEASE_WORKFLOW = Path(".github/workflows/release.yml")
RELEASE_CONTROL_WORKFLOW = Path(".github/workflows/release-control.yml")
PUBLISH_WORKFLOW = Path(".github/workflows/publish.yml")
MAINTENANCE_WORKFLOW = Path(".github/workflows/maintenance-audit.yml")
PR_MERGE_WORKFLOW = Path(".github/workflows/pr-merge-notify.yml")
RETIRED_RELEASE_NOTIFY_WORKFLOW = Path(".github/workflows/release-notify.yml")


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


def require_all(text: str, markers: tuple[str, ...], scope: str) -> None:
    for marker in markers:
        require(text, marker, scope)


def main() -> None:
    ci = read(CI_WORKFLOW)
    release = read(RELEASE_WORKFLOW)
    control = read(RELEASE_CONTROL_WORKFLOW)
    publish = read(PUBLISH_WORKFLOW)
    maintenance = read(MAINTENANCE_WORKFLOW)
    pr_merge = read(PR_MERGE_WORKFLOW)

    require_all(
        ci,
        (
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
            "continue-on-error: true",
            'https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage',
        ),
        "ci.yml",
    )

    if "fetch-depth: 0" in ci:
        fail("ci.yml must not fetch the full repository history for pull-request diff detection")
    if "Build RU site for fork pull requests" in ci:
        fail("ci.yml contains the retired fork-only build policy")
    if "github.event.pull_request.head.repo.full_name != github.repository" in ci:
        fail("ci.yml contains the retired fork-only build condition")
    if ci.count("if ! notification_is_current; then") < 2:
        fail("ci.yml must verify the current PR head before sending")

    require_all(
        control,
        (
            "Notify Telegram that official release started",
            "github.event.issue.number == 100",
            "steps.dispatch.outcome == 'success'",
            "#release #production #started",
            "Официальный релиз запущен",
            "continue-on-error: true",
        ),
        "release-control.yml",
    )

    require_all(
        release,
        (
            "notify_failure: false",
            "Telegram completion notification",
            "if: ${{ always() }}",
            "RELEASE_RESULT: ${{ needs.release.result }}",
            "ARCHIVE_RESULT: ${{ needs.archive-release-notes.result }}",
            "STATE_RESULT: ${{ needs.sync-maintainer-state.result }}",
            "#release #production ${status}",
            "Официальный релиз опубликован",
            "Релиз опубликован, но post-release завершился неуспешно",
            "Официальный релиз отменён до публикации",
            "Официальный релиз упал до публикации",
            "continue-on-error: true",
        ),
        "release.yml",
    )

    require_all(
        publish,
        (
            "notify_failure:",
            "Telegram failure notification",
            "needs.build.result != 'success' || needs.deploy.result != 'success'",
            "#publish #production #failed",
            "Публикация сайта завершилась неуспешно",
            "continue-on-error: true",
        ),
        "publish.yml",
    )

    require_all(
        maintenance,
        (
            "- name: Notify Telegram",
            "if: ${{ always() }}",
            "#maintenance #audit",
            "Maintenance Audit: PASS",
            "Maintenance Audit: FAIL",
            "upstream drift",
            "continue-on-error: true",
        ),
        "maintenance-audit.yml",
    )

    require_all(
        pr_merge,
        (
            "github.event.pull_request.merged == true",
            "!startsWith(github.event.pull_request.head.ref, 'automation/')",
            "#pr #merged",
            "PR #%s смёржен",
            "continue-on-error: true",
        ),
        "pr-merge-notify.yml",
    )

    if RETIRED_RELEASE_NOTIFY_WORKFLOW.exists():
        fail("retired release-notify.yml must stay deleted; release completion notification belongs in release.yml")

    for scope, text in (
        ("release.yml", release),
        ("release-control.yml", control),
        ("publish.yml", publish),
        ("maintenance-audit.yml", maintenance),
        ("pr-merge-notify.yml", pr_merge),
    ):
        require(text, '--data-urlencode "chat_id=${TELEGRAM_CHAT_ID}"', scope)

    print("notification workflow invariants: OK")


if __name__ == "__main__":
    main()
