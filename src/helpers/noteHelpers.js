/**
 * Helper functions for working with notes
 * @param {number} noteNumber - The MIDI note number
 * @param {number} keyNoteNumber - The MIDI note number of the key
 * @returns {number} The relative note number (0-11) based on the key
 */
export function getRelativeNoteNumber(noteNumber, keyNoteNumber) {
    let relativeNumber = noteNumber - keyNoteNumber;
    if (relativeNumber < 0) {
        relativeNumber += 12;
    }
    return relativeNumber;
}

/**
 *
 * @param {number} noteNumber - The MIDI note number
 * @returns {number} The normalized half step (0-11)
 */
export function normalizeHalfStep(noteNumber) {
    return noteNumber % 12;
}

/**
 *
 * @param {number[]} halfSteps - An array of MIDI note numbers
 * @returns {number[]} An array of normalized half steps (0-11) without duplicates
 */
export function normalizeHalfSteps(halfSteps) {
    return [...new Set(halfSteps.map(normalizeHalfStep))].sort((a, b) => a - b);
}
