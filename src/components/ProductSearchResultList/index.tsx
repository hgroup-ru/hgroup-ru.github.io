import Link from "@docusaurus/Link";
import type { ProductSearchEntry } from "../../generated/productData";
import styles from "./styles.module.css";

interface Props {
  readonly entries: readonly ProductSearchEntry[];
}

function locationLabel(entry: ProductSearchEntry): string {
  return entry.level === undefined ? entry.areaLabel : `L${entry.level}`;
}

export default function ProductSearchResultList({
  entries,
}: Props): React.JSX.Element {
  return (
    <div className={styles["results"]}>
      {entries.map((entry) => (
        <Link className={styles["result"]} key={entry.id} to={`/${entry.href}`}>
          <span className={styles["title"]}>{entry.sectionTitle}</span>
          <span className={styles["meta"]}>{locationLabel(entry)}</span>
        </Link>
      ))}
    </div>
  );
}
