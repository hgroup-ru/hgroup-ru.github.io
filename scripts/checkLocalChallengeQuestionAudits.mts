import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { z } from "zod";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const SCOPE_PATH = path.join(REPO_ROOT, "localization/LOCAL_CQ_QA_SCOPE.json");
const UPSTREAM_PATH = path.join(REPO_ROOT, "upstream.json");
const AUDIT_ROOT = path.join(REPO_ROOT, "localization/audits");

const LEVEL_LIST_SCHEMA = z.array(z.int().positive()).readonly();
const SCOPE_SECTION_SCHEMA = z
  .object({
    enforced: LEVEL_LIST_SCHEMA,
    deferred: LEVEL_LIST_SCHEMA,
  })
  .strict();
const SCOPE_SCHEMA = z
  .object({
    state_preflight: SCOPE_SECTION_SCHEMA,
    release_evidence: SCOPE_SECTION_SCHEMA,
  })
  .strict();
const UPSTREAM_SCHEMA = z
  .object({ revision: z.string().regex(/^[0-9a-f]{40}$/v) })
  .loose();
const STATUS_SCHEMA = z.string().refine(
  (value) => /^(?:pass(?:\b.*)?|n\/a(?:\b.*)?)$/iv.test(value.trim()),
  "status must start with pass or N/A",
);
const RECORD_SCHEMA = z
  .object({
    id: z.string().min(1),
    risk: z.enum(["low", "medium", "high"]),
    source_rule: z.string().min(1),
    learning_objective: z.string().min(1),
    question_type: z.enum([
      "best_move",
      "legality",
      "interpretation",
      "deduction",
    ]),
    modality: z.enum(["can", "should", "must", "only_if"]),
    critical_variable: z.string().min(1),
    pov_player: z.string().min(1),
    blind_answer: z.string().min(1),
    ambiguity: z.literal(false),
    opposite_answer_breaker: z.string().min(1),
    actor_direct_alternative: z.string().min(1),
    mutation: z.string().min(1),
    noise: z.string().min(1),
    leakage: STATUS_SCHEMA,
    timeline: STATUS_SCHEMA,
    physical_state: STATUS_SCHEMA,
    verdict: z.literal("KEEP"),
  })
  .strict();
const AUDIT_SCHEMA = z
  .object({
    level: z.int().positive(),
    source_revision: z.string().regex(/^[0-9a-f]{40}$/v),
    records: z.array(RECORD_SCHEMA).min(1),
  })
  .strict();

const scope = SCOPE_SCHEMA.parse(JSON.parse(await readFile(SCOPE_PATH)) as unknown);
const upstream = UPSTREAM_SCHEMA.parse(
  JSON.parse(await readFile(UPSTREAM_PATH)) as unknown,
);
const publishedLevels = await discoverPublishedLevels();
validateScope("release_evidence", scope.release_evidence, publishedLevels);

await Promise.all(
  scope.release_evidence.enforced.map(async (level) => {
    await validateLevel(level, upstream.revision);
  }),
);

console.log(
  `Local CQ audit evidence passed for levels: ${scope.release_evidence.enforced.join(", ")}.`,
);

async function validateLevel(level: number, sourceRevision: string) {
  const auditPath = path.join(AUDIT_ROOT, `LEVEL_${level}_LOCAL_CQ_AUDIT.json`);
  const audit = AUDIT_SCHEMA.parse(
    JSON.parse(await readFile(auditPath)) as unknown,
  );
  if (audit.level !== level) {
    throw new Error(
      `${relative(auditPath)} declares level ${audit.level}, expected ${level}`,
    );
  }
  if (audit.source_revision !== sourceRevision) {
    throw new Error(
      `${relative(auditPath)} uses source_revision=${audit.source_revision}; current upstream.json pins ${sourceRevision}`,
    );
  }

  const questionFiles = await glob(path.join(EN_ROOT, `level-${level}-*.mdx`));
  const expectedIds = new Set(
    questionFiles.map((filePath) => path.basename(filePath, ".mdx")),
  );
  const recordsById = new Map<string, (typeof audit.records)[number]>();
  for (const record of audit.records) {
    if (recordsById.has(record.id)) {
      throw new Error(`${relative(auditPath)} contains duplicate id: ${record.id}`);
    }
    recordsById.set(record.id, record);
  }

  const missing = expectedIds
    .values()
    .filter((id) => !recordsById.has(id))
    .toArray();
  const extra = recordsById
    .keys()
    .filter((id) => !expectedIds.has(id))
    .toArray();
  if (missing.length > 0 || extra.length > 0) {
    const missingText = missing.length === 0 ? "none" : missing.join(", ");
    const extraText = extra.length === 0 ? "none" : extra.join(", ");
    throw new Error(
      `${relative(auditPath)} does not match published Level ${level} CQ ids. Missing: ${missingText}; extra: ${extraText}.`,
    );
  }
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
): void {
  const enforced = new Set(section.enforced);
  const deferred = new Set(section.deferred);
  if (enforced.size !== section.enforced.length || deferred.size !== section.deferred.length) {
    throw new Error(`${name} scope contains duplicate level entries.`);
  }
  const overlap = [...enforced].filter((level) => deferred.has(level));
  if (overlap.length > 0) {
    throw new Error(`${name} scope has levels both enforced and deferred: ${overlap.join(", ")}`);
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

function relative(filePath: string) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
