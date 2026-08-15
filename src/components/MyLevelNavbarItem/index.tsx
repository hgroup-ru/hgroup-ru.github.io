import Translate from "@docusaurus/Translate";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useId } from "react";
import { usePlayerLevel } from "../../hooks/usePlayerLevel";
import styles from "./styles.module.css";

const MY_LEVEL_ARIA =
  "\u{41C}\u{43E}\u{439} \u{443}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C} H-Group";

export default function MyLevelNavbarItem(): React.JSX.Element | undefined {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const [level, setLevel] = usePlayerLevel();
  const selectId = useId();

  if (currentLocale !== "ru") {
    return undefined;
  }

  return (
    <div className={styles["wrapper"]}>
      <label className={styles["label"]} htmlFor={selectId}>
        <Translate id="product.myLevel.label">My level</Translate>
      </label>
      <select
        aria-label={MY_LEVEL_ARIA}
        className={styles["select"]}
        id={selectId}
        onChange={(event) => {
          const { value } = event.currentTarget;
          if (value === "") {
            setLevel(undefined);
          } else if (value === "beginner") {
            setLevel("beginner");
          } else {
            setLevel(Number(value));
          }
        }}
        value={level ?? ""}
      >
        <option value="">-</option>
        <option value="beginner">Beginner</option>
        {Array.from({ length: 25 }, (_, index) => index + 1).map((value) => (
          <option key={value} value={value}>
            L{value}
          </option>
        ))}
      </select>
    </div>
  );
}
