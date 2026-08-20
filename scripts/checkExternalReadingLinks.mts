import { readFile } from "complete-node";
import { glob } from "glob";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const RU_ROOT = path.join(
  REPO_ROOT,
  "i18n/ru/docusaurus-plugin-content-docs/current",
);
const REGISTRY_PATH = path.join(
  REPO_ROOT,
  "localization/external-reading-links.json",
);

interface RegistryEntry {
  readonly source: string;
  readonly url: string;
  readonly classification: string;
  readonly decision: string;
  readonly note: string;
}

interface LinkOccurrence {
  readonly source: string;
  readonly url: string;
  readonly line: number;
}

const registry = JSON.parse(
  await readFile(REGISTRY_PATH),
) as readonly RegistryEntry[];
const files = await glob(path.join(RU_ROOT, "**/*.mdx"));
const occurrenceGroups = await Promise.all(
  files.map(async (filePath) => collectDocumentLinks(filePath)),
);
const occurrences = occurrenceGroups.flat();

const actualKeys = new Set(occurrences.map(linkKey));
const registryKeys = new Set(registry.map(linkKey));
const missing = occurrences.filter((entry) => !registryKeys.has(linkKey(entry)));
const stale = registry.filter((entry) => !actualKeys.has(linkKey(entry)));

if (missing.length > 0 || stale.length > 0) {
  const missingText =
    missing.length === 0
      ? "none"
      : missing
          .map((entry) => `${entry.source}:${entry.line} -> ${entry.url}`)
          .join("\n");
  const staleText =
    stale.length === 0
      ? "none"
      : stale.map((entry) => `${entry.source} -> ${entry.url}`).join("\n");
  throw new Error(
    `External reading-link registry is out of date.\n\nMissing:\n${missingText}\n\nStale:\n${staleText}`,
  );
}

const sourcePages = new Set(occurrences.map((entry) => entry.source));
console.log(
  `External reading-link registry is current: ${occurrences.length} document-like links across ${sourcePages.size} RU pages.`,
);

async function collectDocumentLinks(
  filePath: string,
): Promise<readonly LinkOccurrence[]> {
  const contents = await readFile(filePath);
  const source = relative(filePath);
  const urlPattern = /https?:\/\/\S+/gv;

  return contents
    .matchAll(urlPattern)
    .map((match) => {
      const rawUrl = match[0];
      const url = trimUrl(rawUrl);
      if (!isDocumentLike(url)) {
        return undefined;
      }
      return {
        source,
        url,
        line: lineNumber(contents, match.index),
      };
    })
    .filter((entry): entry is LinkOccurrence => entry !== undefined)
    .toArray()
    .toSorted((left, right) =>
      left.source === right.source
        ? left.line - right.line
        : left.source.localeCompare(right.source),
    );
}

function trimUrl(rawUrl: string): string {
  let url = rawUrl;
  const trailingCharacters = [")", ">", ",", ";"] as const;
  while (trailingCharacters.some((character) => url.endsWith(character))) {
    url = url.slice(0, -1);
  }
  return url;
}

function isDocumentLike(rawUrl: string): boolean {
  const url = new URL(rawUrl);
  const pathname = url.pathname.toLowerCase();
  const documentExtensionPattern = /\.(?:md|mdx|pdf)$/v;
  if (documentExtensionPattern.test(pathname)) {
    return true;
  }
  if (url.hostname === "raw.githubusercontent.com") {
    return true;
  }
  if (
    url.hostname === "github.com"
    && (pathname.includes("/blob/") || pathname.includes("/raw/"))
  ) {
    return true;
  }
  return (
    url.hostname === "docs.google.com"
    || url.hostname === "gist.github.com"
  );
}

function linkKey(entry: Pick<RegistryEntry, "source" | "url">): string {
  return `${entry.source}\n${entry.url}`;
}

function lineNumber(contents: string, index: number): number {
  return contents.slice(0, index).split("\n").length;
}

function relative(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}
