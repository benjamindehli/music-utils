import {
    getChordsFromSelectedNotes,
    getChordsInScale,
    getHighestBassNoteNumber,
    getLowestNoteNumber,
    getMatchedInversionsForAllRootNotes,
    getMatchedInversionsForRootNote,
    getMatchedScalesForAllRootNotes,
    getScalesFromSelectedNotes,
    removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber
} from "./matchHelpers";
import Scale from "../classes/Scale";
import { getNoteFromNoteNumber } from "./noteHelpers";
import notes from "../data/notes";
import scaleTypes from "../data/scaleTypes";

describe("getChordsFromSelectedNotes", () => {
    it("returns empty array for empty input", () => {
        expect(getChordsFromSelectedNotes([])).toEqual([]);
    });

    it("identifies a C major chord with exactRoot matchType and no bassNote", () => {
        const midiNotes = [60, 64, 67];
        const result = getChordsFromSelectedNotes(midiNotes);
        const match = result.find((r) => r.chord?.rootNote?.name === "C" && r.chord?.chordType?.name === "major" && r.matchType === "exactRoot");
        expect(match).toBeTruthy();
        expect(match?.chord?.bassNote).toBeUndefined();
    });

    it("identifies an E minor chord with exactRoot matchType and no bassNote", () => {
        const midiNotes = [64, 67, 71];
        const result = getChordsFromSelectedNotes(midiNotes);
        const match = result.find((r) => r.chord?.rootNote?.name === "E" && r.chord?.chordType?.name === "minor" && r.matchType === "exactRoot");
        expect(match).toBeTruthy();
        expect(match?.chord?.bassNote).toBeUndefined();
    });

    it("returns nonRoot matchType for inversions and no bassNote", () => {
        const midiNotes = [64, 67, 72]; // E, G, C (C major first inversion)
        const result = getChordsFromSelectedNotes(midiNotes);
        const match = result.find((r) => r.matchType === "nonRoot");
        expect(match).toBeTruthy();
        expect(match?.chord?.bassNote).toBeUndefined();
    });

    it("returns nonRoot matchType for non-root matches and no bassNote", () => {
        const midiNotes = [71, 74, 67]; // B, D, G (G major, but not root)
        const result = getChordsFromSelectedNotes(midiNotes);
        const match = result.find((r) => r.matchType === "nonRoot");
        expect(match).toBeTruthy();
        expect(match?.chord?.bassNote).toBeUndefined();
    });

    it("returns slashChord matchType when lowest note is omitted and includes correct bassNote", () => {
        const midiNotes = [64, 67, 72]; // E, G, C (C major, but E is the lowest note)
        const result = getChordsFromSelectedNotes(midiNotes);
        const match = result.find((r) => r.matchType === "slashChord");
        expect(match).toBeTruthy();
        expect(match?.chord?.bassNote?.name).toBe("E");
    });
});

describe("getHighestBassNoteNumber", () => {
    it("calculates the highest bass note number", () => {
        const midiNotes = [52, 64, 69, 70, 73, 76];
        const result = getHighestBassNoteNumber(midiNotes);
        expect(result).toBe(64);
    });

    it("calculates the highest bass note number with intervening notes", () => {
        const midiNotes = [52, 61, 64, 69, 70, 73, 76];
        const result = getHighestBassNoteNumber(midiNotes);
        expect(result).toBe(52);
    });
});

describe("removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber", () => {
    it("removes other notes in different octaves than the key note 64", () => {
        const midiNotes = [52, 64, 69, 70, 73, 76];
        const result = removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber(midiNotes, 64);
        expect(result).toEqual([64, 69, 70, 73]);
    });

    it("removes other notes in different octaves than the key note 52", () => {
        const midiNotes = [52, 64, 69, 70, 73, 76];
        const result = removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber(midiNotes, 52);
        expect(result).toEqual([52, 69, 70, 73]);
    });

    it("removes other notes in different octaves than the key note 76", () => {
        const midiNotes = [52, 64, 69, 70, 73, 76];
        const result = removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber(midiNotes, 76);
        expect(result).toEqual([69, 70, 73, 76]);
    });
});

describe("getMatchedInversionsForRootNote", () => {
    it("finds inversions for a C major chord and does not set bassNote", () => {
        const midiNotes = [60, 67, 76]; // C, G, E
        const result = getMatchedInversionsForRootNote(midiNotes, 60); // C as root
        expect(result.some((r) => r.chordType?.name === "major")).toBe(true);
        expect(result[0]?.bassNote).toBeUndefined();
    });
});

describe("getMatchedInversionsForAllRootNotes", () => {
    it("finds all root note inversions for a C major chord and does not set bassNote", () => {
        const midiNotes = [60, 64, 67]; // C, E, G
        const result = getMatchedInversionsForAllRootNotes(midiNotes);
        expect(result.some((r) => r.chordType?.name === "major")).toBe(true);
        expect(result[0]?.bassNote).toBeUndefined();
    });
});

describe("getLowestNoteNumber", () => {
    it("returns the lowest note number from an array", () => {
        const midiNotes = [64, 67, 72, 60, 76];
        const result = getLowestNoteNumber(midiNotes);
        expect(result).toBe(60);
    });

    it("returns the single note when array has one element", () => {
        const midiNotes = [64];
        const result = getLowestNoteNumber(midiNotes);
        expect(result).toBe(64);
    });

    it("handles negative note numbers", () => {
        const midiNotes = [-5, 10, 3, 0];
        const result = getLowestNoteNumber(midiNotes);
        expect(result).toBe(-5);
    });
});

describe("getMatchedScalesForAllRootNotes", () => {
    it("finds scale matches for given notes", () => {
        const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C major scale
        const result = getMatchedScalesForAllRootNotes(midiNotes);
        expect(result.length).toBeGreaterThan(0);
        expect(result.some((match) => match.scale?.rootNote?.name === "C" && match.scale?.scaleType?.name === "major scale")).toBe(true);
    });

    it("identifies exactRoot match type when scaleRootNote is provided", () => {
        const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C major scale
        const cNote = getNoteFromNoteNumber(60); // C note
        const result = getMatchedScalesForAllRootNotes(midiNotes, cNote);
        const exactRootMatch = result.find((match) => match.matchType === "exactRoot");
        expect(exactRootMatch).toBeTruthy();
        expect(exactRootMatch?.scale?.rootNote?.name).toBe("C");
    });

    it("identifies nonRoot match type for non-root matches", () => {
        const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C major scale
        const dNote = getNoteFromNoteNumber(62); // D note (not the root)
        const result = getMatchedScalesForAllRootNotes(midiNotes, dNote);
        const nonRootMatch = result.find((match) => match.matchType === "nonRoot");
        expect(nonRootMatch).toBeTruthy();
    });

    it("returns empty array for empty input", () => {
        const result = getMatchedScalesForAllRootNotes([]);
        expect(result).toEqual([]);
    });
});

describe("getChordsInScale", () => {
    const majorScaleType = scaleTypes.find((st) => st.name === "major scale")!;
    const noteC = notes.find((n) => n.name === "C")!;
    const noteA = notes.find((n) => n.name === "A")!;
    const cMajorScale = new Scale({ scaleType: majorScaleType, rootNote: noteC });
    const aMinorScaleType = scaleTypes.find((st) => st.name === "natural minor scale")!;
    const aMinorScale = new Scale({ scaleType: aMinorScaleType, rootNote: noteA });

    it("returns empty array for a scale with no root note", () => {
        const result = getChordsInScale({} as Scale);
        expect(result).toEqual([]);
    });

    it("finds C major chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "C" && c.chordType?.name === "major")).toBe(true);
    });

    it("finds F major chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "F" && c.chordType?.name === "major")).toBe(true);
    });

    it("finds A minor chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "A" && c.chordType?.name === "minor")).toBe(true);
    });

    it("finds B dim chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "B" && c.chordType?.name === "dim")).toBe(true);
    });

    it("does not include C minor chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "C" && c.chordType?.name === "minor")).toBe(false);
    });

    it("does not include C# major chord in C major scale", () => {
        const result = getChordsInScale(cMajorScale);
        expect(result.some((c) => c.rootNote?.name === "C#" && c.chordType?.name === "major")).toBe(false);
    });

    it("only returns chords rooted on notes within the scale", () => {
        const result = getChordsInScale(cMajorScale);
        const scalePitchClasses = new Set([0, 2, 4, 5, 7, 9, 11]);
        const allRootsInScale = result.every((c) => c.rootNote && scalePitchClasses.has(c.rootNote.number));
        expect(allRootsInScale).toBe(true);
    });

    it("finds A minor chord in A natural minor scale", () => {
        const result = getChordsInScale(aMinorScale);
        expect(result.some((c) => c.rootNote?.name === "A" && c.chordType?.name === "minor")).toBe(true);
    });

    it("finds E minor chord in A natural minor scale", () => {
        const result = getChordsInScale(aMinorScale);
        expect(result.some((c) => c.rootNote?.name === "E" && c.chordType?.name === "minor")).toBe(true);
    });
});

describe("getScalesFromSelectedNotes", () => {
    it("returns empty array for empty input", () => {
        const result = getScalesFromSelectedNotes([]);
        expect(result).toEqual([]);
    });

    it("finds scale matches using lowest note as root", () => {
        const midiNotes = [60, 62, 64, 65, 67, 69, 71]; // C major scale
        const result = getScalesFromSelectedNotes(midiNotes);
        expect(result.length).toBeGreaterThan(0);
        expect(result.some((match) => match.scale?.scaleType?.name === "major scale")).toBe(true);
    });

    it("uses the lowest note number as the root note reference", () => {
        const midiNotes = [67, 60, 64, 65, 69, 71, 62]; // C major scale (unsorted)
        const result = getScalesFromSelectedNotes(midiNotes);
        const exactRootMatch = result.find((match) => match.matchType === "exactRoot");
        expect(exactRootMatch?.scale?.rootNote?.name).toBe("C"); // 60 is C and the lowest
    });

    it("finds minor scale matches", () => {
        const midiNotes = [60, 62, 63, 65, 67, 68, 70]; // C natural minor scale
        const result = getScalesFromSelectedNotes(midiNotes);
        expect(result.some((match) => match.scale?.scaleType?.name === "natural minor scale")).toBe(true);
    });

    it("handles single note input", () => {
        const midiNotes = [60];
        const result = getScalesFromSelectedNotes(midiNotes);
        // Single note won't match complete scales in this implementation
        expect(result.length).toBe(0);
    });
});
