import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        ignores: ["dist/", "docs/", "node_modules/", "**/vendor/*.js"],
        rules: {
            "sort-imports": [
                "error",
                {
                    allowSeparatedGroups: true
                }
            ]
        }
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
