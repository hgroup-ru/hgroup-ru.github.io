#!/usr/bin/env python3

from pathlib import Path
import sys

PUBLISH_WORKFLOW = Path(".github/workflows/publish.yml")


def fail(message: str) -> None:
    print(f"site build decision failed: {message}", file=sys.stderr)
    raise SystemExit(1)


def publish_paths() -> list[str]:
    if not PUBLISH_WORKFLOW.is_file():
        fail(f"missing publish workflow: {PUBLISH_WORKFLOW}")

    paths: list[str] = []
    in_paths = False

    for line in PUBLISH_WORKFLOW.read_text(encoding="utf-8").splitlines():
        if line == "    paths:":
            in_paths = True
            continue

        if not in_paths:
            continue

        if line.startswith("      - "):
            pattern = line.removeprefix("      - ").strip().strip("'\"")
            if not pattern:
                fail("publish.yml contains an empty path filter")
            paths.append(pattern)
            continue

        if line.strip():
            break

    if not paths:
        fail("could not find push.paths in publish.yml")

    for pattern in paths:
        if "*" in pattern and not pattern.endswith("/**"):
            fail(f"unsupported publish path pattern: {pattern!r}")

    return paths


def matches(path: str, pattern: str) -> bool:
    if pattern.endswith("/**"):
        prefix = pattern[:-3]
        return path == prefix or path.startswith(prefix + "/")
    return path == pattern


def main() -> None:
    changed_paths = [line.strip() for line in sys.stdin if line.strip()]
    required = any(
        matches(path, pattern)
        for path in changed_paths
        for pattern in publish_paths()
    )
    print("true" if required else "false")


if __name__ == "__main__":
    main()
