#!/usr/bin/env python3

from pathlib import Path
import sys

WORKFLOWS_DIR = Path(".github/workflows")
RELEASE_WORKFLOW = WORKFLOWS_DIR / "release.yml"
CONTROL_WORKFLOW = WORKFLOWS_DIR / "release-control.yml"

RELEASE_REQUIRED = (
    "workflow_dispatch:",
    "mode:",
    "- release",
    "- fix",
    "group: github-pages-release",
    "actions/deploy-pages@",
    "Tag production source",
    "prod-fix-",
    "Publish GitHub Release",
    "archive-release-notes:",
    "if: inputs.mode != 'fix'",
    "sync-maintainer-state:",
)

EXCLUSIVE_PRODUCTION_MARKERS = (
    "actions/deploy-pages@",
    "pages: write",
    "gh release create",
    "gh release edit",
)


def fail(message: str) -> None:
    print(f"production workflow invariant failed: {message}", file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"missing required workflow: {path}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    release = read(RELEASE_WORKFLOW)
    control = read(CONTROL_WORKFLOW)

    for marker in RELEASE_REQUIRED:
        if marker not in release:
            fail(f"release.yml is missing required marker: {marker!r}")

    for path in sorted(WORKFLOWS_DIR.glob("*.yml")):
        if path == RELEASE_WORKFLOW:
            continue
        text = path.read_text(encoding="utf-8")
        for marker in EXCLUSIVE_PRODUCTION_MARKERS:
            if marker in text:
                fail(
                    f"{path} contains production-owned marker {marker!r}; "
                    "only release.yml may mutate production"
                )

    control_required = (
        "issues:",
        "- closed",
        "github.event.issue.number == 100",
        "github.event.issue.number == 102",
        "actions: write",
        'actions/workflows/release.yml/dispatches',
        'mode="release"',
        'mode="fix"',
        "inputs: {mode: $mode}",
        "Reopen control issue",
    )
    for marker in control_required:
        if marker not in control:
            fail(f"release-control.yml is missing required marker: {marker!r}")

    forbidden_control_markers = (
        "actions/deploy-pages@",
        "actions/upload-pages-artifact@",
        "git tag",
        "gh release create",
        "gh release edit",
        "ALGOLIA_CRAWLER",
    )
    for marker in forbidden_control_markers:
        if marker in control:
            fail(
                "release-control.yml must only dispatch release.yml; "
                f"found forbidden marker {marker!r}"
            )

    normal_tag_filter = "grep -E '^prod-[0-9]{8}-[0-9]+$'"
    if normal_tag_filter not in release:
        fail("normal release-note freshness must ignore prod-fix tags")

    if "No user-facing release notes were published or archived." not in release:
        fail("fix mode must use technical metadata instead of CHANGELOG release notes")

    print("production workflow invariants: OK")


if __name__ == "__main__":
    main()
