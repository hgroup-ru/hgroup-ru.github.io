import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

import {
  hanabiGameStateSchema,
  type Player,
} from "../plugins/hanabiDocusaurusPlugin/plugin/src/hanabiGameState.ts";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const CONFIG_PATH = path.join(
  REPO_ROOT,
  "localization/LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json",
);

const EXACT_CARD_PATTERN = /^(?:[rygbp])(?<rank>[1-5])$/v;
const COPY_LIMITS: ReadonlyMap<number, number> = new Map([
  [1, 3],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
]);
const LEVEL_CONFIG_SCHEMA = z.array(z.int().positive()).min(1).readonly();

const configContents = await readFile(CONFIG_PATH);
const configuredLevels = LEVEL_CONFIG_SCHEMA.parse(
  JSON.parse(configContents) as unknown,
);

const statesByLevel = await Promise.all(
  configuredLevels.map(async (level) => {
    const matches = await glob(
      path.join(EN_ROOT, `level-${level}-*/question.yml`),
    );
    return { level, files: matches.toSorted() } as const;
  }),
);

for (const { level, files } of statesByLevel) {
  if (files.length === 0) {
    throw new Error(
      `No Local CQ question states found for configured level ${level}.`,
    );
  }
}

await Promise.all(statesByLevel.flatMap(({ files }) => files.map(validateState)));

console.log(
  `Local CQ state preflight passed for levels: ${configuredLevels.join(", ")}.`,
);

async function validateState(filePath: string): Promise<void> {
  const contents = await readFile(filePath);
  const state = hanabiGameStateSchema.parse(parse(contents) as unknown);
  const players = state.players.filter(isPlayer);

  if (players.length < 2 || players.length > 5) {
    fail(filePath, `unsupported player count: ${players.length}`);
  }

  const expectedHandSize = players.length <= 3 ? 5 : 4;
  const physicalCounts = new Map<string, number>();
  const recordExactCard = (type: string): void => {
    if (!EXACT_CARD_PATTERN.test(type)) {
      return;
    }
    physicalCounts.set(type, (physicalCounts.get(type) ?? 0) + 1);
  };

  for (const [playerIndex, player] of players.entries()) {
    if (player.cards.length !== expectedHandSize) {
      const name = player.name ?? `#${playerIndex + 1}`;
      fail(
        filePath,
        `${name} has ${player.cards.length} cards; ${players.length}-player Hanabi requires ${expectedHandSize}`,
      );
    }

    for (const card of player.cards) {
      recordExactCard(card.type);
    }
  }

  const discarded = state.discarded ?? [];
  for (const card of discarded) {
    recordExactCard(card);
  }

  const stacks = state.stacks ?? [];
  for (const stack of stacks) {
    for (const [suit, rank] of Object.entries(stack)) {
      if (rank < 0 || rank > 5) {
        fail(filePath, `invalid ${suit} stack height: ${rank}`);
      }
      for (let currentRank = 1; currentRank <= rank; currentRank += 1) {
        recordExactCard(`${suit}${currentRank}`);
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

function isPlayer(
  entry: z.infer<typeof hanabiGameStateSchema>["players"][number],
): entry is Player {
  return typeof entry === "object" && "cards" in entry;
}

function fail(filePath: string, message: string): never {
  throw new Error(`${relative(filePath)}: ${message}`);
}

function relative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
