import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { isArray, isObject } from "complete-common";

import baseSidebars from "./sidebars-base";

const { mainSidebar } = baseSidebars;
if (!isArray(mainSidebar)) {
  throw new TypeError(
    'Failed to parse the "mainSidebar" from sidebars-base.ts.',
  );
}

const challengeQuestionsIndex = mainSidebar.findIndex(
  (element) => isObject(element) && "Challenge Questions" in element,
);
if (challengeQuestionsIndex === -1) {
  throw new TypeError(
    'Failed to find "Challenge Questions" in sidebars-base.ts.',
  );
}

const challengeQuestions = mainSidebar[challengeQuestionsIndex];
if (!isObject(challengeQuestions)) {
  throw new TypeError(
    'Failed to parse "Challenge Questions" in sidebars-base.ts.',
  );
}

const challengeQuestionsRecord = challengeQuestions as Record<string, unknown>;
const challengeQuestionItems = challengeQuestionsRecord["Challenge Questions"];
if (!isArray(challengeQuestionItems)) {
  throw new TypeError(
    'Failed to parse "Challenge Questions" items in sidebars-base.ts.',
  );
}

const sidebars = {
  ...baseSidebars,
  mainSidebar: mainSidebar.map((element, index) =>
    index === challengeQuestionsIndex
      ? {
          "Challenge Questions": [
            ...challengeQuestionItems,
            {
              "Level 23": [
                "challenge-questions/level-23",
                "challenge-questions/level-23-four-charm-two-blinds",
                "challenge-questions/level-23-four-charm-prompt-count",
                "challenge-questions/level-23-four-charm-three-blinds",
                "challenge-questions/level-23-blaze-position",
                "challenge-questions/level-23-blaze-next-player",
                "challenge-questions/level-23-blaze-playable-one",
                "challenge-questions/level-23-blaze-layered-illegal",
                "challenge-questions/level-23-hesitation-safe",
                "challenge-questions/level-23-hesitation-self-finesse",
                "challenge-questions/level-23-hesitation-ambiguous-connector",
              ],
            },
          ],
        }
      : element,
  ),
} as SidebarsConfig;

export default sidebars;
