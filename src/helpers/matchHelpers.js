// Helpers
import { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./noteHelpers.js";

// Data
import chords from "../data/chords.js";
import notes from "../data/notes.js";

/**
 *
 * @param {Object[]} matchedChords - An array of matched chord objects
 * @param {string} lowestNoteName - The name of the lowest note
 * @returns {Object|undefined} The matched chord object with the lowest note as root, or undefined if not found
 */
function getLowestNoteMatchedChord(matchedChords, lowestNoteName) {
    return matchedChords.find((chord) => chord.root === lowestNoteName);
}

/**
 *
 * @param {Object[]} matchedChords - An array of matched chord objects
 * @param {Object} lowestNoteChord - The matched chord object with the lowest note as root
 * @returns {Object[]} The updated array of matched chord objects with the lowest note chord first
 */
function addMatchWithLowestNoteAsRootFirst(matchedChords, lowestNoteChord) {
    matchedChords = matchedChords.filter((chord) => chord !== lowestNoteChord);
    matchedChords.unshift(lowestNoteChord);
    return matchedChords;
}

/**
 *
 * @param {number[]} normalizedRelativeNotes - An array of normalized relative notes (0-11)
 * @param {number[]} chordHalfSteps - An array of chord half steps (0-11)
 * @returns {boolean} True if the normalized relative notes match the chord half steps, false otherwise
 */
function isChordMatch(normalizedRelativeNotes, chordHalfSteps) {
    if (normalizedRelativeNotes.length !== chordHalfSteps.length) {
        return false;
    }
    for (let i = 0; i < chordHalfSteps.length; i++) {
        if (normalizedRelativeNotes[i] !== chordHalfSteps[i]) {
            return false;
        }
    }
    return true;
}

/**
 *
 * @param {number[]} selectedNoteNumbers - An array of selected MIDI note numbers
 * @param {Object[]} matchedChords - An array of matched chord objects
 * @returns {Object[]} The updated array of matched chord objects
 */
function getMatchedChords(selectedNoteNumbers, matchedChords) {
    for (const rootNote of notes) {
        const relativeSelectedNotes = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNote.number));
        relativeSelectedNotes.sort((a, b) => a - b);
        const normalizedRelativeNotes = normalizeHalfSteps(relativeSelectedNotes);
        for (const chord of chords) {
            const chordHalfSteps = chord.getParsedHalfSteps();
            if (isChordMatch(normalizedRelativeNotes, chordHalfSteps)) {
                matchedChords.push({
                    root: rootNote.name,
                    chord
                });
            }
        }
    }
    return matchedChords;
}

/**
 *
 * @param {number[]} selectedNoteNumbers - An array of selected MIDI note numbers
 * @returns {Object[]} An array of matched chord objects based on the selected notes, with the lowest note chord first if applicable
 */
export function getChordsFromSelectedNotes(selectedNoteNumbers) {
    let matchedChords = [];

    if (selectedNoteNumbers.length === 0) {
        return matchedChords;
    }

    const lowestNoteNumber = Math.min(...selectedNoteNumbers);
    const normalizedLowestNote = normalizeHalfStep(lowestNoteNumber);
    const lowestNote = notes.find((note) => note.number === normalizedLowestNote);
    matchedChords = getMatchedChords(selectedNoteNumbers, matchedChords);

    const lowestNoteChord = getLowestNoteMatchedChord(matchedChords, lowestNote.name);
    if (lowestNoteChord) {
        return addMatchWithLowestNoteAsRootFirst(matchedChords, lowestNoteChord);
    } else {
        // Get chords without the *lowest* note(s) only
        const sortedNotes = [...selectedNoteNumbers].sort((a, b) => a - b);
        const minNote = sortedNotes[0];
        let selectedNotesWithoutLowest = [...sortedNotes];

        // Remove only the *lowest* note(s)
        while (selectedNotesWithoutLowest.length > 0 && selectedNotesWithoutLowest[0] === minNote) {
            selectedNotesWithoutLowest.shift();
        }

        // Then find chords from the remaining notes
        const matchedChordsWithoutLowest = getMatchedChords(selectedNotesWithoutLowest, []).map((chordMatch) => ({
            root: chordMatch.root,
            chord: `${chordMatch.chord} / ${lowestNote.name}`
        }));

        return [...matchedChordsWithoutLowest, ...matchedChords];
    }
}
