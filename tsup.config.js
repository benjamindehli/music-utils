import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.js"],
    format: ["esm", "cjs"],
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false
});
