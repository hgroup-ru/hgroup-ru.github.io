import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const CONFIG_PATH = path.join(
  REPO_ROOT,
  "localization/LOCAL_CQ_STATE_PREFLIGHT_LEVELS.json",
);

const EXACT_CARD_PATTERN = /^[bgpry](?<rank>[1-5])$/v;
const ANSWER_STATE_PATTERN =
  /^(?:answer|solution)(?:\.|-|$)/v;
const COPY_LIMITS: ReadonlyMap<number, number> = new Map([
  [1, 3],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
]);
const LEVEL_CONFIG_SCHEMA = z.array(z.int().positive()).min(1).readonly();
const CARD_SCHEMA = z
  .object({
    type: z.coerce.string().min(1),
    clue: z.coerce.string().min(1).optional(),
    middleNote: z.coerce.string().min(1).optional(),
    above: z.coerce.string().min(1).optional(),
    below: z.coerce.string().min(1).optional(),
  })
  .loose()
  .readonly();
const PLAYER_SCHEMA = z
  .object({
    name: z.coerce.string().min(1).optional(),
    clueGiver: z.boolean().optional(),
    cards: z.array(CARD_SCHEMA).readonly(),
  })
  .loose()
  .readonly();
const STACK_SCHEMA = z.record(z.string().length(1), z.number()).readonly();
const STATE_PREFLIGHT_SCHEMA = z
  .object({
    players: z.array(z.unknown()).readonly(),
    discarded: z.array(z.coerce.string().min(1)).readonly().optional(),
    stacks: z.array(STACK_SCHEMA).readonly().optional(),
  })
  .loose()
  .readonly();

const configContents = await readFile(CONFIG_PATH);
const configuredLevels = LEVEL_CONFIG_SCHEMA.parse(
  JSON.parse(configContents) as unknown,
);

const statesByLevel = await Promise.all(
  configuredLevels.map(async (level) => {
    const matches = await glob(
      path.join(EN_ROOT, `level-${level}-*/*.{yml,yaml}`),
    );
    return { level, files: matches.toSorted() } as const;
  }),
);

for (const { level, files } of statesByLevel) {
  if (files.length === 0) {
    throw new Error(
      `No Local CQ diagram states found for configured level ${level}.`,
    );
  }
}

await Promise.all(
  statesByLevel.flatMap(({ files }) => files.map(validateState)),
);

console.log(
  `Local CQ state preflight passed for levels: ${configuredLevels.join(", ")}.`,
);

async function validateState(filePath: string) {
  const contents = await readFile(filePath);
  const state = STATE_PREFLIGHT_SCHEMA.parse(parse(contents) as unknown);
  const players = state.players.flatMap((entry) => {
    const parsedPlayer = PLAYER_SCHEMA.safeParse(entry);
    return parsedPlayer.success ? [parsedPlayer.data] : [];
  });

  if (players.length < 2 || players.length > 5) {
    fail(filePath, `unsupported player count: ${players.length}`);
  }

  const expectedHandSize = players.length <= 3 ? 5 : 4;
  const physicalCounts = new Map<string, number>();
  const answerState = ANSWER_STATE_PATTERN.test(
    path.basename(filePath).toLowerCase(),
  );
  const recordExactCard = (type: string): void => {
    if (!EXACT_CARD_PATTERN.test(type)) {
      return;
    }
    physicalCounts.set(type, (physicalCounts.get(type) ?? 0) + 1);
  };

  for (const [playerIndex, player] of players.entries()) {
    const name = player.name ?? `#${playerIndex + 1}`;
    if (player.cards.length !== expectedHandSize) {
      fail(
        filePath,
        `${name} has ${player.cards.length} cards; ${players.length}-player Hanabi requires ${expectedHandSize}`,
      );
    }

    if (answerState && player.clueGiver === true) {
      fail(
        filePath,
        `${name} is still marked clueGiver in an answer/solution knowledge state; historical clues must not be rendered as current actions`,
      );
    }

    for (const [cardIndex, card] of player.cards.entries()) {
      recordExactCard(card.type);

      if (!answerState) {
        continue;
      }

      const slot = cardIndex + 1;
      if (card.clue !== undefined) {
        fail(
          filePath,
          `${name} slot ${slot} still has clue=${card.clue} in an answer/solution knowledge state; encode historical knowledge without a current clue arrow`,
        );
      }

      if (
        EXACT_CARD_PATTERN.test(card.type)
        && (card.middleNote !== undefined
          || card.above !== undefined
          || card.below !== undefined)
      ) {
        fail(
          filePath,
          `${name} slot ${slot} uses objective exact identity ${card.type} as a carrier for owner knowledge; use an owner-knowledge card type (for example x, r, or 4) and keep the conclusion in notes/labels`,
        );
      }
    }
  }

  const discarded = state.discarded ?? [];
  for (const card of discarded) {
    recordExactCard(card);
  }

  const stacks = state.stacks ?? [];
  for (const stack of stacks) {
    for (const [suit, rank] of Object.entries(stack)) {
      if (rank < 0 || rank > 5 || !Number.isSafeInteger(rank)) {
        fail(filePath, `invalid ${suit} stack height: ${rank}`);
      }
      for (let currentRank = 1; currentRank <= rank; currentRank++) {
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
      fail(
        filePath,
        `${card} appears ${count} physical times; deck limit is ${limit}`,
      );
    }
  }
}

function fail(filePath: string, message: string): never {
  throw new Error(`${relative(filePath)}: ${message}`);
}

function relative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
