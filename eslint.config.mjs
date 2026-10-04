import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  globalIgnores([
    "dist/**",
    ".wrangler/**",
    ".tanstack/**",
    "public/javascripts/**",
    "src/routeTree.gen.ts",
    "worker-configuration.d.ts",
  ]),
]);

export default eslintConfig;
