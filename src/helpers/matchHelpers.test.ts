import { getChordsFromSelectedNotes } from "./matchHelpers";

describe("getChordsFromSelectedNotes", () => {
    it("returns empty array for empty input", () => {
        expect(getChordsFromSelectedNotes([])).toEqual([]);
    });

    it("identifies a C major chord", () => {
        // C major: C (60), E (64), G (67)
        const midiNotes = [60, 64, 67];
        const result = getChordsFromSelectedNotes(midiNotes);
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
        expect(result[0].root).toBe("E");
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
