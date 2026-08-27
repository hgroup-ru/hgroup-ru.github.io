import fs from "node:fs";
import { fileURLToPath } from "node:url";

const specialPath =
  "i18n/ru/docusaurus-plugin-content-docs/current/extras/special-bluffs.mdx";
let special = fs.readFileSync(specialPath, "utf8");
const wrong = "У Боба никак не может быть красная 3 на _Finesse Position_";
const right = "У Боба никак не может быть красной 3 на _Finesse Position_";
if (special.split(wrong).length - 1 !== 3) {
  throw new Error("Unexpected Self Color Bluff carry-over diff");
}
special = special.replaceAll(wrong, right);
fs.writeFileSync(specialPath, special);

const bcmePath =
  "i18n/ru/docusaurus-plugin-content-docs/current/extras/ejections/bad-chop-move-ejection.yml";
let bcme = fs.readFileSync(bcmePath, "utf8");
bcme = bcme.replace("below: Already played", "below: Trash duplicate");
bcme = bcme.replace(
  "уже является сыгранным мусором. Поэтому Боб",
  "является копией уже сыгранной карты и потому мусором. Поэтому Боб",
);
fs.writeFileSync(bcmePath, bcme);

const changelogPath = "CHANGELOG.md";
let changelog = fs.readFileSync(changelogPath, "utf8");
const placeholder = "_Изменений для следующего релиза пока нет._";
const notes = `<!-- release-title: Directness Principle и новые учебные диаграммы -->

После прошлого официального релиза русская версия получила два свежих уточнения H-Group и четыре новые локальные teaching diagrams для сложных prose-only конвенций.

### Добавлено

- В Extras добавлены четыре локальные учебные диаграммы H-Group RU для примеров без official upstream YML: Bad Chop Move Ejection, Pass Bluff, Trash Pull и Continuation Clue. Каждая схема явно помечена как локальная и служит визуальным объяснением уже существующего текста, а не новым правилом.

### Улучшено

- На 10-м уровне добавлен новый Directness Principle: если две линии приводят к одинаковому результату, включая одинаковые superpositions на всех картах с подсказками, предпочтительна менее сложная линия.
- В Special-Fives уточнены Color Promise и исключение Color Play Clue Lie: лишние карты неправильного цвета должны затрагиваться в той же руке и в рамках той же подсказки.
`;
if (!changelog.includes(placeholder)) {
  throw new Error("Release notes placeholder not found");
}
changelog = changelog.replace(placeholder, notes);
fs.writeFileSync(changelogPath, changelog);

const backlogPath = "BACKLOG.md";
let backlog = fs.readFileSync(backlogPath, "utf8");
const start = backlog.indexOf("\n## Локальные учебные диаграммы\n");
const end = backlog.indexOf("\n## Сопровождение upstream\n");
if (start === -1 || end === -1 || end <= start) {
  throw new Error("Teaching diagram backlog section not found");
}
backlog = `${backlog.slice(0, start)}\n${backlog.slice(end)}`;
fs.writeFileSync(backlogPath, backlog);

const packagePath = "package.json";
let packageText = fs.readFileSync(packagePath, "utf8");
const temporaryFormat =
  "tsx --tsconfig ./scripts/tsconfig.json ./scripts/finalizeExtrasTeachingCandidate.mts && npm run generate-product-data && eslint --fix . && prettier --write .";
const canonicalFormat =
  "npm run generate-product-data && eslint --fix . && prettier --write .";
if (!packageText.includes(temporaryFormat)) {
  throw new Error("Temporary format hook not found");
}
packageText = packageText.replace(temporaryFormat, canonicalFormat);
fs.writeFileSync(packagePath, packageText);

fs.rmSync(fileURLToPath(import.meta.url));
