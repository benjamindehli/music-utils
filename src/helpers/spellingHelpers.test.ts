import { getSpelledNotes, parseNoteName } from "./spellingHelpers";
import Scale from "../classes/Scale";
import Chord from "../classes/Chord";
import scaleTypes from "../data/scaleTypes";
import chordTypes from "../data/chordTypes";
import notes from "../data/notes";

const majorScale = scaleTypes.find((st) => st.name === "major scale")!.halfSteps;
const naturalMinorScale = scaleTypes.find((st) => st.name === "natural minor scale")!.halfSteps;
const majorPentatonic = scaleTypes.find((st) => st.name === "major pentatonic scale")!.halfSteps;
const majorChord = chordTypes.find((ct) => ct.name === "major")!.halfSteps;
const minorChord = chordTypes.find((ct) => ct.name === "minor")!.halfSteps;

const names = (ns: { name: string }[]) => ns.map((n) => n.name);

describe("getSpelledNotes", () => {
    it("spells an F major scale with a flat (the reported bug: Bb, not A#)", () => {
        expect(names(getSpelledNotes(5, majorScale))).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
    });

    it("spells a C major scale with all naturals", () => {
        expect(names(getSpelledNotes(0, majorScale))).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    });

    it("uses each letter A-G exactly once for a heptatonic scale", () => {
        const letters = names(getSpelledNotes(5, majorScale)).map((n) => n[0]);
        expect(new Set(letters).size).toBe(7);
    });

    it("prefers flats for the tonic when it minimizes accidentals (Gb, not F#)", () => {
        expect(names(getSpelledNotes(6, majorScale))).toEqual(["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"]);
    });

    it("spells Bb major rather than the double-sharp-laden A# major", () => {
        expect(names(getSpelledNotes(10, majorScale))).toEqual(["Bb", "C", "D", "Eb", "F", "G", "A"]);
    });

    it("keeps sharps for a sharp key (C# major uses E# and B#)", () => {
        expect(names(getSpelledNotes(1, majorScale, "C#"))).toEqual(["C#", "D#", "E#", "F#", "G#", "A#", "B#"]);
    });

    it("spells C natural minor with flats", () => {
        expect(names(getSpelledNotes(0, naturalMinorScale))).toEqual(["C", "D", "Eb", "F", "G", "Ab", "Bb"]);
    });

    it("skips letters correctly for a pentatonic scale (no double sharps)", () => {
        // C major pentatonic is C D E G A — not C D E F## A
        expect(names(getSpelledNotes(0, majorPentatonic))).toEqual(["C", "D", "E", "G", "A"]);
    });

    it("respects an explicit root spelling when provided", () => {
        expect(names(getSpelledNotes(6, majorScale, "F#"))).toEqual(["F#", "G#", "A#", "B", "C#", "D#", "E#"]);
    });

    it("spells an F minor chord as F Ab C, not F G# C", () => {
        expect(names(getSpelledNotes(5, minorChord, "F"))).toEqual(["F", "Ab", "C"]);
    });

    it("spells a C major chord as C E G", () => {
        expect(names(getSpelledNotes(0, majorChord, "C"))).toEqual(["C", "E", "G"]);
    });

    it("returns an empty array for empty half steps", () => {
        expect(getSpelledNotes(0, [])).toEqual([]);
    });

    it("preserves correct pitch class numbers", () => {
        const spelled = getSpelledNotes(5, majorScale); // F major
        expect(spelled.map((n) => n.number)).toEqual([5, 7, 9, 10, 0, 2, 4]);
    });
});

describe("parseNoteName", () => {
    it("parses naturals, sharps, and flats", () => {
        expect(parseNoteName("C")).toEqual({ letterIndex: 0, alt: 0 });
        expect(parseNoteName("F#")).toEqual({ letterIndex: 3, alt: 1 });
        expect(parseNoteName("Bb")).toEqual({ letterIndex: 6, alt: -1 });
        expect(parseNoteName("Gbb")).toEqual({ letterIndex: 4, alt: -2 });
    });

    it("returns undefined for an unrecognized name", () => {
        expect(parseNoteName("H")).toBeUndefined();
    });
});

describe("Scale.getNotes", () => {
    it("returns correctly spelled notes for an F major scale", () => {
        const scaleType = scaleTypes.find((st) => st.name === "major scale")!;
        const rootF = notes.find((n) => n.name === "F")!;
        const scale = new Scale({ scaleType, rootNote: rootF });
        expect(names(scale.getNotes())).toEqual(["F", "G", "A", "Bb", "C", "D", "E"]);
    });
});

describe("Chord.getNotes", () => {
    it("returns correctly spelled notes for an F minor chord", () => {
        const chordType = chordTypes.find((ct) => ct.name === "minor")!;
        const rootF = notes.find((n) => n.name === "F")!;
        const chord = new Chord({ chordType, rootNote: rootF });
        expect(names(chord.getNotes())).toEqual(["F", "Ab", "C"]);
    });
});
