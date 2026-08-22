import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import { z } from "zod";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const CONFIG_PATH = path.join(
  REPO_ROOT,
  "localization/LOCAL_CQ_AUDIT_LEVELS.json",
);
const AUDIT_ROOT = path.join(REPO_ROOT, "localization/audits");

const LEVEL_CONFIG_SCHEMA = z.array(z.int().positive()).min(1).readonly();
const STATUS_SCHEMA = z.string().min(1);
const RECORD_SCHEMA = z
  .object({
    id: z.string().min(1),
    risk: z.enum(["low", "medium", "high"]),
    source_rule: z.string().min(1),
    learning_objective: z.string().min(1),
    question_type: z.enum(["best_move", "legality", "interpretation", "deduction"]),
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
    source_revision: z.string().min(7),
    records: z.array(RECORD_SCHEMA).min(1),
  })
  .strict();

const configuredLevels = LEVEL_CONFIG_SCHEMA.parse(
  JSON.parse(await readFile(CONFIG_PATH)) as unknown,
);

await Promise.all(configuredLevels.map(async (level) => validateLevel(level)));

console.log(
  `Local CQ audit evidence passed for levels: ${configuredLevels.join(", ")}.`,
);

async function validateLevel(level: number) {
  const auditPath = path.join(AUDIT_ROOT, `LEVEL_${level}_LOCAL_CQ_AUDIT.json`);
  const audit = AUDIT_SCHEMA.parse(
    JSON.parse(await readFile(auditPath)) as unknown,
  );
  if (audit.level !== level) {
    throw new Error(`${relative(auditPath)} declares level ${audit.level}, expected ${level}`);
  }

  const questionFiles = await glob(path.join(EN_ROOT, `level-${level}-*.mdx`));
  const expectedIds = new Set(
    questionFiles.map((filePath) => path.basename(filePath, ".mdx")),
  );
  const recordsById = new Map(audit.records.map((record) => [record.id, record] as const));

  const missing = expectedIds.values().filter((id) => !recordsById.has(id)).toArray();
  const extra = recordsById.keys().filter((id) => !expectedIds.has(id)).toArray();
  if (missing.length > 0 || extra.length > 0) {
    const missingText = missing.length === 0 ? "none" : missing.join(", ");
    const extraText = extra.length === 0 ? "none" : extra.join(", ");
    throw new Error(
      `${relative(auditPath)} does not match published Level ${level} CQ ids. Missing: ${missingText}; extra: ${extraText}.`,
    );
  }

  for (const record of audit.records) {
    for (const [field, value] of [
      ["leakage", record.leakage],
      ["timeline", record.timeline],
      ["physical_state", record.physical_state],
    ] as const) {
      if (/fail|pending|not run/iu.test(value)) {
        throw new Error(
          `${relative(auditPath)}: ${record.id} cannot KEEP with ${field}=${value}`,
        );
      }
    }
  }
}

function relative(filePath: string) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
