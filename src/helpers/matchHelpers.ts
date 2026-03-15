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

function getLowestNoteMatchedChord(matchedChords: MatchedChord[], lowestNote: Note | undefined): MatchedChord | undefined {
    return matchedChords.find((chord) => chord.root === lowestNote?.name);
}

function addMatchWithLowestNoteAsRootFirst(matchedChords: MatchedChord[], lowestNoteChord: MatchedChord): MatchedChord[] {
    matchedChords = matchedChords.filter((chord) => chord !== lowestNoteChord);
    matchedChords.unshift(lowestNoteChord);
    return matchedChords;
}

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
