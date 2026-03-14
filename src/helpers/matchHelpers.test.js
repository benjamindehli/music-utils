import { getChordsFromSelectedNotes } from "./matchHelpers.js";

describe("getChordsFromSelectedNotes", () => {
    it("returns empty array for empty input", () => {
        expect(getChordsFromSelectedNotes([])).toEqual([]);
    });

    it("identifies a C major chord", () => {
        // C major: C (60), E (64), G (67)
        const midiNotes = [60, 64, 67];
        const result = getChordsFromSelectedNotes(midiNotes);
        // Should include C major as the first match
        expect(result[0]).toMatchObject({
            root: "C",
            chord: {
                name: "major",
                halfSteps: [0, 4, 7]
            }
        });
    });

    it("identifies an E minor chord", () => {
        // E minor: E (64), G (67), B (71)
        const midiNotes = [64, 67, 71];
        const result = getChordsFromSelectedNotes(midiNotes);
        expect(result[0]).toMatchObject({
            root: "E",
            chord: {
                name: "minor",
                halfSteps: [0, 3, 7]
            }
        });
    });

    it("puts lowest note chord first if present", () => {
        // C major in first inversion: E (64), G (67), C (72)
        const midiNotes = [64, 67, 72];
        const result = getChordsFromSelectedNotes(midiNotes);
        // E is the lowest note, so E chord should be first if present
        expect(result[0].root).toBe("E");
    });

    it("returns slash chords if no root match", () => {
        // C major with lowest note not matching a root: G (67), C (72), E (76)
        const midiNotes = [67, 72, 76];
        const result = getChordsFromSelectedNotes(midiNotes);
        // Should include slash chords (e.g., "major / G")
        expect(result.some((chord) => chord.chord.includes("/ G"))).toBe(true);
    });

    it("handles repeated notes", () => {
        // C major with repeated C: C (60), E (64), G (67), C (72)
        const midiNotes = [60, 64, 67, 72];
        const result = getChordsFromSelectedNotes(midiNotes);
        expect(result[0]).toMatchObject({
            root: "C",
            chord: {
                name: "major",
                halfSteps: [0, 4, 7]
            }
        });
    });
});
