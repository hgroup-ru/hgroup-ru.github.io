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

const SUITS: ReadonlySet<string> = new Set(["r", "y", "g", "b", "p"]);
const EXACT_CARD_PATTERN = /^(?<suit>[rygbp])(?<rank>[1-5])$/v;
const COPY_LIMITS: ReadonlyMap<number, number> = new Map([
  [1, 3],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
]);

const configuredLevels = parseLevelConfig(await readFile(CONFIG_PATH));
const statesByLevel = await Promise.all(
  configuredLevels.map(async (level) => ({
    level,
    files: (
      await glob(path.join(EN_ROOT, `level-${level}-*/question.yml`))
    ).toSorted(),
  })),
);

for (const { level, files } of statesByLevel) {
  if (files.length === 0) {
    throw new Error(`No Local CQ question states found for configured level ${level}.`);
  }
}

await Promise.all(statesByLevel.flatMap(({ files }) => files.map(validateState)));

console.log(
  `Local CQ state preflight passed for levels: ${configuredLevels.join(", ")}.`,
);

function parseLevelConfig(contents: string): readonly number[] {
  const parsed = JSON.parse(contents) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(
      "LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json must be a non-empty array of positive integer levels.",
    );
  }

  const values: readonly unknown[] = parsed;
  if (
    values.length === 0
    || values.some(
      (value) =>
        typeof value !== "number"
        || !Number.isSafeInteger(value)
        || value < 1,
    )
  ) {
    throw new Error(
      "LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json must be a non-empty array of positive integer levels.",
    );
  }

  const levels = values.map((value) => Number(value));
  return [...new Set(levels)].toSorted((left, right) => left - right);
}

async function validateState(filePath: string): Promise<void> {
  const parsed = parse(await readFile(filePath)) as unknown;
  const state = asRecord(parsed, filePath);
  const rawPlayers = state["players"];
  if (!Array.isArray(rawPlayers)) {
    fail(filePath, "players must be an array");
  }
  const players: readonly unknown[] = rawPlayers;
  if (players.length < 2 || players.length > 5) {
    fail(filePath, `unsupported player count: ${players.length}`);
  }

  const expectedHandSize = players.length <= 3 ? 5 : 4;
  const physicalCounts = new Map<string, number>();
  const recordExactCard = (type: string) => {
    if (!EXACT_CARD_PATTERN.test(type)) {
      return;
    }
    physicalCounts.set(type, (physicalCounts.get(type) ?? 0) + 1);
  };

  for (const [playerIndex, rawPlayer] of players.entries()) {
    const player = asRecord(rawPlayer, filePath);
    const rawCards = player["cards"];
    if (!Array.isArray(rawCards)) {
      fail(filePath, `player ${playerIndex + 1} cards must be an array`);
    }
    const cards: readonly unknown[] = rawCards;
    if (cards.length !== expectedHandSize) {
      const rawName = player["name"];
      const name =
        typeof rawName === "string" ? rawName : `#${playerIndex + 1}`;
      fail(
        filePath,
        `${name} has ${cards.length} cards; ${players.length}-player Hanabi requires ${expectedHandSize}`,
      );
    }

    for (const rawCard of cards) {
      const card = asRecord(rawCard, filePath);
      const type = card["type"];
      if (typeof type === "string") {
        recordExactCard(type);
      }
    }
  }

  const rawDiscarded = state["discarded"];
  if (rawDiscarded !== undefined) {
    if (!Array.isArray(rawDiscarded)) {
      fail(filePath, "discarded must be an array when present");
    }
    const discarded: readonly unknown[] = rawDiscarded;
    for (const card of discarded) {
      if (typeof card === "string") {
        recordExactCard(card);
      }
    }
  }

  const rawStacks = state["stacks"];
  if (rawStacks !== undefined) {
    if (!Array.isArray(rawStacks)) {
      fail(filePath, "stacks must be an array when present");
    }
    const stacks: readonly unknown[] = rawStacks;
    for (const rawStack of stacks) {
      const stack = asRecord(rawStack, filePath);
      for (const [suit, rawRank] of Object.entries(stack)) {
        if (
          !SUITS.has(suit)
          || typeof rawRank !== "number"
          || !Number.isSafeInteger(rawRank)
        ) {
          continue;
        }
        if (rawRank < 0 || rawRank > 5) {
          fail(filePath, `invalid ${suit} stack height: ${rawRank}`);
        }
        for (let rank = 1; rank <= rawRank; rank += 1) {
          recordExactCard(`${suit}${rank}`);
        }
      }
    }
  }

  for (const [card, count] of physicalCounts) {
    const match = EXACT_CARD_PATTERN.exec(card);
    const rankText = match?.groups?.["rank"];
    if (rankText === undefined) {
      continue;
    }
    const limit = COPY_LIMITS.get(Number(rankText));
    if (limit !== undefined && count > limit) {
      fail(filePath, `${card} appears ${count} physical times; deck limit is ${limit}`);
    }
  }
}

function asRecord(
  value: unknown,
  filePath: string,
): Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(filePath, "expected a YAML object");
  }
  return value as Readonly<Record<string, unknown>>;
}

function fail(filePath: string, message: string): never {
  throw new Error(`${relative(filePath)}: ${message}`);
}

function relative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
