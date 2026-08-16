import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { useEffect } from "react";
import { levelBrowseEntries } from "../../generated/productData";
import { usePlayerLevel } from "../../hooks/usePlayerLevel";
import styles from "./styles.module.css";

const LEVEL_PATH_PATTERN = /\/level-(?<level>\d+)\/?$/v;
const FINAL_LEVEL_LABEL = "\u0427\u0442\u043e \u0434\u0430\u043b\u044c\u0448\u0435";
const FINAL_LEVEL_MESSAGE = "\u041e\u0441\u043d\u043e\u0432\u043d\u043e\u0439 \u043f\u0443\u0442\u044c \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043d. \u0415\u0441\u043b\u0438 \u0432\u044b \u0443\u0432\u0435\u0440\u0435\u043d\u043d\u043e \u0447\u0443\u0432\u0441\u0442\u0432\u0443\u0435\u0442\u0435 \u0441\u0435\u0431\u044f \u0441 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u043c \u0443\u0440\u043e\u0432\u043d\u0435\u0439 1\u201325, \u043c\u043e\u0436\u043d\u043e \u043f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u043c \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f\u043c \u2014 \u0431\u043e\u043b\u0435\u0435 \u0440\u0435\u0434\u043a\u0438\u043c \u0438 \u0441\u0438\u0442\u0443\u0430\u0442\u0438\u0432\u043d\u044b\u043c \u043a\u043e\u043d\u0432\u0435\u043d\u0446\u0438\u044f\u043c.";
const OPEN_ADVANCED_LABEL = "\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u043f\u0440\u043e\u0434\u0432\u0438\u043d\u0443\u0442\u044b\u043c \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f\u043c";

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
    return `Level ${level}`;
  }
  return `Level ${level}: ${entry.title}`;
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
        <div>
          <Translate id="product.learningPath.beginnerExplanation">
            My level: Beginner. Finish the Beginner's Guide and play a few games
            first. Level 1 consolidates and formalizes the fundamentals; new
            material starts at Level 2.
          </Translate>
        </div>
        <div className={styles["actions"]}>
          <Link to="/beginner">
            <Translate id="product.learningPath.openBeginner">
              Beginner guide
            </Translate>
          </Link>
          <Link to="/level-1">Level 1</Link>
          <Link to="/level-2">
            <Translate id="product.learningPath.beginnerNext">
              Next: Level 2
            </Translate>
          </Link>
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
