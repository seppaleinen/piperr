import {fixupConfigRules} from "@eslint/compat";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";
import react from "eslint-plugin-react";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended", // Add TypeScript rules
    )),
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json", // Path to your TypeScript configuration
            },
        },
        settings: {
            react: {
                version: "detect", // Automatically detects the React version
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        },
    }];