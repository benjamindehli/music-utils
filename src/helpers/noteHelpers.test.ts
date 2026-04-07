import { getAbsoluteNoteNumber, getNoteFromNoteNumber, getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./noteHelpers";

describe("noteHelpers", () => {
    describe("getRelativeNoteNumber", () => {
        it("returns correct relative note number when noteNumber >= keyNoteNumber", () => {
            expect(getRelativeNoteNumber(64, 60)).toBe(4);
            expect(getRelativeNoteNumber(72, 60)).toBe(12);
        });
        it("returns correct relative note number when noteNumber < keyNoteNumber", () => {
            expect(getRelativeNoteNumber(59, 60)).toBe(11);
            expect(getRelativeNoteNumber(60, 61)).toBe(11);
        });
    });

    describe("getAbsoluteNoteNumber", () => {
        it("returns correct absolute note number within octave", () => {
            expect(getAbsoluteNoteNumber(0, 60)).toBe(0); // C
            expect(getAbsoluteNoteNumber(1, 60)).toBe(1); // C#
            expect(getAbsoluteNoteNumber(11, 60)).toBe(11); // B
            expect(getAbsoluteNoteNumber(12, 60)).toBe(0); // C (wraps)
            expect(getAbsoluteNoteNumber(13, 60)).toBe(1); // C# (wraps)
        });
    });

    describe("normalizeHalfStep", () => {
        it("returns the note number modulo 12", () => {
            expect(normalizeHalfStep(60)).toBe(0);
            expect(normalizeHalfStep(61)).toBe(1);
            expect(normalizeHalfStep(71)).toBe(11);
            expect(normalizeHalfStep(72)).toBe(0);
        });
    });

    describe("getNoteFromNoteNumber", () => {
        it("returns the correct Note object for a given MIDI note number", () => {
            const noteC = getNoteFromNoteNumber(60);
            expect(noteC).toBeDefined();
            expect(noteC?.name).toBe("C");
            const noteG = getNoteFromNoteNumber(67);
            expect(noteG).toBeDefined();
            expect(noteG?.name).toBe("G");
        });
    });

    describe("normalizeHalfSteps", () => {
        it("returns normalized half steps without duplicates, sorted", () => {
            expect(normalizeHalfSteps([60, 61, 72, 73, 60])).toEqual([0, 1]);
            expect(normalizeHalfSteps([71, 59, 83])).toEqual([11]);
            expect(normalizeHalfSteps([60, 62, 64, 65, 67, 69, 71])).toEqual([0, 2, 4, 5, 7, 9, 11]);
        });
        it("returns an empty array for empty input", () => {
            expect(normalizeHalfSteps([])).toEqual([]);
        });
    });
});
