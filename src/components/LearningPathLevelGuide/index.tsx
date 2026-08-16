import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { useEffect } from "react";
import { levelBrowseEntries } from "../../generated/productData";
import { usePlayerLevel } from "../../hooks/usePlayerLevel";
import styles from "./styles.module.css";

const LEVEL_PATH_PATTERN = /\/level-(?<level>\d+)\/?$/v;
const LEVEL_LABEL =
  "\u{423}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C}";
const BEGINNER_EXPLANATION =
  "\u{421}\u{435}\u{439}\u{447}\u{430}\u{441}: Beginner. \u{41D}\u{430}\u{447}\u{43D}\u{438}\u{442}\u{435} \u{441} \u{440}\u{443}\u{43A}\u{43E}\u{432}\u{43E}\u{434}\u{441}\u{442}\u{432}\u{430} \u{434}\u{43B}\u{44F} \u{43D}\u{430}\u{447}\u{438}\u{43D}\u{430}\u{44E}\u{449}\u{438}\u{445} \u{438} \u{437}\u{430}\u{43A}\u{440}\u{435}\u{43F}\u{438}\u{442}\u{435} \u{43E}\u{441}\u{43D}\u{43E}\u{432}\u{44B} \u{432} \u{43D}\u{435}\u{441}\u{43A}\u{43E}\u{43B}\u{44C}\u{43A}\u{438}\u{445} \u{43F}\u{430}\u{440}\u{442}\u{438}\u{44F}\u{445}. 1-\u{439} \u{443}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C} \u{43F}\u{43E}\u{434}\u{440}\u{43E}\u{431}\u{43D}\u{435}\u{435} \u{440}\u{430}\u{437}\u{431}\u{438}\u{440}\u{430}\u{435}\u{442} \u{442}\u{43E}\u{442} \u{436}\u{435} \u{444}\u{443}\u{43D}\u{434}\u{430}\u{43C}\u{435}\u{43D}\u{442}; \u{43D}\u{43E}\u{432}\u{44B}\u{435} \u{43A}\u{43E}\u{43D}\u{432}\u{435}\u{43D}\u{446}\u{438}\u{438} \u{43D}\u{430}\u{447}\u{438}\u{43D}\u{430}\u{44E}\u{442}\u{441}\u{44F} \u{441}\u{43E} 2-\u{433}\u{43E} \u{443}\u{440}\u{43E}\u{432}\u{43D}\u{44F}.";
const BEGINNER_NEXT_LABEL =
  "\u{421}\u{43B}\u{435}\u{434}\u{443}\u{44E}\u{449}\u{438}\u{439}: \u{423}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C} 2";
const FINAL_LEVEL_LABEL =
  "\u{427}\u{442}\u{43E} \u{434}\u{430}\u{43B}\u{44C}\u{448}\u{435}";
const FINAL_LEVEL_MESSAGE =
  "\u{41E}\u{441}\u{43D}\u{43E}\u{432}\u{43D}\u{43E}\u{439} \u{43F}\u{443}\u{442}\u{44C} \u{43E}\u{431}\u{443}\u{447}\u{435}\u{43D}\u{438}\u{44F} \u{437}\u{430}\u{432}\u{435}\u{440}\u{448}\u{451}\u{43D}. \u{415}\u{441}\u{43B}\u{438} \u{432}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{43D}\u{43E} \u{447}\u{443}\u{432}\u{441}\u{442}\u{432}\u{443}\u{435}\u{442}\u{435} \u{441}\u{435}\u{431}\u{44F} \u{441} \u{43C}\u{430}\u{442}\u{435}\u{440}\u{438}\u{430}\u{43B}\u{43E}\u{43C} \u{443}\u{440}\u{43E}\u{432}\u{43D}\u{435}\u{439} 1\u{2013}25, \u{43C}\u{43E}\u{436}\u{43D}\u{43E} \u{43F}\u{435}\u{440}\u{435}\u{439}\u{442}\u{438} \u{43A} \u{43F}\u{440}\u{43E}\u{434}\u{432}\u{438}\u{43D}\u{443}\u{442}\u{44B}\u{43C} \u{441}\u{442}\u{440}\u{430}\u{442}\u{435}\u{433}\u{438}\u{44F}\u{43C} \u{2014} \u{431}\u{43E}\u{43B}\u{435}\u{435} \u{440}\u{435}\u{434}\u{43A}\u{438}\u{43C} \u{438} \u{441}\u{438}\u{442}\u{443}\u{430}\u{442}\u{438}\u{432}\u{43D}\u{44B}\u{43C} \u{43A}\u{43E}\u{43D}\u{432}\u{435}\u{43D}\u{446}\u{438}\u{44F}\u{43C}.";
const OPEN_ADVANCED_LABEL =
  "\u{41F}\u{435}\u{440}\u{435}\u{439}\u{442}\u{438} \u{43A} \u{43F}\u{440}\u{43E}\u{434}\u{432}\u{438}\u{43D}\u{443}\u{442}\u{44B}\u{43C} \u{441}\u{442}\u{440}\u{430}\u{442}\u{435}\u{433}\u{438}\u{44F}\u{43C}";

function levelSummaryRows(): readonly HTMLTableRowElement[] {
  const heading = document.querySelector<HTMLElement>("#level-summary");
  if (heading === null) {
    return [];
  }

  let candidate = heading.nextElementSibling;
  while (candidate !== null) {
    if (candidate instanceof HTMLTableElement) {
      return [
        ...candidate.querySelectorAll<HTMLTableRowElement>(
          ":scope > tbody > tr",
        ),
      ];
    }
    if (/^H[1-6]$/v.test(candidate.tagName)) {
      break;
    }
    candidate = candidate.nextElementSibling;
  }

  return [];
}

function rowLevel(row: HTMLTableRowElement): number | undefined {
  const link = row.querySelector<HTMLAnchorElement>('a[href*="level-"]');
  if (link === null) {
    return undefined;
  }

  const url = new URL(link.href);
  const match = LEVEL_PATH_PATTERN.exec(url.pathname);
  const level = match?.groups?.["level"];
  return level === undefined ? undefined : Number(level);
}

function markRows(level: number | undefined) {
  const currentRowClass = styles["currentRow"];
  const nextRowClass = styles["nextRow"];
  if (currentRowClass === undefined || nextRowClass === undefined) {
    return;
  }

  for (const row of levelSummaryRows()) {
    row.classList.remove(currentRowClass, nextRowClass);
    const candidate = rowLevel(row);
    if (candidate === undefined || level === undefined) {
      continue;
    }
    if (candidate === level) {
      row.classList.add(currentRowClass);
    }
    if (candidate === level + 1) {
      row.classList.add(nextRowClass);
    }
  }
}

function levelEntry(level: number) {
  return levelBrowseEntries.find((candidate) => candidate.level === level);
}

function levelName(level: number): string {
  const entry = levelEntry(level);
  if (entry === undefined) {
    return `${LEVEL_LABEL} ${level}`;
  }
  return `${LEVEL_LABEL} ${level}: ${entry.title}`;
}

function levelHref(level: number): string {
  return `/level-${level}`;
}

export default function LearningPathLevelGuide(): React.JSX.Element {
  const [level] = usePlayerLevel();
  const currentNumeric = typeof level === "number" ? level : undefined;
  useEffect(() => {
    markRows(currentNumeric);
    return () => {
      markRows(undefined);
    };
  }, [currentNumeric]);

  if (level === undefined) {
    return (
      <div className={styles["guide"]}>
        <Translate id="product.learningPath.noLevel">
          My level is not selected. Choose it in the top navigation to mark your
          place in the Learning Path.
        </Translate>
      </div>
    );
  }

  if (level === "beginner") {
    return (
      <div className={styles["guide"]}>
        <div>{BEGINNER_EXPLANATION}</div>
        <div className={styles["actions"]}>
          <Link to="/beginner">
            <Translate id="product.learningPath.openBeginner">
              Beginner guide
            </Translate>
          </Link>
          <Link to="/level-1">{`${LEVEL_LABEL} 1`}</Link>
          <Link to="/level-2">{BEGINNER_NEXT_LABEL}</Link>
        </div>
      </div>
    );
  }

  const nextNumeric = level < 25 ? level + 1 : undefined;

  return (
    <div className={styles["guide"]}>
      <div className={styles["levelGrid"]}>
        <div className={styles["levelCard"]}>
          <div className={styles["levelLabel"]}>
            <Translate id="product.learningPath.currentLevelLabel">
              Your level
            </Translate>
          </div>
          <div className={styles["levelName"]}>{levelName(level)}</div>
          <Link
            className={`button button--secondary button--sm ${styles["jumpButton"]}`}
            to={levelHref(level)}
          >
            <Translate id="product.learningPath.jumpToCurrent">
              Jump to my level
            </Translate>
          </Link>
        </div>

        {nextNumeric === undefined ? (
          <div className={styles["levelCard"]}>
            <div className={styles["levelLabel"]}>{FINAL_LEVEL_LABEL}</div>
            <div className={styles["lastLevel"]}>{FINAL_LEVEL_MESSAGE}</div>
            <Link
              className={`button button--secondary button--sm ${styles["jumpButton"]}`}
              to="/extras"
            >
              {OPEN_ADVANCED_LABEL}
            </Link>
          </div>
        ) : (
          <div className={styles["levelCard"]}>
            <div className={styles["levelLabel"]}>
              <Translate id="product.learningPath.nextLevelLabel">
                Next level
              </Translate>
            </div>
            <div className={styles["levelName"]}>{levelName(nextNumeric)}</div>
            <Link
              className={`button button--secondary button--sm ${styles["jumpButton"]}`}
              to={levelHref(nextNumeric)}
            >
              <Translate id="product.learningPath.jumpToNext">
                Jump to next level
              </Translate>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
