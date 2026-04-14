import {
    getChordsFromSelectedNotes,
    getHighestBassNoteNumber,
    getMatchedInversionsForAllRootNotes,
    getMatchedInversionsForRootNote,
    removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber
} from "./matchHelpers";

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
