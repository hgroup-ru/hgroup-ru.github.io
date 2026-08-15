import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import type { ProductSearchEntry } from "../../generated/productData";
import {
  referenceSearchEntries,
  variantSearchEntries,
} from "../../generated/productData";
import { useUrlQueryState } from "../../hooks/useUrlQueryState";
import { normalizeSearchText, searchEntries } from "../../utils/productSearch";
import { foldRussianSearchText } from "../../utils/russianSearch";
import styles from "./styles.module.css";

const MAX_VISIBLE_RESULTS = 30;
const SEARCH_ARIA =
  "\u{41F}\u{43E}\u{438}\u{441}\u{43A} \u{43F}\u{43E} \u{441}\u{43F}\u{440}\u{430}\u{432}\u{43E}\u{447}\u{43D}\u{438}\u{43A}\u{443}";
const INPUT_ARIA =
  "\u{41D}\u{430}\u{439}\u{442}\u{438} \u{43A}\u{43E}\u{43D}\u{432}\u{435}\u{43D}\u{446}\u{438}\u{44E} \u{438}\u{43B}\u{438} \u{441}\u{43E}\u{43A}\u{440}\u{430}\u{449}\u{435}\u{43D}\u{438}\u{435}";
const INPUT_PLACEHOLDER =
  "\u{41D}\u{430}\u{439}\u{442}\u{438} \u{43A}\u{43E}\u{43D}\u{432}\u{435}\u{43D}\u{446}\u{438}\u{44E} \u{438}\u{43B}\u{438} \u{441}\u{43E}\u{43A}\u{440}\u{430}\u{449}\u{435}\u{43D}\u{438}\u{435}: TCM, finesse, stall...";
const DIGITS = "0123456789";
const BROWSE_EXCLUDED_FRAGMENTS: ReadonlySet<string> = new Set([
  "challenge-questions",
  "common-mistakes",
  "conventions",
  "general-principles",
  "other-priority-related-conventions",
  "special-moves",
  "website-features",
]);
const BROWSE_EXCLUDED_FRAGMENT_PARTS = [
  "-question-",
  "-training",
  "flowchart",
  "illegal",
  "interaction-between",
  "mistake",
  "other-examples",
] as const;

interface ReferenceGroup {
  readonly key: string;
  readonly primary: ProductSearchEntry;
  readonly entries: readonly ProductSearchEntry[];
}

interface AlphabetGroup {
  readonly letter: string;
  readonly entries: readonly ReferenceGroup[];
}

interface ReferenceLocation {
  readonly href: string;
  readonly label: string;
}

function redirectedLevel(entry: ProductSearchEntry): number | undefined {
  const href = entry.redirectHref;
  if (href === undefined || !href.startsWith("level-")) {
    return undefined;
  }

  const routeEnd = href.indexOf("#");
  const route = routeEnd === -1 ? href : href.slice(0, routeEnd);
  const levelText = route.slice("level-".length);
  if (levelText === "") {
    return undefined;
  }
  for (const character of levelText) {
    if (character < "0" || character > "9") {
      return undefined;
    }
  }

  return Number(levelText);
}

function entryLocation(entry: ProductSearchEntry): ReferenceLocation {
  const redirectLevel = redirectedLevel(entry);
  if (redirectLevel !== undefined && entry.redirectHref !== undefined) {
    return { href: entry.redirectHref, label: `L${redirectLevel}` };
  }

  return {
    href: entry.href,
    label: entry.level === undefined ? entry.areaLabel : `L${entry.level}`,
  };
}

function entryPriority(entry: ProductSearchEntry): number {
  if (entry.areaLabel === "Beginner") {
    return 0;
  }
  if (entry.level !== undefined) {
    return entry.level;
  }
  if (entry.areaLabel === "Extras") {
    return 100;
  }
  return 200;
}

function canonicalKey(entry: ProductSearchEntry): string {
  let key = normalizeSearchText(entry.sectionTitle, foldRussianSearchText);
  const aliases = entry.aliases
    .map((alias) => normalizeSearchText(alias, foldRussianSearchText))
    .filter(Boolean);

  for (const alias of aliases) {
    const suffix = ` ${alias}`;
    if (key.endsWith(suffix)) {
      key = key.slice(0, -suffix.length).trim();
    }
  }

  return key.startsWith("the ") ? key.slice(4) : key;
}

function groupReferenceEntries(
  entries: readonly ProductSearchEntry[],
): readonly ReferenceGroup[] {
  const grouped = new Map<string, ProductSearchEntry[]>();

  for (const entry of entries) {
    const key = canonicalKey(entry);
    const current = grouped.get(key);
    if (current === undefined) {
      grouped.set(key, [entry]);
    } else {
      current.push(entry);
    }
  }

  const results: ReferenceGroup[] = [];
  for (const [key, groupedEntries] of grouped) {
    const sortedEntries = groupedEntries.toSorted(
      (a, b) => entryPriority(a) - entryPriority(b),
    );
    const [primary] = sortedEntries;
    if (primary !== undefined) {
      results.push({ key, primary, entries: sortedEntries });
    }
  }

  return results;
}

function uniqueLocations(
  entries: readonly ProductSearchEntry[],
): readonly ReferenceLocation[] {
  const seen = new Set<string>();
  const locations: ReferenceLocation[] = [];

  for (const entry of entries) {
    const location = entryLocation(entry);
    const key = `${location.label}:${location.href}`;
    if (!seen.has(key)) {
      seen.add(key);
      locations.push(location);
    }
  }

  return locations;
}

function fragmentOf(entry: ProductSearchEntry): string {
  const hashIndex = entry.href.lastIndexOf("#");
  return hashIndex === -1 ? "" : entry.href.slice(hashIndex + 1);
}

function isBrowseEntry(entry: ProductSearchEntry): boolean {
  if (entry.kind === "page") {
    return entry.pageId.startsWith("beginner/");
  }
  if (entry.areaLabel === "Extras" || entry.areaLabel === "Beginner") {
    return false;
  }

  const fragment = fragmentOf(entry);
  if (BROWSE_EXCLUDED_FRAGMENTS.has(fragment)) {
    return false;
  }

  return BROWSE_EXCLUDED_FRAGMENT_PARTS.every(
    (part) => !fragment.includes(part),
  );
}

function alphabetLetter(title: string): string {
  const first = title.trim().at(0)?.toUpperCase();
  if (first === undefined || DIGITS.includes(first)) {
    return "#";
  }
  return first;
}

function buildAlphabetGroups(): readonly AlphabetGroup[] {
  const browseEntries = referenceSearchEntries.filter(isBrowseEntry);
  const groups = groupReferenceEntries(browseEntries).toSorted((a, b) =>
    a.primary.sectionTitle.localeCompare(b.primary.sectionTitle, undefined, {
      sensitivity: "base",
    }),
  );
  const byLetter = new Map<string, ReferenceGroup[]>();

  for (const group of groups) {
    const letter = alphabetLetter(group.primary.sectionTitle);
    const current = byLetter.get(letter);
    if (current === undefined) {
      byLetter.set(letter, [group]);
    } else {
      current.push(group);
    }
  }

  return Array.from(byLetter, ([letter, entries]) => ({
    letter,
    entries,
  })).toSorted((a, b) => {
    if (a.letter === "#") {
      return -1;
    }
    if (b.letter === "#") {
      return 1;
    }
    return a.letter.localeCompare(b.letter, undefined, { sensitivity: "base" });
  });
}

function LocationLinks({
  entries,
}: {
  readonly entries: readonly ProductSearchEntry[];
}): React.JSX.Element {
  const locations = uniqueLocations(entries);

  return (
    <span className={styles["locations"]}>
      {locations.map((location) => (
        <Link
          className={styles["locationChip"]}
          key={`${location.label}:${location.href}`}
          to={`/${location.href}`}
        >
          {location.label}
        </Link>
      ))}
    </span>
  );
}

const ALPHABET_GROUPS = buildAlphabetGroups();

interface Props {
  readonly children?: React.ReactNode;
}

export default function ReferenceExplorer({
  children,
}: Props): React.JSX.Element {
  const [query, setQuery] = useUrlQueryState();
  const trimmedQuery = query.trim();
  const referenceMatches = searchEntries(
    referenceSearchEntries,
    trimmedQuery,
    referenceSearchEntries.length,
    foldRussianSearchText,
  );
  const referenceGroups = groupReferenceEntries(referenceMatches);
  const visibleReferenceGroups = referenceGroups.slice(0, MAX_VISIBLE_RESULTS);
  const variantResults = searchEntries(
    variantSearchEntries,
    trimmedQuery,
    variantSearchEntries.length,
    foldRussianSearchText,
  );
  const hasQuery = trimmedQuery !== "";

  return (
    <section aria-label={SEARCH_ARIA} className={styles["explorer"]}>
      <div className={styles["searchRow"]}>
        <input
          aria-label={INPUT_ARIA}
          className={styles["searchInput"]}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          placeholder={INPUT_PLACEHOLDER}
          type="search"
          value={query}
        />
        {hasQuery && (
          <button
            className={`button button--secondary button--sm ${styles["clearButton"]}`}
            onClick={() => {
              setQuery("");
            }}
            type="button"
          >
            <Translate id="product.common.clear">Clear</Translate>
          </button>
        )}
      </div>

      {!hasQuery && children !== undefined && (
        <div className={styles["sourceContext"]}>{children}</div>
      )}

      {hasQuery ? (
        <div className={styles["searchMode"]}>
          <div className={styles["resultSummary"]}>
            {referenceGroups.length === 0 ? (
              <Translate id="product.reference.noCoreMatches">
                No matches in the Reference.
              </Translate>
            ) : (
              <Translate
                id="product.reference.coreMatchCount"
                values={{ count: referenceGroups.length }}
              >
                {"Found in the Reference: {count}."}
              </Translate>
            )}
            {referenceGroups.length > MAX_VISIBLE_RESULTS && (
              <>
                {" "}
                <Translate
                  id="product.reference.firstResultsShown"
                  values={{ count: MAX_VISIBLE_RESULTS }}
                >
                  {"Showing the first {count}."}
                </Translate>
              </>
            )}
          </div>

          {visibleReferenceGroups.length > 0 && (
            <div className={styles["results"]}>
              {visibleReferenceGroups.map((group) => (
                <div className={styles["result"]} key={group.key}>
                  <Link
                    className={styles["resultTitle"]}
                    to={`/${entryLocation(group.primary).href}`}
                  >
                    {group.primary.sectionTitle}
                  </Link>
                  <LocationLinks entries={group.entries} />
                </div>
              ))}
            </div>
          )}

          {variantResults.length > 0 && (
            <div className={styles["variantBridge"]}>
              <span>
                <Translate
                  id="product.reference.variantMatchCount"
                  values={{ count: variantResults.length }}
                >
                  {"More matches in Variant-Specific: {count}."}
                </Translate>
              </span>
              <Link
                to={`/variant-specific?q=${encodeURIComponent(trimmedQuery)}`}
              >
                <Translate id="product.reference.searchVariants">
                  Search variants
                </Translate>
              </Link>
            </div>
          )}

          {referenceGroups.length === 0 && variantResults.length === 0 && (
            <div className={styles["emptyState"]}>
              <Translate id="product.reference.emptyState">
                Nothing found by section name or abbreviation. For arbitrary
                text, use the site-wide search in the top navigation.
              </Translate>
            </div>
          )}

          {children !== undefined && (
            <div className={styles["sourceContext"]}>{children}</div>
          )}
        </div>
      ) : (
        <div className={styles["browseMode"]}>
          <div className={styles["alphabetGrid"]}>
            {ALPHABET_GROUPS.map((alphabetGroup) => (
              <section
                className={styles["alphabetGroup"]}
                key={alphabetGroup.letter}
              >
                <div className={styles["letter"]}>{alphabetGroup.letter}</div>
                <div className={styles["alphabetEntries"]}>
                  {alphabetGroup.entries.map((group) => (
                    <div className={styles["browseEntry"]} key={group.key}>
                      <Link to={`/${entryLocation(group.primary).href}`}>
                        {group.primary.sectionTitle}
                      </Link>
                      <LocationLinks entries={group.entries} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className={styles["scopeFooter"]}>
            <div>
              <Translate id="product.reference.extrasFooterPrefix">
                Rare and additional conventions are also available in
              </Translate>{" "}
              <Link to="/extras">Extras</Link>.
            </div>
            <div>
              <Translate id="product.reference.variantFooterPrefix">
                Looking for a rule for a specific variant?
              </Translate>{" "}
              <Link to="/variant-specific">
                <Translate id="product.reference.openVariants">
                  Open Variant-Specific
                </Translate>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
