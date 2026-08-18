const MAX_LEVEL = 25;

const KEY_MAP = new Map([
  ["ArrowLeft", navigateToPreviousPage],
  ["ArrowRight", navigateToNextPage],
  ["KeyF", focusLocalSearch],
  ["KeyG", goToGlossary],
  ["KeyL", goToSpecificLevel],
  ["KeyP", goToLearningPath],
  ["KeyR", goToReference],
  ["KeyS", goToSummary],
  ["Slash", openGlobalSearch],
]);

const SHIFT_KEY_MAP = new Map([
  ["ArrowLeft", navigateToPreviousSection],
  ["ArrowRight", navigateToNextSection],
]);

const RU_LEVEL_PROMPT =
  "\u{412}\u{432}\u{435}\u{434}\u{438}\u{442}\u{435} \u{443}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C} (1-25):";

main();

function main() {
  document.addEventListener("keydown", (event) => {
    // Do not do anything if we have Ctrl, Alt or Meta modifier keys pressed down.
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Do not hijack navigation keys while the user is typing or choosing a form value.
    if (isFormControlFocused()) {
      return;
    }

    const keyFunction = (event.shiftKey ? SHIFT_KEY_MAP : KEY_MAP).get(
      event.code,
    );
    if (keyFunction !== undefined) {
      event.preventDefault();
      keyFunction();
    }
  });
}

/** @returns {boolean} */
function isFormControlFocused() {
  const { activeElement } = document;
  if (!(activeElement instanceof HTMLElement)) {
    return false;
  }

  return (
    activeElement instanceof HTMLInputElement
    || activeElement instanceof HTMLTextAreaElement
    || activeElement instanceof HTMLSelectElement
    || activeElement.isContentEditable
  );
}

function navigateToPreviousPage() {
  if (isOnLandingPage()) {
    return;
  }

  const previousLink = document.querySelector(".pagination-nav__link--prev");
  if (previousLink instanceof HTMLElement) {
    previousLink.click();
    return;
  }

  clickOnNavBarTitle();
}

function navigateToNextPage() {
  if (isOnLandingPage()) {
    clickOnFirstLandingPageButton();
    return;
  }

  const nextLink = document.querySelector(".pagination-nav__link--next");
  if (nextLink instanceof HTMLElement) {
    nextLink.click();
  }
}

function focusLocalSearch() {
  const localSearch = document.querySelector(
    'input[data-hgroup-local-search="true"]',
  );
  if (localSearch instanceof HTMLInputElement) {
    localSearch.focus();
  }
}

function openGlobalSearch() {
  const searchButton = document.querySelector(".DocSearch-Button");
  if (searchButton instanceof HTMLElement) {
    searchButton.click();
  }
}

function goToGlossary() {
  globalThis.location.assign("/glossary");
}

function goToLearningPath() {
  globalThis.location.assign("/learning-path");
}

function goToReference() {
  globalThis.location.assign("/reference");
}

function goToSummary() {
  globalThis.location.assign("/summary");
}

function navigateToPreviousSection() {
  const sections = document.querySelectorAll("h2[id], h3[id]");
  for (const section of [...sections].toReversed()) {
    // Return first section above current position (iterating backwards), keeping in mind the top
    // navigation bar and a small threshold.
    if (section.getBoundingClientRect().top >= 50) {
      continue;
    }

    scrollToSection(section);
    return;
  }
  // If no previous section found, scroll to top.
  scrollToSection(document.documentElement);
}

function navigateToNextSection() {
  const sections = document.querySelectorAll("h2[id], h3[id]");
  for (const section of sections) {
    // Return first section below current position, keeping in mind the top navigation bar and a
    // small threshold.
    if (section.getBoundingClientRect().top <= 70) {
      continue;
    }

    scrollToSection(section);
    return;
  }

  // If no next section found, scroll to pagination nav at bottom.
  const paginationNav = document.querySelector(".pagination-nav");
  if (paginationNav !== null) {
    scrollToSection(paginationNav);
  }
}

/** @param {Element} section */
function scrollToSection(section) {
  section.scrollIntoView();
  if (section.id !== "") {
    globalThis.history.pushState(undefined, "", `#${section.id}`);
  }
}

function goToSpecificLevel() {
  const isRussian = document.documentElement.lang
    .toLowerCase()
    .startsWith("ru");

  // eslint-disable-next-line no-alert
  const levelString = prompt(
    isRussian
      ? RU_LEVEL_PROMPT
      : "Enter the level that you want to go to (1-25):",
  );
  if (levelString === null || levelString === "") {
    return;
  }

  const level = parseIntSafe(levelString);
  if (level === undefined) {
    const message = isRussian
      ? [
          "\u{AB}",
          levelString,
          "\u{BB} - \u{43D}\u{435} \u{43D}\u{43E}\u{43C}\u{435}\u{440} \u{443}\u{440}\u{43E}\u{432}\u{43D}\u{44F}.",
        ].join("")
      : `"${levelString}" is not a number.`;
    // eslint-disable-next-line no-alert
    alert(message);
    return;
  }

  if (level < 1 || level > MAX_LEVEL) {
    const message = isRussian
      ? [
          `Level ${level}`,
          " \u{43D}\u{435} \u{441}\u{443}\u{449}\u{435}\u{441}\u{442}\u{432}\u{443}\u{435}\u{442}; \u{432}\u{44B}\u{431}\u{435}\u{440}\u{438}\u{442}\u{435} \u{443}\u{440}\u{43E}\u{432}\u{435}\u{43D}\u{44C} \u{43E}\u{442} 1 \u{434}\u{43E} ",
          String(MAX_LEVEL),
          ".",
        ].join("")
      : `Level ${level} is not a valid level; levels must be between 1 and ${MAX_LEVEL}.`;
    // eslint-disable-next-line no-alert
    alert(message);
    return;
  }

  globalThis.location.assign(`/level-${level}`);
}

function isOnLandingPage() {
  const titles = document.querySelectorAll(".hero__title");
  return titles.length > 0;
}

function clickOnNavBarTitle() {
  const navBarTitles = document.querySelectorAll(".navbar__title");
  const navBarTitle = navBarTitles[0];
  if (navBarTitle !== undefined && navBarTitle instanceof HTMLElement) {
    navBarTitle.click();
  }
}

function clickOnFirstLandingPageButton() {
  const largeButtons = document.querySelectorAll(".button--lg");
  const largeButton = largeButtons[0];
  if (largeButton !== undefined && largeButton instanceof HTMLElement) {
    largeButton.click();
  }
}

/**
 * This is a more reliable version of `Number.parseInt`:
 *
 * - `undefined` is returned instead of `Number.NaN`, which is helpful in conjunction with
 *   TypeScript type narrowing patterns.
 * - Strings that are a mixture of numbers and letters will result in undefined instead of the part
 *   of the string that is the number. (e.g. "1a" --> undefined instead of "1a" --> 1)
 * - Non-strings will result in undefined instead of being coerced to a number.
 *
 * If you have to use a radix other than 10, use the vanilla `Number.parseInt` function instead,
 * because this function ensures that the string contains no letters.
 *
 * @param {string} string The string to convert to a number.
 */
function parseIntSafe(string) {
  if (typeof string !== "string") {
    return undefined;
  }

  const trimmedString = string.trim();

  // If the string does not entirely consist of numbers, return undefined.
  if (!/^-?\d+$/v.test(trimmedString)) {
    return undefined;
  }

  const number = Math.trunc(Number(trimmedString));
  return Number.isNaN(number) ? undefined : number;
}
