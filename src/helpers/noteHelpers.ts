/**
 * Helper functions for working with notes
 */
export function getRelativeNoteNumber(noteNumber: number, keyNoteNumber: number): number {
    let relativeNumber = noteNumber - keyNoteNumber;
    if (relativeNumber < 0) {
        relativeNumber += 12;
    }
    return relativeNumber;
}

export function normalizeHalfStep(noteNumber: number): number {
    return noteNumber % 12;
}

export function normalizeHalfSteps(halfSteps: number[]): number[] {
    return [...new Set(halfSteps.map(normalizeHalfStep))].sort((a, b) => a - b);
}
