import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        ignorePatterns: ["dist/", "docs/", "node_modules/", "**/vendor/*.js"]
    },
    {
        files: ["**/*.test.js", "**/*.spec.js"], // 👈 Only apply to test files
        languageOptions: {
            globals: {
                ...globals.jest // 👈 Add Jest globals like `describe`, `it`, `expect`
            }
        },
        rules: {
            // Optional: Jest-specific rules
            "no-undef": "off" // Jest defines globals, so we disable this warning
        }
    }
]);
