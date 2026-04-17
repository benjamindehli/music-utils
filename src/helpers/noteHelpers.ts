import Note from "../classes/Note";
import notes from "../data/notes";

/**
 * Converts an absolute MIDI note number to a relative number based on a root note.
 * For example, if the root note is C (60), then C (60) would be 0, C# (61) would be 1, D (62) would be 2, etc.
 * If the note number is less than the root note number, it wraps around to the next octave.
 * For example, if the root note is C (60), then B (59) would be 11.
 *
 * @param noteNumber - The absolute MIDI note number
 * @param rootNoteNumber - The MIDI note number of the root note
 * @returns The relative note number within the octave
 */
export function getRelativeNoteNumber(noteNumber: number, rootNoteNumber: number): number {
    const relativeNumber = noteNumber - rootNoteNumber;
    if (relativeNumber < 0) {
        return ((relativeNumber % 12) + 12) % 12;
    }
    return relativeNumber;
}

/**
 * Converts a relative note number to a pitch class (0–11) based on a root note.
 * For example, if the root note is C (60), then 0 would be pitch class 0 (C), 1 would be 1 (C#), 2 would be 2 (D), etc.
 *
 * @param relativeNoteNumber - The relative note number within the octave
 * @param rootNoteNumber - The MIDI note number of the root note
 * @returns The pitch class (0–11) of the note that is relativeNoteNumber semitones above the root
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
    return ((noteNumber % 12) + 12) % 12;
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

/**
 * Gets the Note object corresponding to a given MIDI note number by normalizing it to a value between 0 and 11 and looking it up in the notes data.
 *
 * @param noteNumber - The absolute MIDI note number
 * @returns The Note object corresponding to the normalized MIDI note number, or undefined if not found
 */
export function getNoteFromNoteNumber(noteNumber: number): Note | undefined {
    const normalizedNoteNumber = normalizeHalfStep(noteNumber);
    return notes.find((note: Note) => note.number === normalizedNoteNumber);
}
