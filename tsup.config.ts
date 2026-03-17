import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/classes/Chord.ts",
        "src/classes/Interval.ts",
        "src/classes/Midi.ts",
        "src/classes/Note.ts",
        "src/classes/NoteSelection.ts",
        "src/classes/Scale.ts",
        "src/classes/SelectionType.ts",
        "src/data/chords.ts",
        "src/data/intervals.ts",
        "src/data/notes.ts",
        "src/data/scales.ts",
        "src/data/selectionTypes.ts",
        "src/helpers/matchHelpers.ts",
        "src/helpers/noteHelpers.ts"
    ],
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: true
});
