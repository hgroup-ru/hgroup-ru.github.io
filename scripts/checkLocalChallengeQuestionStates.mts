import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const SCOPE_PATH = path.join(REPO_ROOT, "localization/LOCAL_CQ_QA_SCOPE.json");

const EXACT_CARD_PATTERN = /^[bgpry](?<rank>[1-5])$/v;
const COPY_LIMITS: ReadonlyMap<number, number> = new Map([
  [1, 3],
  [2, 2],
  [3, 2],
  [4, 2],
  [5, 1],
]);
const LEVEL_LIST_SCHEMA = z.array(z.int().positive()).readonly();
const SCOPE_SECTION_SCHEMA = z
  .object({ enforced: LEVEL_LIST_SCHEMA, deferred: LEVEL_LIST_SCHEMA })
  .strict();
const SCOPE_SCHEMA = z
  .object({
    state_preflight: SCOPE_SECTION_SCHEMA,
    release_evidence: SCOPE_SECTION_SCHEMA,
  })
  .strict();
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

const scope = SCOPE_SCHEMA.parse(
  JSON.parse(await readFile(SCOPE_PATH)) as unknown,
);
const publishedLevels = await discoverPublishedLevels();
validateScope("state_preflight", scope.state_preflight, publishedLevels);

const statesByLevel = await Promise.all(
  scope.state_preflight.enforced.map(async (level) => {
    const files = await glob(
      path.join(EN_ROOT, `level-${level}-*/*.{yml,yaml}`),
    );
    const solutionFiles = await collectSolutionStateFiles(level);
    return { level, files: files.toSorted(), solutionFiles } as const;
  }),
);

for (const { level, files } of statesByLevel) {
  if (files.length === 0) {
    throw new Error(
      `No Local CQ diagram states found for enforced level ${level}.`,
    );
  }
}

await Promise.all(
  statesByLevel.flatMap(({ files, solutionFiles }) =>
    files.map(async (filePath) => {
      await validateState(filePath, solutionFiles.has(filePath));
    }),
  ),
);

console.log(
  `Local CQ state preflight passed for levels: ${scope.state_preflight.enforced.join(", ")}.`,
);

async function validateState(filePath: string, solutionState: boolean) {
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

    if (solutionState && player.clueGiver === true) {
      fail(
        filePath,
        `${name} is still marked clueGiver in a Solution knowledge state; historical clues must not be rendered as current actions`,
      );
    }

    for (const [cardIndex, card] of player.cards.entries()) {
      recordExactCard(card.type);

      if (!solutionState) {
        continue;
      }

      const slot = cardIndex + 1;
      if (card.clue !== undefined) {
        fail(
          filePath,
          `${name} slot ${slot} still has clue=${card.clue} in a Solution knowledge state; encode historical knowledge without a current clue arrow`,
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

async function collectSolutionStateFiles(
  level: number,
): Promise<ReadonlySet<string>> {
  const mdxFiles = await glob(path.join(EN_ROOT, `level-${level}-*.mdx`));
  const importPattern =
    /import\s+(?<name>[$A-Z_a-z][\w$]*)\s+from\s+"(?<source>[^"]+\.ya?ml)"/gv;
  const solutionPattern =
    /<TabItem\s+value="solution">(?<body>[\s\S]*?)<\/TabItem>/v;

  const stateFilesByPage = await Promise.all(
    mdxFiles.map(async (mdxFile) => {
      const contents = await readFile(mdxFile);
      const solutionBody = solutionPattern.exec(contents)?.groups?.["body"];
      if (solutionBody === undefined) {
        return [] as string[];
      }

      return contents
        .matchAll(importPattern)
        .flatMap((match) => {
          const name = match.groups?.["name"];
          const source = match.groups?.["source"];
          if (name === undefined || source === undefined) {
            return [];
          }
          const componentPattern = new RegExp(
            String.raw`<${name}(?:\s|/|>)`,
            "v",
          );
          if (!componentPattern.test(solutionBody)) {
            return [];
          }
          const resolved = source.startsWith("@site/")
            ? path.join(REPO_ROOT, source.slice("@site/".length))
            : path.resolve(path.dirname(mdxFile), source);
          return [resolved];
        })
        .toArray();
    }),
  );

  return new Set(stateFilesByPage.flat());
}

async function discoverPublishedLevels(): Promise<ReadonlySet<number>> {
  const files = await glob(path.join(EN_ROOT, "level-*-*.mdx"));
  return new Set(
    files.flatMap((filePath) => {
      const match = /^level-(?<level>\d+)-/v.exec(path.basename(filePath));
      const level = match?.groups?.["level"];
      return level === undefined ? [] : [Number(level)];
    }),
  );
}

function validateScope(
  name: string,
  section: z.infer<typeof SCOPE_SECTION_SCHEMA>,
  levels: ReadonlySet<number>,
) {
  const enforced = new Set(section.enforced);
  const deferred = new Set(section.deferred);
  if (
    enforced.size !== section.enforced.length
    || deferred.size !== section.deferred.length
  ) {
    throw new Error(`${name} scope contains duplicate level entries.`);
  }
  const overlap = [...enforced].filter((level) => deferred.has(level));
  if (overlap.length > 0) {
    throw new Error(
      `${name} scope has levels both enforced and deferred: ${overlap.join(", ")}`,
    );
  }
  const classified = new Set([...enforced, ...deferred]);
  const missing = [...levels].filter((level) => !classified.has(level));
  const stale = [...classified].filter((level) => !levels.has(level));
  if (missing.length > 0 || stale.length > 0) {
    const missingText = missing.length === 0 ? "none" : missing.join(", ");
    const staleText = stale.length === 0 ? "none" : stale.join(", ");
    throw new Error(
      `${name} scope must classify every published Local CQ level exactly once. Missing: ${missingText}; stale: ${staleText}.`,
    );
  }
}

function fail(filePath: string, message: string): never {
  throw new Error(`${relative(filePath)}: ${message}`);
}

function relative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
