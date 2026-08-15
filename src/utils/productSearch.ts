import type { ProductSearchEntry } from "../generated/productData";

const DASHES_PATTERN = /[\u{2010}-\u{2015}]/gv;
const NON_WORD_PATTERN = /[^\p{L}\p{N}]+/gv;
const WHITESPACE_PATTERN = /\s+/gv;

export type SearchTextFold = (value: string) => string;

const IDENTITY_SEARCH_TEXT_FOLD: SearchTextFold = (value) => value;

export function normalizeSearchText(
  value: string,
  foldText: SearchTextFold = IDENTITY_SEARCH_TEXT_FOLD,
): string {
  return foldText(value.toLowerCase())
    .replaceAll(DASHES_PATTERN, "-")
    .replaceAll(NON_WORD_PATTERN, " ")
    .trim()
    .replaceAll(WHITESPACE_PATTERN, " ");
}

function scoreEntry(
  entry: ProductSearchEntry,
  normalizedQuery: string,
  foldText: SearchTextFold,
): number {
  const title = normalizeSearchText(entry.sectionTitle, foldText);

  if (title === normalizedQuery) {
    return 1000;
  }

  const aliases = entry.aliases.map((alias) =>
    normalizeSearchText(alias, foldText),
  );
  if (aliases.includes(normalizedQuery)) {
    return 950;
  }
  if (title.startsWith(normalizedQuery)) {
    const extraWords = Math.max(0, title.split(" ").length - 3);
    return 850 - extraWords * 50;
  }
  if (aliases.some((alias) => alias.startsWith(normalizedQuery))) {
    return 820;
  }
  if (title.includes(normalizedQuery)) {
    return 700;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const searchable = [title, ...aliases].join(" ");
  if (
    queryTokens.length > 1
    && queryTokens.every((token) => searchable.includes(token))
  ) {
    return 500;
  }

  if (
    queryTokens.some((token) => token.length >= 3 && searchable.includes(token))
  ) {
    return 300;
  }

  return -1;
}

export function searchEntries(
  entries: readonly ProductSearchEntry[],
  query: string,
  limit = 50,
  foldText: SearchTextFold = IDENTITY_SEARCH_TEXT_FOLD,
): readonly ProductSearchEntry[] {
  if (query.trim() === "") {
    return [];
  }

  const normalizedQuery = normalizeSearchText(query, foldText);
  return entries
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery, foldText),
    }))
    .filter(({ score }) => score >= 0)
    .toSorted((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      if (a.entry.kind !== b.entry.kind) {
        return a.entry.kind === "section" ? -1 : 1;
      }
      const levelA = a.entry.level ?? Infinity;
      const levelB = b.entry.level ?? Infinity;
      if (levelA !== levelB) {
        return levelA - levelB;
      }
      return a.entry.sectionTitle.localeCompare(
        b.entry.sectionTitle,
        undefined,
        {
          sensitivity: "base",
        },
      );
    })
    .slice(0, limit)
    .map(({ entry }) => entry);
}
