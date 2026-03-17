// Helpers
import { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./noteHelpers";

// Data
import Note from "../classes/Note";
import chords from "../data/chords";
import notes from "../data/notes";

export interface MatchedChord {
    root: string;
    chord: any;
}

/**
 * Gets the chord that matches the lowest note.
 *
 * @param matchedChords - An array of matched chords
 * @param lowestNote - The lowest note
 * @returns The chord that matches the lowest note, or undefined if none match
 */
function getLowestNoteMatchedChord(matchedChords: MatchedChord[], lowestNote: Note | undefined): MatchedChord | undefined {
    return matchedChords.find((chord) => chord.root === lowestNote?.name);
}

/**
 * Adds the chord with the lowest note as the root to the beginning of the matched chords array.
 *
 * @param matchedChords - An array of matched chords
 * @param lowestNoteChord - The chord with the lowest note as the root
 * @returns An array of matched chords with the lowest note chord first
 */
function addMatchWithLowestNoteAsRootFirst(matchedChords: MatchedChord[], lowestNoteChord: MatchedChord): MatchedChord[] {
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
function getMatchedChords(selectedNoteNumbers: number[], matchedChords: MatchedChord[]): MatchedChord[] {
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
 * Gets the chords that match the selected MIDI note numbers.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @returns An array of matched chords
 */
export function getChordsFromSelectedNotes(selectedNoteNumbers: number[]): MatchedChord[] {
    let matchedChords: MatchedChord[] = [];

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
