import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";
import { isArray, isObject } from "complete-common";

import baseSidebars from "./sidebars-base";

const { mainSidebar } = baseSidebars;
if (!isArray(mainSidebar)) {
  throw new TypeError(
    'Failed to parse the "mainSidebar" from sidebars-base.ts.',
  );
}

const twoPlayerIndex = mainSidebar.indexOf("extras/two-player");
if (twoPlayerIndex === -1) {
  throw new TypeError(
    'Failed to find "extras/two-player" in sidebars-base.ts.',
  );
}

const mainSidebarWithScoreHunting = [
  ...mainSidebar.slice(0, twoPlayerIndex + 1),
  "extras/two-player/score-hunting-guide",
  ...mainSidebar.slice(twoPlayerIndex + 1),
];

const challengeQuestionsIndex = mainSidebarWithScoreHunting.findIndex(
  (element) => isObject(element) && "Challenge Questions" in element,
);
if (challengeQuestionsIndex === -1) {
  throw new TypeError(
    'Failed to find "Challenge Questions" in sidebars-base.ts.',
  );
}

const challengeQuestions = mainSidebarWithScoreHunting[challengeQuestionsIndex];
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
  mainSidebar: mainSidebarWithScoreHunting.map((element, index) =>
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
            {
              "Level 24": [
                "challenge-questions/level-24",
                "challenge-questions/level-24-side-benefit",
                "challenge-questions/level-24-fill-in-sign",
                "challenge-questions/level-24-known-trash-ignition-target",
                "challenge-questions/level-24-trash-chop-illegal",
                "challenge-questions/level-24-off-chop-asymmetry",
                "challenge-questions/level-24-on-chop-trash-push",
                "challenge-questions/level-24-bad-chop-ejection-chain",
              ],
            },
            {
              "Level 25": [
                "challenge-questions/level-25",
                "challenge-questions/level-25-next-hand-vs-own",
                "challenge-questions/level-25-finesse-target-other",
                "challenge-questions/level-25-priority-bluff",
                "challenge-questions/level-25-load-save-looking",
                "challenge-questions/level-25-paused-positive",
                "challenge-questions/level-25-paused-negative",
                "challenge-questions/level-25-mixed-superposition",
                "challenge-questions/level-25-trust-positive",
                "challenge-questions/level-25-trust-not-slight",
                "challenge-questions/level-25-four-exception",
                "challenge-questions/level-25-important-two",
                "challenge-questions/level-25-next-card-only",
                "challenge-questions/level-25-locked-override",
              ],
            },
          ],
        }
      : element,
  ),
} as SidebarsConfig;

export default sidebars;
