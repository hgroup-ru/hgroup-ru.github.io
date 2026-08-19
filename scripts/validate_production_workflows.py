#!/usr/bin/env python3

from pathlib import Path
import sys

WORKFLOWS_DIR = Path(".github/workflows")
PUBLISH_WORKFLOW = WORKFLOWS_DIR / "publish.yml"
RELEASE_WORKFLOW = WORKFLOWS_DIR / "release.yml"
CONTROL_WORKFLOW = WORKFLOWS_DIR / "release-control.yml"


def fail(message: str) -> None:
    print(f"production workflow invariant failed: {message}", file=sys.stderr)
    raise SystemExit(1)


def read(path: Path) -> str:
    if not path.is_file():
        fail(f"missing required workflow: {path}")
    return path.read_text(encoding="utf-8")


def require(text: str, marker: str, scope: str) -> None:
    if marker not in text:
        fail(f"{scope} is missing required marker: {marker!r}")


def main() -> None:
    publish = read(PUBLISH_WORKFLOW)
    release = read(RELEASE_WORKFLOW)
    control = read(CONTROL_WORKFLOW)

    for marker in (
        "push:",
        "workflow_dispatch:",
        "workflow_call:",
        "group: github-pages-publish",
        "Build RU site",
        "actions/upload-pages-artifact@",
        "actions/deploy-pages@",
        "pages: write",
    ):
        require(publish, marker, "publish.yml")

    for marker in (
        "workflow_dispatch:",
        "uses: ./.github/workflows/publish.yml",
        "Tag official release source",
        "gh release create",
        "archive-release-notes:",
        "sync-maintainer-state:",
    ):
        require(release, marker, "release.yml")

    for marker in (
        "actions/deploy-pages@",
        "actions/upload-pages-artifact@",
        "prod-fix-",
        "mode:",
        "ALGOLIA_CRAWLER",
        "crawler.algolia.com",
    ):
        if marker in release:
            fail(f"release.yml contains retired or publish-owned marker: {marker!r}")

    for path in sorted(WORKFLOWS_DIR.glob("*.yml")):
        if path == PUBLISH_WORKFLOW:
            continue
        text = path.read_text(encoding="utf-8")
        for marker in ("actions/deploy-pages@", "actions/upload-pages-artifact@"):
            if marker in text:
                fail(
                    f"{path} contains publish implementation marker {marker!r}; "
                    "only publish.yml may implement GitHub Pages deployment"
                )

    for marker in (
        "github.event.issue.number == 100",
        "github.event.issue.number == 102",
        '100) workflow="release.yml"',
        '102) workflow="publish.yml"',
        "Reopen control issue",
    ):
        require(control, marker, "release-control.yml")

    for marker in (
        "actions/deploy-pages@",
        "actions/upload-pages-artifact@",
        "git tag",
        "gh release create",
        "ALGOLIA_CRAWLER",
    ):
        if marker in control:
            fail(f"release-control.yml must only dispatch workflows; found {marker!r}")

    print("production workflow invariants: OK")


if __name__ == "__main__":
    main()
