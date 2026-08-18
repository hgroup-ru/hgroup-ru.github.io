#!/usr/bin/env bash
set -euo pipefail
prettier --write scripts/lint.mts
git diff -- scripts/lint.mts
exit 1
