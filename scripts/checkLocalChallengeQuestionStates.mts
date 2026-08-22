import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { parse } from "yaml";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const CONFIG_PATH = path.join(
  REPO_ROOT,
  "localization/LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json",
);

const SUITS = new Set(["r", "y", "g", "b", "p"]);
const EXACT_CARD_PATTERN = /^(?<suit>[rygbp])(?<rank>[1-5])$/v;
const COPY_LIMITS = new Map([
  [1, 3],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
]);

const configuredLevels = parseLevelConfig(await readFile(CONFIG_PATH));

for (const level of configuredLevels) {
  const questionStateFiles = (
    await glob(path.join(EN_ROOT, `level-${level}-*/question.yml`))
  ).toSorted();

  if (questionStateFiles.length === 0) {
    throw new Error(`No Local CQ question states found for configured level ${level}.`);
  }

  for (const filePath of questionStateFiles) {
    await validateState(filePath);
  }
}

console.log(
  `Local CQ state preflight passed for levels: ${configuredLevels.join(", ")}.`,
);

function parseLevelConfig(contents: string): readonly number[] {
  const parsed: unknown = JSON.parse(contents);
  if (
    !Array.isArray(parsed)
    || parsed.length === 0
    || parsed.some((value) => !Number.isInteger(value) || Number(value) < 1)
  ) {
    throw new Error(
      "LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json must be a non-empty array of positive integer levels.",
    );
  }
  return [...new Set(parsed.map(Number))].toSorted((left, right) => left - right);
}

async function validateState(filePath: string) {
  const parsed: unknown = parse(await readFile(filePath));
  const state = asRecord(parsed, filePath);
  const players = state["players"];
  if (!Array.isArray(players)) {
    fail(filePath, "players must be an array");
  }
  if (players.length < 2 || players.length > 5) {
    fail(filePath, `unsupported player count: ${players.length}`);
  }

  const expectedHandSize = players.length <= 3 ? 5 : 4;
  const physicalCounts = new Map<string, number>();

  for (const [playerIndex, rawPlayer] of players.entries()) {
    const player = asRecord(rawPlayer, filePath);
    const cards = player["cards"];
    if (!Array.isArray(cards)) {
      fail(filePath, `player ${playerIndex + 1} cards must be an array`);
    }
    if (cards.length !== expectedHandSize) {
      const name = typeof player["name"] === "string" ? player["name"] : `#${playerIndex + 1}`;
      fail(
        filePath,
        `${name} has ${cards.length} cards; ${players.length}-player Hanabi requires ${expectedHandSize}`,
      );
    }

    for (const rawCard of cards) {
      const card = asRecord(rawCard, filePath);
      const type = card["type"];
      if (typeof type === "string") {
        countExactCard(physicalCounts, type);
      }
    }
  }

  const discarded = state["discarded"];
  if (discarded !== undefined) {
    if (!Array.isArray(discarded)) {
      fail(filePath, "discarded must be an array when present");
    }
    for (const card of discarded) {
      if (typeof card === "string") {
        countExactCard(physicalCounts, card);
      }
    }
  }

  const stacks = state["stacks"];
  if (stacks !== undefined) {
    if (!Array.isArray(stacks)) {
      fail(filePath, "stacks must be an array when present");
    }
    for (const rawStack of stacks) {
      const stack = asRecord(rawStack, filePath);
      for (const [suit, rawRank] of Object.entries(stack)) {
        if (!SUITS.has(suit) || typeof rawRank !== "number" || !Number.isInteger(rawRank)) {
          continue;
        }
        if (rawRank < 0 || rawRank > 5) {
          fail(filePath, `invalid ${suit} stack height: ${rawRank}`);
        }
        for (let rank = 1; rank <= rawRank; rank += 1) {
          countExactCard(physicalCounts, `${suit}${rank}`);
        }
      }
    }
  }

  for (const [card, count] of physicalCounts) {
    const match = EXACT_CARD_PATTERN.exec(card);
    if (match === null) {
      continue;
    }
    const rank = Number(match.groups?.["rank"]);
    const limit = COPY_LIMITS.get(rank);
    if (limit !== undefined && count > limit) {
      fail(filePath, `${card} appears ${count} physical times; deck limit is ${limit}`);
    }
  }
}

function countExactCard(counts: Map<string, number>, type: string) {
  if (!EXACT_CARD_PATTERN.test(type)) {
    return;
  }
  counts.set(type, (counts.get(type) ?? 0) + 1);
}

function asRecord(value: unknown, filePath: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(filePath, "expected a YAML object");
  }
  return value as Record<string, unknown>;
}

function fail(filePath: string, message: string): never {
  throw new Error(`${relative(filePath)}: ${message}`);
}

function relative(filePath: string) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
