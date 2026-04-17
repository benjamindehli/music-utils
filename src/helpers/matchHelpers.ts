// Classes
import Chord from "../classes/Chord";
import ChordMatch from "../classes/ChordMatch";
import Note from "../classes/Note";
import Scale from "../classes/Scale";
import ScaleMatch from "../classes/ScaleMatch";

// Helpers
import { getNoteFromNoteNumber, getRelativeNoteNumber, normalizeHalfSteps } from "./noteHelpers";

// Data
import chordTypes from "../data/chordTypes";
import notes from "../data/notes";
import scaleTypes from "../data/scaleTypes";

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
    return chordHalfSteps.every((step, i) => normalizedRelativeNotes[i] === step);
}

/**
 * Gets the chords that match the selected MIDI note numbers for a specific root note.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @param rootNoteNumber - The MIDI note number of the root note to check against
 * @returns An array of matched chords for the specified root note
 */
function getMatchedChordsForRootNote(selectedNoteNumbers: number[], rootNoteNumber: number): Chord[] {
    const matchedChords: Chord[] = [];
    const relativeSelectedNoteNumbers = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNoteNumber));
    const rootNote = getNoteFromNoteNumber(rootNoteNumber);
    relativeSelectedNoteNumbers.sort((a, b) => a - b);

    for (const chordType of chordTypes) {
        const chordHalfSteps = chordType?.halfSteps;
        if (rootNote && isChordMatch(relativeSelectedNoteNumbers, chordHalfSteps)) {
            matchedChords.push(
                new Chord({
                    rootNote,
                    chordType
                })
            );
        }
    }
    return matchedChords;
}

/**
 * Gets the chords that match the selected MIDI note numbers for a specific root note, including inversions.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @param rootNoteNumber - The MIDI note number of the root note to check against
 * @returns An array of matched chords for the specified root note, including inversions
 */
export function getMatchedInversionsForRootNote(selectedNoteNumbers: number[], rootNoteNumber: number): Chord[] {
    const matchedChords: Chord[] = [];
    const relativeSelectedNoteNumbers = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNoteNumber));
    const normalizedRelativeNoteNumbers = normalizeHalfSteps(relativeSelectedNoteNumbers);
    const rootNote = getNoteFromNoteNumber(rootNoteNumber);
    for (const chordType of chordTypes) {
        const chordHalfSteps = chordType?.getParsedHalfSteps();
        if (rootNote && isChordMatch(normalizedRelativeNoteNumbers, chordHalfSteps)) {
            matchedChords.push(
                new Chord({
                    rootNote,
                    chordType
                })
            );
        }
    }
    return matchedChords;
}

/**
 * Gets the chords that match the selected MIDI note numbers for all root notes except the specified one, and optionally includes a bass note.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @param rootNoteToExclude - The root note to exclude from the matching process
 * @param bassNoteToInclude - An optional bass note to include in the matched chords
 * @returns An array of matched chords for all root notes except the specified one, with an optional bass note included
 */
export function getMatchedInversionsForAllRootNotes(selectedNoteNumbers: number[], rootNoteToExclude?: Note, bassNoteToInclude?: Note): Chord[] {
    const matchedChords: Chord[] = [];
    for (const rootNote of notes) {
        if (rootNote.number === rootNoteToExclude?.number) {
            continue;
        }
        const relativeSelectedNoteNumbers = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNote.number));
        const normalizedRelativeNoteNumbers = normalizeHalfSteps(relativeSelectedNoteNumbers);
        for (const chordType of chordTypes) {
            const chordHalfSteps = chordType?.getParsedHalfSteps();
            if (isChordMatch(normalizedRelativeNoteNumbers, chordHalfSteps)) {
                matchedChords.push(
                    new Chord({
                        rootNote,
                        bassNote: bassNoteToInclude,
                        chordType
                    })
                );
            }
        }
    }
    return matchedChords;
}

/**
 * Gets the lowest MIDI note number from an array of note numbers.
 *
 * @param noteNumbers - An array of absolute MIDI note numbers
 * @returns The lowest MIDI note number
 */
export function getLowestNoteNumber(noteNumbers: number[]): number {
    return Math.min(...noteNumbers);
}

/**
 * Gets the MIDI note number of the highest bass note in the selected notes.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @returns The MIDI note number of the highest bass note, which is the lowest note number that is repeated in octaves without other notes in between
 */
export function getHighestBassNoteNumber(selectedNoteNumbers: number[]): number {
    // This should be the same note as the lowest note number, but may be in a different octave. It's the highest if the lowest note is repeated multiple times in octaves, without other notes in between. For example if the selected notes are [52, 64, 69, 70, 73, 76]; the lowest note number is 52, but the highest bass note number is 64, because 52 is repeated in octaves at 64 and 76. But only because there are no other notes between 52 and 64. If the selected notes were [52, 60, 64, 69, 70, 73, 76], then the highest bass note number would be 52, because there is a different note (60) between the repeated 52s.
    const lowestNoteNumber = getLowestNoteNumber(selectedNoteNumbers);
    const sortedNotes = [...selectedNoteNumbers].sort((a, b) => a - b);
    let highestBassNoteNumber = lowestNoteNumber;
    for (const noteNumber of sortedNotes) {
        if (noteNumber === highestBassNoteNumber) {
            highestBassNoteNumber += 12;
        } else {
            break;
        }
    }
    return highestBassNoteNumber - 12;
}

/**
 * Removes notes that are in different octaves than the selected note.
 *
 * @param noteNumbers - An array of absolute MIDI note numbers
 * @param selectedNoteNumber - The MIDI note number to compare octaves with
 * @returns An array of MIDI note numbers with notes in different octaves removed
 */
export function removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber(noteNumbers: number[], selectedNoteNumber: number): number[] {
    // Remove notes that are octaves of the selected note (same pitch class, different octave), keep selected note and all others
    const selectedPitchClass = selectedNoteNumber % 12;
    return noteNumbers.filter((noteNumber) => noteNumber === selectedNoteNumber || noteNumber % 12 !== selectedPitchClass);
}

/**
 * Gets the chords that match the selected MIDI note numbers, including exact root matches, inverted root matches, non-root matches, and slash chord matches.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @returns An array of ChordMatch objects representing the matched chords and their match types
 */
export function getChordsFromSelectedNotes(selectedNoteNumbers: number[]): ChordMatch[] {
    if (selectedNoteNumbers.length === 0) {
        return [];
    }
    let matchedChords: ChordMatch[] = [];

    const highestBassNoteNumber = getHighestBassNoteNumber(selectedNoteNumbers);
    const highestBassNote = getNoteFromNoteNumber(highestBassNoteNumber);
    const selectedNoteNumbersWithoutOtherOctavesOfHighestBassNote = removeNotesNumbersInDifferentOctavesThanSelectedNoteNumber(
        selectedNoteNumbers,
        highestBassNoteNumber
    );

    const matchedChordsForRootNote = getMatchedChordsForRootNote(selectedNoteNumbersWithoutOtherOctavesOfHighestBassNote, highestBassNoteNumber);
    let matchedInversionsForRootNote = getMatchedInversionsForRootNote(
        selectedNoteNumbersWithoutOtherOctavesOfHighestBassNote,
        highestBassNoteNumber
    );

    // Filter out inversions that are the same chord type as the matched chords for the root note, to avoid duplicates.
    matchedInversionsForRootNote = matchedInversionsForRootNote.filter(
        (inversion) => !matchedChordsForRootNote.some((chord) => chord.chordType?.name === inversion.chordType?.name)
    );

    const matchedInversionsForOtherRootNotes = getMatchedInversionsForAllRootNotes(
        selectedNoteNumbersWithoutOtherOctavesOfHighestBassNote,
        highestBassNote
    );

    const noteNumbersWithoutLowestNote = selectedNoteNumbersWithoutOtherOctavesOfHighestBassNote.filter(
        (noteNumber) => noteNumber !== highestBassNoteNumber
    );
    const matchedChordsWithoutLowestNote = getMatchedInversionsForAllRootNotes(noteNumbersWithoutLowestNote, highestBassNote, highestBassNote);

    matchedChordsForRootNote.forEach((chord) => matchedChords.push(new ChordMatch({ chord, matchType: "exactRoot" })));
    matchedInversionsForRootNote.forEach((chord) => matchedChords.push(new ChordMatch({ chord, matchType: "invertedRoot" })));
    matchedInversionsForOtherRootNotes.forEach((chord) => matchedChords.push(new ChordMatch({ chord, matchType: "nonRoot" })));
    matchedChordsWithoutLowestNote.forEach((chord) => matchedChords.push(new ChordMatch({ chord, matchType: "slashChord" })));

    return matchedChords;
}

/**
 * Gets the scales that match the selected MIDI note numbers, including exact root matches and non-root matches.
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @param scaleRootNote - The root note of the scale to match against
 * @returns An array of ScaleMatch objects representing the matched scales and their match types
 */
export function getMatchedScalesForAllRootNotes(selectedNoteNumbers: number[], scaleRootNote?: Note): ScaleMatch[] {
    const matchedScales: ScaleMatch[] = [];
    for (const rootNote of notes) {
        const relativeSelectedNoteNumbers = selectedNoteNumbers.map((noteNumber) => getRelativeNoteNumber(noteNumber, rootNote.number));
        const normalizedRelativeNoteNumbers = normalizeHalfSteps(relativeSelectedNoteNumbers);
        for (const scaleType of scaleTypes) {
            const scaleHalfSteps = scaleType?.getParsedHalfSteps();
            const isExactRoot = scaleRootNote && rootNote?.number === scaleRootNote?.number % 12;
            if (isChordMatch(normalizedRelativeNoteNumbers, scaleHalfSteps)) {
                matchedScales.push(
                    new ScaleMatch({
                        matchType: isExactRoot ? "exactRoot" : "nonRoot",
                        scale: new Scale({
                            rootNote,
                            scaleType
                        })
                    })
                );
            }
        }
    }
    return matchedScales;
}

/**
 *
 * @param selectedNoteNumbers - An array of absolute MIDI note numbers
 * @returns An array of ScaleMatch objects representing the matched scales and their match types
 */
export function getScalesFromSelectedNotes(selectedNoteNumbers: number[]): ScaleMatch[] {
    if (selectedNoteNumbers.length === 0) {
        return [];
    }
    const lowestNoteNumber = getLowestNoteNumber(selectedNoteNumbers);
    const rootNote = getNoteFromNoteNumber(lowestNoteNumber);
    const matchedScales = getMatchedScalesForAllRootNotes(selectedNoteNumbers, rootNote);
    return matchedScales;
}
