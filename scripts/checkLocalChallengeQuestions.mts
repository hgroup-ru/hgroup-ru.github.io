import { readFile } from "complete-node";
import { glob } from "glob";
import { existsSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const EN_ROOT = path.join(REPO_ROOT, "docs/challenge-questions");
const RU_ROOT = path.join(
  REPO_ROOT,
  "i18n/ru/docusaurus-plugin-content-docs/current/challenge-questions",
);

const QUESTION_FILE_PATTERN = /^level-(?<level>\d+)-.+\.mdx$/v;
const PROGRESS_PATTERN = /<ChallengeQuestionProgress\s[\s\S]*?\/>/v;
const YAML_IMPORT_PATTERN = /import\s+\w+\s+from\s+"(?<yamlPath>[^"]+\.yml)"/gv;
const SIDEBAR_DOCUMENT_PATTERN =
  /"(?<doubleId>challenge-questions\/[^"]+)"|'(?<singleId>challenge-questions\/[^']+)'/gv;

const enFiles = await challengeQuestionFiles(EN_ROOT);
const ruFiles = await challengeQuestionFiles(RU_ROOT);

const enNames = new Set(enFiles.map((filePath) => path.basename(filePath)));
const ruNames = new Set(ruFiles.map((filePath) => path.basename(filePath)));

assertSameSet(enNames, ruNames, "EN", "RU");

const sidebarIds = new Set(await collectSidebarDocumentIds());

await Promise.all(
  enFiles.map(async (enFilePath) => {
    const fileName = path.basename(enFilePath);
    const match = QUESTION_FILE_PATTERN.exec(fileName);
    if (match === null) {
      return;
    }

    const levelText = match.groups?.["level"];
    if (levelText === undefined) {
      throw new Error(`Failed to parse CQ level from: ${fileName}`);
    }

    const id = path.basename(fileName, ".mdx");
    const level = Number(levelText);
    const ruFilePath = path.join(RU_ROOT, fileName);

    await Promise.all([
      validateQuestionPage(enFilePath, id, level, "EN"),
      validateQuestionPage(ruFilePath, id, level, "RU"),
    ]);

    const documentId = `challenge-questions/${id}`;
    if (!sidebarIds.has(documentId)) {
      throw new Error(
        `Challenge Question is missing from the effective sidebar sources: ${documentId}`,
      );
    }
  }),
);

async function challengeQuestionFiles(
  root: string,
): Promise<readonly string[]> {
  const filePaths = await glob(path.join(root, "level-*.mdx"));
  return filePaths
    .filter((filePath) => QUESTION_FILE_PATTERN.test(path.basename(filePath)))
    .toSorted();
}

async function validateQuestionPage(
  filePath: string,
  id: string,
  level: number,
  locale: "EN" | "RU",
) {
  const contents = await readFile(filePath);
  const progressTag = PROGRESS_PATTERN.exec(contents)?.[0];
  if (
    progressTag === undefined
    || !progressTag.includes(`level={${level}}`)
    || !progressTag.includes(`id="${id}"`)
  ) {
    throw new Error(
      `${locale} CQ has missing or mismatched ChallengeQuestionProgress: ${relative(filePath)}`,
    );
  }

  assertExactlyOneTab(contents, "question", locale, filePath);
  assertExactlyOneTab(contents, "solution", locale, filePath);

  for (const yamlPath of yamlImports(contents)) {
    const resolved = resolveImport(filePath, yamlPath);
    if (!existsSync(resolved)) {
      throw new Error(
        `${locale} CQ imports a missing YAML file: ${relative(filePath)} -> ${yamlPath}`,
      );
    }
  }
}

function assertExactlyOneTab(
  contents: string,
  value: "question" | "solution",
  locale: "EN" | "RU",
  filePath: string,
) {
  const token = `<TabItem value="${value}">`;
  const count = contents.split(token).length - 1;
  if (count !== 1) {
    throw new Error(
      `${locale} CQ must contain exactly one ${value} tab; found ${count}: ${relative(filePath)}`,
    );
  }
}

function yamlImports(contents: string): readonly string[] {
  return contents
    .matchAll(YAML_IMPORT_PATTERN)
    .map((match) => {
      const yamlPath = match.groups?.["yamlPath"];
      if (yamlPath === undefined) {
        throw new Error("Failed to parse YAML import path.");
      }
      return yamlPath;
    })
    .toArray();
}

function resolveImport(importingFile: string, importPath: string) {
  if (importPath.startsWith("@site/")) {
    return path.join(REPO_ROOT, importPath.slice("@site/".length));
  }
  return path.resolve(path.dirname(importingFile), importPath);
}

async function collectSidebarDocumentIds(): Promise<readonly string[]> {
  const [baseSidebarContents, wrapperSidebarContents] = await Promise.all([
    readFile(path.join(REPO_ROOT, "sidebars-base.ts")),
    readFile(path.join(REPO_ROOT, "sidebars.ts")),
  ]);
  const sidebarContents = [baseSidebarContents, wrapperSidebarContents];

  return sidebarContents.flatMap((contents) =>
    contents
      .matchAll(SIDEBAR_DOCUMENT_PATTERN)
      .map((match) => {
        const id = match.groups?.["doubleId"] ?? match.groups?.["singleId"];
        if (id === undefined) {
          throw new Error("Failed to parse Challenge Question sidebar id.");
        }
        return id;
      })
      .toArray(),
  );
}

function assertSameSet(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>,
  leftName: string,
  rightName: string,
) {
  const onlyLeft = [...left].filter((value) => !right.has(value));
  const onlyRight = [...right].filter((value) => !left.has(value));
  if (onlyLeft.length === 0 && onlyRight.length === 0) {
    return;
  }

  const leftValues = onlyLeft.length === 0 ? "none" : onlyLeft.join(", ");
  const rightValues = onlyRight.length === 0 ? "none" : onlyRight.join(", ");
  throw new Error(
    `Challenge Question locale mismatch. ${leftName}-only: ${leftValues}; ${rightName}-only: ${rightValues}`,
  );
}

function relative(filePath: string) {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
