import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { useEffect, useState } from "react";
import { useUrlQueryState } from "../../hooks/useUrlQueryState";
import { normalizeSearchText } from "../../utils/productSearch";
import styles from "./styles.module.css";

const GLOSSARY_SELECTOR = '[data-hgroup-glossary="true"] table tbody tr';
const SEARCH_ARIA =
  "\u{41F}\u{43E}\u{438}\u{441}\u{43A} \u{43F}\u{43E} \u{441}\u{43B}\u{43E}\u{432}\u{430}\u{440}\u{44E}";
const SEARCH_PLACEHOLDER =
  "\u{41D}\u{430}\u{439}\u{442}\u{438} \u{442}\u{435}\u{440}\u{43C}\u{438}\u{43D}: finesse, chop, tempo...";

export default function GlossarySearch(): React.JSX.Element {
  const [query, setQuery] = useUrlQueryState();
  const [counts, setCounts] = useState({ visible: 0, total: 0 });

  useEffect(() => {
    const normalizedQuery = normalizeSearchText(query);
    const rows =
      document.querySelectorAll<HTMLTableRowElement>(GLOSSARY_SELECTOR);
    let visible = 0;

    for (const row of rows) {
      const searchable = normalizeSearchText(row.textContent);
      const matches =
        normalizedQuery === "" || searchable.includes(normalizedQuery);
      row.hidden = !matches;
      if (matches) {
        visible++;
      }
    }

    setCounts({ visible, total: rows.length });
  }, [query]);

  const hasQuery = query.trim() !== "";
  let countLabel: React.JSX.Element | string = "";
  if (counts.total > 0) {
    countLabel = hasQuery ? (
      <Translate
        id="product.glossary.shownCount"
        values={{ total: counts.total, visible: counts.visible }}
      >
        {"Shown: {visible} of {total}"}
      </Translate>
    ) : (
      <Translate
        id="product.glossary.totalCount"
        values={{ total: counts.total }}
      >
        {"Terms: {total}"}
      </Translate>
    );
  }

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["searchRow"]}>
        <input
          aria-label={SEARCH_ARIA}
          className={styles["searchInput"]}
          data-hgroup-local-search="true"
          onChange={(event) => {
            setQuery(event.currentTarget.value);
          }}
          placeholder={SEARCH_PLACEHOLDER}
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
      <div aria-live="polite" className={styles["count"]}>
        {countLabel}
      </div>
      {hasQuery && counts.total > 0 && counts.visible === 0 && (
        <div className={styles["empty"]}>
          <Translate id="product.glossary.emptyPrefix">
            Nothing found. For named conventions, try
          </Translate>{" "}
          <Link to={`/reference?q=${encodeURIComponent(query.trim())}`}>
            <Translate id="product.reference.shortLabel">Reference</Translate>
          </Link>
          .
        </div>
      )}
    </div>
  );
}
