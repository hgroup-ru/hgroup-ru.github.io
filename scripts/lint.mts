import { assertDefined, isArray } from "complete-common";
import { $o, commandExists, lintCommands, readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";
import YAML from "yaml";

import sidebars from "../sidebars.js";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

const BAD_WORDS = [
  // This is a common mistake: https://github.com/hanabi/hanabi.github.io/pull/1367
  "Principal",
] as const;

const yamllintExists = await commandExists("yamllint");
if (!yamllintExists) {
  throw new Error(
    'Failed to find "yamllint". You can install it with: pip install --user yamllint',
  );
}

const RU_DOCS_ROOT = "i18n/ru/docusaurus-plugin-content-docs/current";

const RU_TERMINOLOGY_PATTERNS = [
  [
    "suit calque",
    /(?<!\p{L})\u{043C}\u{0430}\u{0441}\u{0442}(?:\u{044C}|\u{0438}|\u{044C}\u{044E}|\u{0435}\u{0439}|\u{044F}\u{043C}|\u{044F}\u{043C}\u{0438}|\u{044F}\u{0445})(?!\p{L})/iv,
  ],
  [
    "legal calque",
    /(?<!\p{L})(?:\u{043D}\u{0435})?\u{043B}\u{0435}\u{0433}\u{0430}\u{043B}\u{044C}\u{043D}\p{L}*(?!\p{L})/iv,
  ],
  [
    "Stall clue hybrid",
    /(?<!\p{L})stall-\u{043F}\u{043E}\u{0434}\u{0441}\u{043A}\u{0430}\u{0437}\p{L}*(?!\p{L})/iv,
  ],
] as const;

// Keep these patterns in sync with Docusaurus 3.10.1's DefaultNumberPrefixParser.
const IGNORED_NUMBER_PREFIX_PATTERN = /^\d+[\-._]\d+/v;
const NUMBER_PREFIX_PATTERN = /^\d+\s*[\-._]+\s*(?<suffix>[^\s\-._].*)$/v;

await lintCommands(import.meta.dirname, [
  // Use TypeScript to type-check the code.
  "tsc --noEmit",
  "tsc --noEmit --project ./scripts/tsconfig.json",

  // Use ESLint to lint the TypeScript code.
  "eslint",

  // Use Prettier to check formatting.
  // - "--log-level=warn" makes it only output errors.
  "prettier --log-level=warn --check .",

  // Use Knip to check for unused files, exports, and dependencies. (We do not currently use Knip
  // since there is no Docusaurus plugin and whitelisting everything does not get us much value.)
  /// $`knip --no-progress`,

  // Spell check published RU MDX with Russian and English dictionaries.
  // - "--no-progress" and "--no-summary" make it only output errors.
  "cspell --config ./cspell.ru.jsonc --locale ru,en --no-progress --no-summary i18n/ru/docusaurus-plugin-content-docs/current",
  // Check for template updates.
  "complete-cli check --ignore action.yml,build-check.yml,build.ts,ci.yml,knip.config.js,LICENSE,lint.ts,release.yml",

  // Lint YAML files.
  "yamllint .",

  // Lint Bash files.
  "bash scripts/shellcheck.sh",

  // eslint-disable-next-line unicorn/prefer-top-level-await
  ["check sidebar document ids", checkSidebarDocumentIds()],

  // eslint-disable-next-line unicorn/prefer-top-level-await
  ["check unused YAML files", checkUnusedYAMLFiles()],

  // eslint-disable-next-line unicorn/prefer-top-level-await
  ["check RU terminology", checkRUTerminology()],

  // eslint-disable-next-line unicorn/prefer-top-level-await
  ["check bad words", checkBadWords()],
]);

async function checkSidebarDocumentIds() {
  const documentIds = new Set<string>();
  const mdxFilePathFragments = await glob("./docs/**/*.mdx");
  for (const mdxFilePathFragment of mdxFilePathFragments) {
    const mdxFilePath = path.join(REPO_ROOT, mdxFilePathFragment);
    // eslint-disable-next-line no-await-in-loop
    const fileContents = await readFile(mdxFilePath);
    const frontMatter = parseDocFrontMatter(fileContents);
    const parseNumberPrefixes = frontMatter["parse_number_prefixes"] !== false;

    const relativePath = path
      .relative("./docs", mdxFilePathFragment)
      .split(path.sep)
      .join("/");
    const sourceFileNameWithoutExtension = path.posix.basename(
      relativePath,
      path.posix.extname(relativePath),
    );
    const sourceDirName = path.posix.dirname(relativePath);
    const unprefixedFileName = parseNumberPrefixes
      ? stripNumberPrefix(sourceFileNameWithoutExtension)
      : sourceFileNameWithoutExtension;
    const frontMatterId = frontMatter["id"];
    const baseId =
      typeof frontMatterId === "string" ? frontMatterId : unprefixedFileName;
    if (baseId.includes("/")) {
      throw new Error(`Document id cannot include slash: ${baseId}`);
    }

    let dirNameIdPrefix: string | undefined;
    if (sourceDirName !== ".") {
      dirNameIdPrefix = parseNumberPrefixes
        ? stripPathNumberPrefixes(sourceDirName)
        : sourceDirName;
    }

    const documentId = [dirNameIdPrefix, baseId].filter(Boolean).join("/");
    documentIds.add(documentId);
  }

  const sidebarDocumentIds = collectSidebarDocumentIds(sidebars);
  for (const documentId of sidebarDocumentIds) {
    if (!documentIds.has(documentId)) {
      throw new Error(
        `The sidebar references a missing document id: ${documentId}`,
      );
    }
  }
}

function parseDocFrontMatter(fileContents: string): Record<string, unknown> {
  const match = /^---\r?\n(?<frontMatter>[\s\S]*?)\r?\n---(?:\r?\n|$)/v.exec(
    fileContents,
  );
  const frontMatterText = match?.groups?.["frontMatter"];
  if (frontMatterText === undefined) {
    return {};
  }

  const frontMatter: unknown = YAML.parse(frontMatterText);
  if (
    typeof frontMatter !== "object"
    || frontMatter === null
    || isArray(frontMatter)
  ) {
    return {};
  }

  return frontMatter as Record<string, unknown>;
}

function stripNumberPrefix(value: string): string {
  if (IGNORED_NUMBER_PREFIX_PATTERN.test(value)) {
    return value;
  }

  const match = NUMBER_PREFIX_PATTERN.exec(value);
  return match?.groups?.["suffix"] ?? value;
}

function stripPathNumberPrefixes(value: string): string {
  return value
    .split("/")
    .map((segment) => stripNumberPrefix(segment))
    .join("/");
}

function collectSidebarDocumentIds(value: unknown): readonly string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (isArray(value)) {
    return value.flatMap((item) => collectSidebarDocumentIds(item));
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const record = value as Record<string, unknown>;
  const documentIds: string[] = [];
  if (record["type"] === "doc" && typeof record["id"] === "string") {
    documentIds.push(record["id"]);
  }

  for (const child of Object.values(record)) {
    if (isArray(child)) {
      documentIds.push(...collectSidebarDocumentIds(child));
    }
  }

  return documentIds;
}

async function checkUnusedYAMLFiles() {
  await checkYAMLFilesInDocsRoot("docs");
  await checkYAMLFilesInDocsRoot(RU_DOCS_ROOT);
}

async function checkYAMLFilesInDocsRoot(docsRoot: string) {
  const importRegex = /import .+ from "(?<yamlPath>[^"]+\.yml)"/v;

  // Go through every ".mdx" file and compile a set of used YAML files.
  const mdxFilePathFragments = await glob(`./${docsRoot}/**/*.mdx`);
  const usedYAMLFilePaths = new Set<string>();
  for (const mdxFilePathFragment of mdxFilePathFragments) {
    const mdxFilePath = path.join(REPO_ROOT, mdxFilePathFragment);
    const mdxDir = path.dirname(mdxFilePath);
    // eslint-disable-next-line no-await-in-loop
    const fileContents = await readFile(mdxFilePath);
    const lines = fileContents.split("\n");

    for (const line of lines) {
      // The "example-images.mdx" file imports some YAML files twice using `raw-loader`.
      if (line.includes("!raw-loader!")) {
        continue;
      }

      const match = importRegex.exec(line);
      if (match === null) {
        continue;
      }

      const yamlImportPath = match.groups?.["yamlPath"];
      assertDefined(
        yamlImportPath,
        `Failed to parse the YAML file path from file: ${mdxFilePath}`,
      );

      // Resolve the import path relative to the importing file.
      const absoluteYamlPath = path.resolve(mdxDir, yamlImportPath);
      // Normalize to a path relative to the docs root being checked.
      const relativeYamlPath = path.relative(
        path.join(REPO_ROOT, docsRoot),
        absoluteYamlPath,
      );

      if (usedYAMLFilePaths.has(relativeYamlPath)) {
        throw new Error(
          `The following YAML file is being used two or more times in ${docsRoot}: ${relativeYamlPath}`,
        );
      }

      usedYAMLFilePaths.add(relativeYamlPath);
    }
  }

  // Go through every ".yml" file.
  const yamlFilePathFragments = await glob(`./${docsRoot}/**/*.yml`);
  const yamlFilePaths = new Set<string>();
  for (const yamlFilePathFragment of yamlFilePathFragments) {
    // Normalize the path relative to the docs root being checked.
    const relativeYamlPath = path.relative(
      `./${docsRoot}`,
      yamlFilePathFragment,
    );

    yamlFilePaths.add(relativeYamlPath);

    if (!usedYAMLFilePaths.has(relativeYamlPath)) {
      throw new Error(
        `The following YAML file is not being used in ${docsRoot}: ${relativeYamlPath}`,
      );
    }
  }
}

async function checkRUTerminology() {
  const mdxFilePathFragments = await glob(`./${RU_DOCS_ROOT}/**/*.mdx`);
  await Promise.all(
    mdxFilePathFragments.map(async (mdxFilePathFragment) => {
      const mdxFilePath = path.join(REPO_ROOT, mdxFilePathFragment);
      const fileContents = await readFile(mdxFilePath);
      for (const [label, pattern] of RU_TERMINOLOGY_PATTERNS) {
        const match = pattern.exec(fileContents);
        if (match !== null) {
          throw new Error(
            `The following RU MDX file contains forbidden terminology "${match[0]}" (${label}): ${mdxFilePathFragment}`,
          );
        }
      }
    }),
  );
}

async function checkBadWords() {
  const output = await $o`git ls-files`;
  const filePaths = output.trim().split("\n");
  await Promise.all(
    filePaths.map(async (filePath) => {
      if (filePath === "scripts/lint.mts") {
        return;
      }

      const fileContents = await readFile(filePath);
      for (const word of BAD_WORDS) {
        if (fileContents.includes(word)) {
          throw new Error(
            `The following file contains the bad word "${word}": ${filePath}`,
          );
        }
      }
    }),
  );
}
