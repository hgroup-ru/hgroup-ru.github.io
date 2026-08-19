#!/usr/bin/env python3

from pathlib import Path
import sys

WORKFLOWS_DIR = Path(".github/workflows")
RELEASE_WORKFLOW = WORKFLOWS_DIR / "release.yml"
CONTROL_WORKFLOW = WORKFLOWS_DIR / "release-control.yml"

RELEASE_REQUIRED = (
    "workflow_dispatch",
    "group: github-pages-release",
    "actions/deploy-pages@",
    "Tag production source",
    "Publish GitHub Release",
    "archive-release-notes:",
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
        "actions: write",
        'actions/workflows/release.yml/dispatches',
        "-f ref=main",
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

    print("production workflow invariants: OK")


if __name__ == "__main__":
    main()
