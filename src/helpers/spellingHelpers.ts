import Note from "../classes/Note";
import { normalizeHalfSteps } from "./noteHelpers";

/**
 * Enharmonic note spelling.
 *
 * A pitch class (0–11) has several valid names (e.g. 10 = "A#" = "Bb"). The
 * correct one depends on musical context: in a diatonic scale each letter A–G
 * is used exactly once, and every note's letter is fixed by its interval above
 * the tonic. These helpers spell the notes of a scale or chord accordingly, so
 * an F major scale reads "F G A Bb C D E" rather than "... A# ...".
 */

// Letters in ascending order from C, with the pitch class of each natural.
const LETTER_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_PITCHES = [0, 2, 4, 5, 7, 9, 11];

// A spelling never uses more than a double sharp / double flat.
const MAX_ACCIDENTAL = 2;

interface SpelledLetter {
    letterIndex: number;
    alt: number; // accidental offset: negative = flats, positive = sharps
}

/**
 * The accidental offset needed to name `targetPitchClass` with a given letter,
 * chosen as the smallest magnitude (so 11 spelled as "C" is -1, not +11).
 */
function altForLetter(letterIndex: number, targetPitchClass: number): number {
    let alt = (targetPitchClass - LETTER_PITCHES[letterIndex]) % 12;
    if (alt > 6) alt -= 12;
    if (alt < -6) alt += 12;
    return alt;
}

/** Formats a letter + accidental offset as a note name, e.g. (6, -1) → "Gb". */
function formatNoteName(letterIndex: number, alt: number): string {
    const letter = LETTER_NAMES[letterIndex];
    if (alt > 0) return letter + "#".repeat(alt);
    if (alt < 0) return letter + "b".repeat(-alt);
    return letter;
}

/**
 * Parses a note name such as "Bb" or "F#" into a letter + accidental offset.
 * Returns undefined if the name is not a recognized letter.
 */
export function parseNoteName(name: string): SpelledLetter | undefined {
    const letterIndex = LETTER_NAMES.indexOf(name?.[0]?.toUpperCase());
    if (letterIndex === -1) return undefined;
    const accidentals = name.slice(1);
    let alt = 0;
    for (const char of accidentals) {
        if (char === "#") alt += 1;
        else if (char === "b" || char === "B") alt -= 1;
    }
    return { letterIndex, alt };
}

/** All letter spellings of a pitch class within +/- a double accidental. */
function getCandidateTonics(pitchClass: number): SpelledLetter[] {
    const candidates: SpelledLetter[] = [];
    for (let letterIndex = 0; letterIndex < 7; letterIndex++) {
        const alt = altForLetter(letterIndex, pitchClass);
        if (Math.abs(alt) <= MAX_ACCIDENTAL) candidates.push({ letterIndex, alt });
    }
    return candidates;
}

/**
 * Assigns a letter to each pitch class.
 *
 * For a heptatonic set (7 notes) the letters run consecutively from the tonic —
 * this yields the textbook spelling where each of A–G appears once. Otherwise a
 * greedy pass picks, for each note, the still-unused letter with the smallest
 * accidental (preferring flats on ties), which keeps spellings distinct and
 * simple for pentatonic, chord, and other non-heptatonic shapes.
 */
function assignLetters(tonic: SpelledLetter, pitchClasses: number[]): SpelledLetter[] {
    const count = pitchClasses.length;

    if (count === 7) {
        return pitchClasses.map((pitchClass, degree) => {
            const letterIndex = (tonic.letterIndex + degree) % 7;
            return { letterIndex, alt: altForLetter(letterIndex, pitchClass) };
        });
    }

    const result: SpelledLetter[] = [{ letterIndex: tonic.letterIndex, alt: tonic.alt }];
    const usedLetters = new Set<number>([tonic.letterIndex]);

    for (let i = 1; i < count; i++) {
        const pitchClass = pitchClasses[i];
        let best: SpelledLetter | undefined;
        // First choice: an unused letter. Fall back to any letter if we have
        // more notes than letters (e.g. a chromatic-ish chord).
        for (const allowReuse of [false, true]) {
            for (let letterIndex = 0; letterIndex < 7; letterIndex++) {
                if (!allowReuse && usedLetters.has(letterIndex)) continue;
                const alt = altForLetter(letterIndex, pitchClass);
                if (!best || Math.abs(alt) < Math.abs(best.alt) || (Math.abs(alt) === Math.abs(best.alt) && alt < best.alt)) {
                    best = { letterIndex, alt };
                }
            }
            if (best) break;
        }
        usedLetters.add(best!.letterIndex);
        result.push(best!);
    }

    return result;
}

/** A spelling is worse the more accidentals it uses; double accidentals are heavily penalized. */
function scoreSpelling(spelling: SpelledLetter[]): number {
    return spelling.reduce((total, { alt }) => total + Math.abs(alt) + (Math.abs(alt) >= MAX_ACCIDENTAL ? 100 : 0), 0);
}

/**
 * Spells the notes of a scale or chord defined by half steps above a root.
 *
 * @param rootPitchClass - Pitch class (0–11) of the root
 * @param halfSteps - Interval offsets that define the scale/chord (may exceed 12)
 * @param preferredRootName - Optional explicit spelling of the root (e.g. "Gb").
 *   When omitted, the tonic spelling that minimizes overall accidentals is chosen,
 *   so pitch class 6 as a major scale becomes "Gb", and 10 becomes "Bb".
 * @returns Correctly spelled Note objects, in ascending interval order
 */
export function getSpelledNotes(rootPitchClass: number, halfSteps: number[], preferredRootName?: string): Note[] {
    const offsets = normalizeHalfSteps(halfSteps);
    if (offsets.length === 0) return [];
    const pitchClasses = offsets.map((offset) => (rootPitchClass + offset) % 12);

    const preferredTonic = preferredRootName ? parseNoteName(preferredRootName) : undefined;
    const candidateTonics =
        preferredTonic && altForLetter(preferredTonic.letterIndex, rootPitchClass) === preferredTonic.alt
            ? [preferredTonic]
            : getCandidateTonics(rootPitchClass);

    let best: { spelling: SpelledLetter[]; score: number; tonicAlt: number } | undefined;
    for (const tonic of candidateTonics) {
        const spelling = assignLetters(tonic, pitchClasses);
        const score = scoreSpelling(spelling);
        // Lower score wins; on a tie prefer the flatter tonic (e.g. Gb over F#).
        if (!best || score < best.score || (score === best.score && tonic.alt < best.tonicAlt)) {
            best = { spelling, score, tonicAlt: tonic.alt };
        }
    }

    return best!.spelling.map(({ letterIndex, alt }, i) => new Note({ name: formatNoteName(letterIndex, alt), number: pitchClasses[i] }));
}
