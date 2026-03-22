/**
 * Converts an absolute MIDI note number to a relative number based on a key.
 * For example, if the key is C (60), then C (60) would be 0, C# (61) would be 1, D (62) would be 2, etc.
 * If the note number is less than the key note number, it wraps around to the next octave.
 * For example, if the key is C (60), then B (59) would be 11.
 *
 * @param noteNumber - The absolute MIDI note number
 * @param keyNoteNumber - The MIDI note number of the key
 * @returns The relative note number within the octave
 */
export function getRelativeNoteNumber(noteNumber: number, keyNoteNumber: number): number {
    let relativeNumber = noteNumber - keyNoteNumber;
    if (relativeNumber < 0) {
        relativeNumber += 12;
    }
    return relativeNumber;
}

/**
 * Converts a relative note number to an absolute MIDI note number based on a root note.
 * For example, if the root note is C (60), then 0 would be C (60), 1 would be C# (61), 2 would be D (62), etc.
 *
 * @param relativeNoteNumber - The relative note number within the octave
 * @param rootNoteNumber - The MIDI note number of the root note
 * @returns The absolute MIDI note number
 */
export function getAbsoluteNoteNumber(relativeNoteNumber: number, rootNoteNumber: number): number {
    return (rootNoteNumber + relativeNoteNumber) % 12;
}

/**
 * Normalizes a MIDI note number to a value between 0 and 11.
 * For example, C4 (60) would return 0, C#4 (61) would return 1, D4 (62) would return 2, etc.
 *
 * @param noteNumber - The absolute MIDI note number
 * @returns The normalized note number within the octave
 */
export function normalizeHalfStep(noteNumber: number): number {
    return noteNumber % 12;
}

/**
 * Normalizes an array of MIDI note numbers to their corresponding half steps (0-11), removes duplicates, and sorts them.
 *
 * @param halfSteps - An array of absolute MIDI note numbers
 * @returns An array of unique, sorted half steps corresponding to the input MIDI note numbers
 */
export function normalizeHalfSteps(halfSteps: number[]): number[] {
    return [...new Set(halfSteps.map(normalizeHalfStep))].sort((a, b) => a - b);
}
