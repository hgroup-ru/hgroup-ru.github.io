import { $, buildScript } from "complete-node";
import { compilePlugin } from "./compilePlugin.mjs";

await buildScript(import.meta.dirname, async (packageRoot) => {
  await $`tsx --tsconfig ./scripts/tsconfig.json ./scripts/generateProductData.mts`;
  await compilePlugin(packageRoot);
  await $`docusaurus clear`;
  await $`docusaurus build`;
});
