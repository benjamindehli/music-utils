// Classes
import Chord from "../classes/Chord";
import Note from "../classes/Note";

// Helpers
import { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./noteHelpers";

// Data
import chordTypes from "../data/chordTypes";
import notes from "../data/notes";

/**
 * Gets the chord that matches the lowest note.
 *
 * @param matchedChords - An array of matched chords
 * @param lowestNote - The lowest note
 * @returns The chord that matches the lowest note, or undefined if none match
 */
function getLowestNoteMatchedChord(matchedChords: Chord[], lowestNote: Note | undefined): Chord | undefined {
    return matchedChords.find((chord) => chord.rootNote?.name === lowestNote?.name);
}

/**
 * Adds the chord with the lowest note as the root to the beginning of the matched chords array.
 *
 * @param matchedChords - An array of matched chords
 * @param lowestNoteChord - The chord with the lowest note as the root
 * @returns An array of matched chords with the lowest note chord first
 */
function addMatchWithLowestNoteAsRootFirst(matchedChords: Chord[], lowestNoteChord: Chord): Chord[] {
    matchedChords = matchedChords.filter((chord) => chord !== lowestNoteChord);
    matchedChords.unshift(lowestNoteChord);
    return matchedChords;
}

/**
 * Checks if the normalized relative notes match the chord half steps.
 *
 * @param normalizedRelativeNotes - An array of normalized relative note numbers
 * @param chordHalfSteps - An array of chord half steps
 * @returns A boolean indicating if the notes match the chord
 */
function isChordMatch(normalizedRelativeNotes: number[], chordHalfSteps: number[]): boolean {
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
 * Gets the chords that match the selected MIDI note numbers.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @param matchedChords - An array of already matched chords
 * @returns An array of matched chords
 */
function getMatchedChords(selectedNoteNumbers: number[], matchedChords: Chord[]): Chord[] {
    for (const rootNote of notes) {
        const relativeSelectedNotes = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNote.number));
        relativeSelectedNotes.sort((a, b) => a - b);
        const normalizedRelativeNotes = normalizeHalfSteps(relativeSelectedNotes);
        for (const chordType of chordTypes) {
            const chordHalfSteps = chordType.getParsedHalfSteps();
            if (isChordMatch(normalizedRelativeNotes, chordHalfSteps)) {
                matchedChords.push({
                    rootNote,
                    chordType
                });
            }
        }
    }
    return matchedChords;
}

/**
 * Gets the chords that match the selected MIDI note numbers.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @returns An array of matched chords
 */
export function getChordsFromSelectedNotes(selectedNoteNumbers: number[]): Chord[] {
    let matchedChords: Chord[] = [];

    if (selectedNoteNumbers.length === 0) {
        return matchedChords;
    }

    const lowestNoteNumber = Math.min(...selectedNoteNumbers);
    const normalizedLowestNote = normalizeHalfStep(lowestNoteNumber);
    const lowestNote = notes.find((note: Note) => note.number === normalizedLowestNote);
    matchedChords = getMatchedChords(selectedNoteNumbers, matchedChords);

    const lowestNoteChord = getLowestNoteMatchedChord(matchedChords, lowestNote);
    if (lowestNoteChord) {
        return addMatchWithLowestNoteAsRootFirst(matchedChords, lowestNoteChord);
    } else {
        const sortedNotes = [...selectedNoteNumbers].sort((a, b) => a - b);
        const minNote = sortedNotes[0];
        let selectedNotesWithoutLowest = [...sortedNotes];
        while (selectedNotesWithoutLowest.length > 0 && selectedNotesWithoutLowest[0] === minNote) {
            selectedNotesWithoutLowest.shift();
        }
        const matchedChordsWithoutLowest = getMatchedChords(selectedNotesWithoutLowest, []);
        return [...matchedChordsWithoutLowest, ...matchedChords];
    }
}
