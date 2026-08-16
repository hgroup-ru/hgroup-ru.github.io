import fs from "node:fs/promises";
import path from "node:path";

interface ReferenceClass {
  readonly areaLabel: string;
  readonly level?: number;
}

interface ProductSearchEntry {
  readonly id: string;
  readonly scope: "reference" | "variant";
  readonly kind: "page" | "section";
  readonly pageId: string;
  readonly pageTitle: string;
  readonly sectionTitle: string;
  readonly href: string;
  readonly areaLabel: string;
  readonly level?: number;
  readonly aliases: readonly string[];
  readonly redirectHref?: string;
}

interface VariantBrowseEntry {
  readonly title: string;
  readonly href: string;
}

interface HeadingEntry {
  readonly title: string;
  readonly anchor: string;
  readonly redirectHref?: string;
}

interface FeaturedEntry {
  readonly label: string;
  readonly href: string;
}

interface LevelBrowseEntry {
  readonly level: number;
  readonly title: string;
  readonly href: string;
  readonly featured: readonly FeaturedEntry[];
}

interface MarkdownLink {
  readonly label: string;
  readonly target: string;
  readonly start: number;
  readonly end: number;
}

const packageRoot = path.resolve(import.meta.dirname, "..");
const configuredDocsRoot = process.env["HGROUP_PRODUCT_DOCS_ROOT"];
const docsRoot =
  configuredDocsRoot === undefined
    ? path.join(
        packageRoot,
        "i18n",
        "ru",
        "docusaurus-plugin-content-docs",
        "current",
      )
    : path.resolve(packageRoot, configuredDocsRoot);
const productLocale = process.env["HGROUP_PRODUCT_LOCALE"];
const generatedDir = path.join(packageRoot, "src", "generated");
const outputPath = path.join(generatedDir, "productData.ts");

const explicitAliases = new Map<string, readonly string[]>([
  ["level-1#good-touch-principle", ["GTP"]],
  ["level-1#minimum-clue-value-principle", ["MCVP"]],
]);

const RU_VARIANT_PREFIX =
  "\u{0412}\u{0430}\u{0440}\u{0438}\u{0430}\u{043D}\u{0442} ";
const ALPHANUMERIC_PATTERN = /[\p{L}\p{N}]/v;
const WHITESPACE_PATTERN = /\s/v;

function parseMarkdownLinks(value: string): readonly MarkdownLink[] {
  const links: MarkdownLink[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const start = value.indexOf("[", cursor);
    if (start === -1) {
      break;
    }

    const labelEnd = value.indexOf("](", start + 1);
    if (labelEnd === -1) {
      break;
    }

    const targetEnd = value.indexOf(")", labelEnd + 2);
    if (targetEnd === -1) {
      break;
    }

    links.push({
      label: value.slice(start + 1, labelEnd),
      target: value.slice(labelEnd + 2, targetEnd),
      start,
      end: targetEnd + 1,
    });
    cursor = targetEnd + 1;
  }

  return links;
}

function stripMarkdownLinks(value: string): string {
  const links = parseMarkdownLinks(value);
  if (links.length === 0) {
    return value;
  }

  let result = "";
  let cursor = 0;
  for (const link of links) {
    result += value.slice(cursor, link.start);
    result += link.label;
    cursor = link.end;
  }
  return result + value.slice(cursor);
}

function stripHtmlTags(value: string): string {
  let result = "";
  let cursor = 0;

  while (cursor < value.length) {
    const tagStart = value.indexOf("<", cursor);
    if (tagStart === -1) {
      result += value.slice(cursor);
      break;
    }

    result += value.slice(cursor, tagStart);
    const tagEnd = value.indexOf(">", tagStart + 1);
    if (tagEnd === -1) {
      result += value.slice(tagStart);
      break;
    }
    cursor = tagEnd + 1;
  }

  return result;
}

function stripInlineMarkdown(value: string): string {
  return stripHtmlTags(stripMarkdownLinks(value))
    .replaceAll(/[*_`~]/gv, "")
    .split(/\s+/v)
    .filter((part) => part !== "")
    .join(" ")
    .trim();
}

function parseFrontmatterTitle(source: string, fallback: string): string {
  const lines = source.split("\n");
  if (lines[0]?.trim() !== "---") {
    return fallback;
  }

  for (const line of lines.slice(1)) {
    const trimmed = line.trim();
    if (trimmed === "---") {
      break;
    }
    if (!trimmed.startsWith("title:")) {
      continue;
    }

    let title = trimmed.slice("title:".length).trim();
    const first = title.at(0);
    const last = title.at(-1);
    if (
      title.length >= 2
      && (first === '"' || first === "'")
      && last === first
    ) {
      title = title.slice(1, -1).trim();
    }
    return title === "" ? fallback : title;
  }

  return fallback;
}

function baseSlug(value: string): string {
  const normalized =
    stripInlineMarkdown(value).toLocaleLowerCase(productLocale);
  let result = "";

  for (const character of normalized) {
    if (
      ALPHANUMERIC_PATTERN.test(character)
      || character === "_"
      || character === "-"
      || WHITESPACE_PATTERN.test(character)
    ) {
      result += character;
    }
  }

  return result
    .trim()
    .split(/\s+/v)
    .filter((part) => part !== "")
    .join("-");
}

function isAsciiUppercaseOrDigit(character: string): boolean {
  return (
    (character >= "A" && character <= "Z")
    || (character >= "0" && character <= "9")
  );
}

function isAliasCandidate(candidate: string): boolean {
  if (candidate.length < 2 || candidate.length > 12) {
    return false;
  }
  const first = candidate.at(0);
  if (first === undefined || !isAsciiUppercaseOrDigit(first)) {
    return false;
  }

  for (const character of candidate.slice(1)) {
    if (
      !isAsciiUppercaseOrDigit(character)
      && character !== "'"
      && character !== "-"
    ) {
      return false;
    }
  }

  return true;
}

function extractAliases(value: string): readonly string[] {
  const aliases: string[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const open = value.indexOf("(", cursor);
    if (open === -1) {
      break;
    }
    const close = value.indexOf(")", open + 1);
    if (close === -1) {
      break;
    }

    const candidate = value.slice(open + 1, close).trim();
    if (isAliasCandidate(candidate)) {
      aliases.push(candidate);
    }
    cursor = close + 1;
  }

  return aliases;
}

function routeFromMdxHref(value: string): string {
  const withoutPrefix = value.startsWith("./") ? value.slice(2) : value;
  const hashIndex = withoutPrefix.indexOf("#");
  const route =
    hashIndex === -1 ? withoutPrefix : withoutPrefix.slice(0, hashIndex);
  const fragment = hashIndex === -1 ? "" : withoutPrefix.slice(hashIndex);
  const normalizedRoute = route.endsWith(".mdx") ? route.slice(0, -4) : route;
  return normalizedRoute + fragment;
}

function routeFromRelativeFile(relativePath: string): string {
  return relativePath.endsWith(".mdx")
    ? relativePath.slice(0, -4)
    : relativePath;
}

function parseLevelFileName(relativePath: string): number | undefined {
  if (!relativePath.startsWith("level-") || !relativePath.endsWith(".mdx")) {
    return undefined;
  }

  const value = relativePath.slice("level-".length, -".mdx".length);
  if (value === "") {
    return undefined;
  }
  for (const character of value) {
    if (character < "0" || character > "9") {
      return undefined;
    }
  }

  return Number(value);
}

function classifyReference(relativePath: string): ReferenceClass | undefined {
  const level = parseLevelFileName(relativePath);
  if (level !== undefined && level >= 1 && level <= 25) {
    return { areaLabel: `Level ${level}`, level };
  }

  if (relativePath === "beginner.mdx") {
    return { areaLabel: "Beginner" };
  }

  if (
    relativePath.startsWith("beginner/")
    && !relativePath.includes("-question-")
  ) {
    return { areaLabel: "Beginner" };
  }

  if (relativePath === "extras.mdx" || relativePath.startsWith("extras/")) {
    return { areaLabel: "Extras" };
  }

  return undefined;
}

function isVariant(relativePath: string): boolean {
  return (
    relativePath === "variant-specific.mdx"
    || relativePath.startsWith("variant-specific/")
  );
}

function cleanVariantTitle(title: string): string {
  const lowerTitle = title.toLocaleLowerCase(productLocale);
  const lowerRuPrefix = RU_VARIANT_PREFIX.toLocaleLowerCase(productLocale);
  if (lowerTitle.startsWith(lowerRuPrefix)) {
    return title.slice(RU_VARIANT_PREFIX.length).trim();
  }

  const englishPrefix = "variant:";
  if (lowerTitle.startsWith(englishPrefix)) {
    return title.slice(englishPrefix.length).trim();
  }

  return title.trim();
}

async function listMdxFiles(root: string): Promise<readonly string[]> {
  const results: string[] = [];

  async function walk(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        // eslint-disable-next-line no-await-in-loop
        await walk(absolutePath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        results.push(absolutePath);
      }
    }
  }

  await walk(root);
  return results.toSorted();
}

function parseHeadingLine(
  line: string,
): { readonly title: string; readonly anchor?: string } | undefined {
  let titleStart: number;
  if (line.startsWith("### ")) {
    titleStart = 4;
  } else if (line.startsWith("## ")) {
    titleStart = 3;
  } else {
    return undefined;
  }

  let title = line.slice(titleStart).trim();
  const anchorMarker = "{/* #";
  const anchorStart = title.lastIndexOf(anchorMarker);
  if (anchorStart === -1 || !title.endsWith("*/}")) {
    return { title };
  }

  const anchor = title
    .slice(anchorStart + anchorMarker.length, -"*/}".length)
    .trim();
  title = title.slice(0, anchorStart).trim();
  return anchor === "" ? { title } : { title, anchor };
}

function redirectOnlyTarget(lines: readonly string[]): string | undefined {
  const contentLines = lines.map((line) => line.trim()).filter(Boolean);
  if (contentLines.length !== 1) {
    return undefined;
  }

  const [line] = contentLines;
  if (line === undefined || !line.startsWith("- ")) {
    return undefined;
  }

  const links = parseMarkdownLinks(line);
  if (links.length !== 1) {
    return undefined;
  }

  const [link] = links;
  if (link === undefined) {
    return undefined;
  }

  const target = link.target.startsWith("/")
    ? link.target.slice(1)
    : routeFromMdxHref(link.target);
  return target.startsWith("level-") ? target : undefined;
}

function parseHeadings(source: string): readonly HeadingEntry[] {
  const results: HeadingEntry[] = [];
  const slugCounts = new Map<string, number>();
  const lines = source.split("\n");

  for (const [lineIndex, line] of lines.entries()) {
    const heading = parseHeadingLine(line);
    if (heading === undefined) {
      continue;
    }

    const rawTitle = heading.title;
    const title = stripInlineMarkdown(rawTitle);
    if (title === "") {
      continue;
    }

    let { anchor } = heading;
    if (anchor === undefined) {
      const slug = baseSlug(rawTitle);
      const count = slugCounts.get(slug) ?? 0;
      slugCounts.set(slug, count + 1);
      anchor = count === 0 ? slug : `${slug}-${count}`;
    }

    let sectionEnd = lineIndex + 1;
    while (sectionEnd < lines.length) {
      const candidate = lines[sectionEnd];
      if (
        candidate !== undefined
        && parseHeadingLine(candidate) !== undefined
      ) {
        break;
      }
      sectionEnd++;
    }

    const redirectHref = redirectOnlyTarget(
      lines.slice(lineIndex + 1, sectionEnd),
    );
    results.push({
      title,
      anchor,
      ...(redirectHref !== undefined && { redirectHref }),
    });
  }

  return results;
}

async function buildSearchEntries(): Promise<{
  readonly reference: readonly ProductSearchEntry[];
  readonly variant: readonly ProductSearchEntry[];
  readonly variants: readonly VariantBrowseEntry[];
}> {
  const reference: ProductSearchEntry[] = [];
  const variant: ProductSearchEntry[] = [];
  const variants: VariantBrowseEntry[] = [];
  const mdxFiles = await listMdxFiles(docsRoot);

  for (const absolutePath of mdxFiles) {
    const relativePath = path
      .relative(docsRoot, absolutePath)
      .replaceAll("\\", "/");
    const referenceClass = classifyReference(relativePath);
    const variantDoc = isVariant(relativePath);
    if (referenceClass === undefined && !variantDoc) {
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const source = await fs.readFile(absolutePath, "utf8");
    const fallback = path.basename(relativePath, ".mdx");
    const pageTitle = parseFrontmatterTitle(source, fallback);
    const pageId = routeFromRelativeFile(relativePath);
    const pageHref = pageId;
    const scope = variantDoc ? "variant" : "reference";
    let areaLabel: string;
    if (variantDoc) {
      areaLabel =
        relativePath === "variant-specific.mdx"
          ? "Variant-Specific"
          : cleanVariantTitle(pageTitle);
    } else if (referenceClass === undefined) {
      throw new Error(`Missing Reference classification for ${relativePath}.`);
    } else {
      ({ areaLabel } = referenceClass);
    }
    const level = referenceClass?.level;
    const target = scope === "variant" ? variant : reference;

    target.push({
      id: `${scope}:${pageId}`,
      scope,
      kind: "page",
      pageId,
      pageTitle,
      sectionTitle: pageTitle,
      href: pageHref,
      areaLabel,
      ...(level !== undefined && { level }),
      aliases: extractAliases(pageTitle),
    });

    for (const heading of parseHeadings(source)) {
      const href = `${pageHref}#${heading.anchor}`;
      const aliases = [
        ...extractAliases(heading.title),
        ...(explicitAliases.get(href) ?? []),
      ];
      target.push({
        id: `${scope}:${href}`,
        scope,
        kind: "section",
        pageId,
        pageTitle,
        sectionTitle: heading.title,
        href,
        areaLabel,
        ...(level !== undefined && { level }),
        aliases: [...new Set(aliases)],
        ...(heading.redirectHref !== undefined && {
          redirectHref: heading.redirectHref,
        }),
      });
    }

    if (variantDoc && relativePath !== "variant-specific.mdx") {
      variants.push({ title: cleanVariantTitle(pageTitle), href: pageHref });
    }
  }

  return {
    reference,
    variant,
    variants: variants.toSorted((a, b) =>
      a.title.localeCompare(b.title, productLocale, { sensitivity: "base" }),
    ),
  };
}

function parseLearningPathRow(line: string): LevelBrowseEntry | undefined {
  if (!line.startsWith("|")) {
    return undefined;
  }

  const cells = line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
  if (cells.length < 3) {
    return undefined;
  }

  const levelLink = parseMarkdownLinks(cells[0] ?? "")[0];
  if (levelLink === undefined) {
    return undefined;
  }

  const withoutPrefix = levelLink.target.startsWith("./")
    ? levelLink.target.slice(2)
    : levelLink.target;
  const hashIndex = withoutPrefix.indexOf("#");
  const relativePath =
    hashIndex === -1 ? withoutPrefix : withoutPrefix.slice(0, hashIndex);
  const level = parseLevelFileName(relativePath);
  if (level === undefined || level < 1 || level > 25) {
    return undefined;
  }

  const titleCell = cells[1] ?? "";
  const featuredCell = cells[2] ?? "";
  const featured = parseMarkdownLinks(featuredCell).map((link) => ({
    label: stripInlineMarkdown(link.label),
    href: routeFromMdxHref(link.target),
  }));

  return {
    level,
    title: stripInlineMarkdown(titleCell),
    href: routeFromMdxHref(levelLink.target),
    featured,
  };
}

const LEVEL_TITLE_SEPARATORS = [" \u{2014} ", " \u{2013} "] as const;

function levelDisplayTitle(pageTitle: string): string {
  for (const separator of LEVEL_TITLE_SEPARATORS) {
    const separatorIndex = pageTitle.indexOf(separator);
    if (separatorIndex === -1) {
      continue;
    }

    const title = pageTitle.slice(separatorIndex + separator.length).trim();
    if (title !== "") {
      return title;
    }
  }

  return pageTitle.trim();
}

async function buildLevelBrowseEntries(): Promise<readonly LevelBrowseEntry[]> {
  const learningPath = await fs.readFile(
    path.join(docsRoot, "learning-path.mdx"),
    "utf8",
  );
  const results: LevelBrowseEntry[] = [];

  for (const line of learningPath.split("\n")) {
    const entry = parseLearningPathRow(line);
    if (entry !== undefined) {
      results.push(entry);
    }
  }

  if (results.length !== 25) {
    throw new Error(
      `Expected 25 Learning Path level rows, found ${results.length}.`,
    );
  }

  const canonicalResults: LevelBrowseEntry[] = [];
  for (const entry of results) {
    const relativePath = `level-${entry.level}.mdx`;
    // eslint-disable-next-line no-await-in-loop
    const source = await fs.readFile(path.join(docsRoot, relativePath), "utf8");
    const canonicalPageTitle = parseFrontmatterTitle(source, entry.title);
    canonicalResults.push({
      ...entry,
      title: levelDisplayTitle(canonicalPageTitle),
      href: routeFromRelativeFile(relativePath),
    });
  }

  return canonicalResults;
}

async function main() {
  const { reference, variant, variants } = await buildSearchEntries();
  const levels = await buildLevelBrowseEntries();

  await fs.mkdir(generatedDir, { recursive: true });
  const output = `// This file is generated by scripts/generateProductData.mts. Do not edit by hand.

export interface ProductSearchEntry {
  readonly id: string;
  readonly scope: "reference" | "variant";
  readonly kind: "page" | "section";
  readonly pageId: string;
  readonly pageTitle: string;
  readonly sectionTitle: string;
  readonly href: string;
  readonly areaLabel: string;
  readonly level?: number;
  readonly aliases: readonly string[];
  readonly redirectHref?: string;
}

export interface LevelBrowseEntry {
  readonly level: number;
  readonly title: string;
  readonly href: string;
  readonly featured: readonly {
    readonly label: string;
    readonly href: string;
  }[];
}

export interface VariantBrowseEntry {
  readonly title: string;
  readonly href: string;
}

// prettier-ignore
export const referenceSearchEntries: readonly ProductSearchEntry[] = ${JSON.stringify(reference, undefined, 2)};

// prettier-ignore
export const variantSearchEntries: readonly ProductSearchEntry[] = ${JSON.stringify(variant, undefined, 2)};

// prettier-ignore
export const levelBrowseEntries: readonly LevelBrowseEntry[] = ${JSON.stringify(levels, undefined, 2)};

// prettier-ignore
export const variantBrowseEntries: readonly VariantBrowseEntry[] = ${JSON.stringify(variants, undefined, 2)};
`;

  await fs.writeFile(outputPath, output, "utf8");
  process.stdout.write(
    [
      `Generated ${path.relative(packageRoot, outputPath)}`,
      `Reference search entries: ${reference.length}`,
      `Variant search entries: ${variant.length}`,
      `Learning Path levels: ${levels.length}`,
      `Variant browse pages: ${variants.length}`,
      "",
    ].join("\n"),
  );
}

await main();
