import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import {
  variantBrowseEntries,
  variantSearchEntries,
} from "../../generated/productData";
import { useUrlQueryState } from "../../hooks/useUrlQueryState";
import { searchEntries } from "../../utils/productSearch";
import ProductSearchResultList from "../ProductSearchResultList";
import styles from "./styles.module.css";

const MAX_VISIBLE_RESULTS = 50;
const SEARCH_ARIA =
  "\u{41F}\u{43E}\u{438}\u{441}\u{43A} \u{43F}\u{43E} Variant-Specific";
const INPUT_ARIA =
  "\u{41D}\u{430}\u{439}\u{442}\u{438} \u{43A}\u{43E}\u{43D}\u{432}\u{435}\u{43D}\u{446}\u{438}\u{44E} \u{432} \u{432}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442}\u{430}\u{445}";
const INPUT_PLACEHOLDER =
  "\u{41D}\u{430}\u{439}\u{442}\u{438} convention \u{432} \u{432}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442}\u{430}\u{445}: finesse, loaded, pink...";

export default function VariantExplorer(): React.JSX.Element {
  const [query, setQuery] = useUrlQueryState();
  const trimmedQuery = query.trim();
  const results = searchEntries(
    variantSearchEntries,
    trimmedQuery,
    variantSearchEntries.length,
  );
  const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);
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

      {hasQuery ? (
        <div className={styles["searchMode"]}>
          <div className={styles["summary"]}>
            {results.length === 0 ? (
              <Translate id="product.variants.noMatches">
                No matches in Variant-Specific.
              </Translate>
            ) : (
              <Translate
                id="product.variants.matchCount"
                values={{ count: results.length }}
              >
                {"Found in Variant-Specific: {count}."}
              </Translate>
            )}
            {results.length > MAX_VISIBLE_RESULTS && (
              <>
                {" "}
                <Translate
                  id="product.variants.firstResultsShown"
                  values={{ count: MAX_VISIBLE_RESULTS }}
                >
                  {"Showing the first {count}."}
                </Translate>
              </>
            )}
          </div>
          {visibleResults.length > 0 && (
            <ProductSearchResultList entries={visibleResults} />
          )}
          {results.length === 0 && (
            <div className={styles["emptyState"]}>
              <Translate id="product.variants.emptyPrefix">
                Try a variant name, convention, or abbreviation. For general
                H-Group conventions, use
              </Translate>{" "}
              <Link to="/reference">
                <Translate id="product.reference.shortLabel">
                  Reference
                </Translate>
              </Link>
              .
            </div>
          )}
        </div>
      ) : (
        <div className={styles["browseMode"]}>
          <div className={styles["summary"]}>
            <Translate id="product.variants.browseIntro">
              Choose a variant or start typing a convention name. Search here is
              limited to Variant-Specific material.
            </Translate>
          </div>
          <div className={styles["variantGrid"]}>
            {variantBrowseEntries.map((entry) => (
              <Link
                className={styles["variantLink"]}
                key={entry.href}
                to={`/${entry.href}`}
              >
                {entry.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
