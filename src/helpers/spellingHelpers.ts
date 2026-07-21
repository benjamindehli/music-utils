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

export type SpellingKind = "chord" | "scale";

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

/** Number of set bits in a mask (used to count how many letters are assigned). */
function countBits(mask: number): number {
    let count = 0;
    while (mask) {
        mask &= mask - 1;
        count++;
    }
    return count;
}

/**
 * The functional degree of each chord tone, expressed as a letter offset (0–6)
 * from the root so the note lands on the right letter: root → +0, 3rd → +2,
 * 5th → +4, 7th → +6, 9th → +1, 11th → +3, 13th → +5.
 *
 * Semitones that could be more than one degree are resolved by which other tones
 * are present, which is what makes the spelling theoretically correct rather than
 * merely low on accidentals: 8 semitones is a #5 (so A augmented is "A C# E#",
 * not "A C# F") when there is no perfect 5th, but a ♭13 when there is; 6 semitones
 * is a ♭5 without a perfect 5th but a #11 with one; 3 semitones is a #9 alongside
 * a major 3rd but a ♭3 otherwise; 9 semitones is a ♭♭7 inside a diminished seventh
 * but a 13th otherwise.
 */
function chordLetterSteps(offsets: number[]): number[] {
    const has = (semitone: number) => offsets.includes(semitone);
    return offsets.map((semitone) => {
        switch (semitone) {
            case 0:
                return 0; // root
            case 1:
                return 1; // ♭9
            case 2:
                return 1; // 9
            case 3:
                return has(4) ? 1 : 2; // #9 alongside a major 3rd, else ♭3
            case 4:
                return 2; // 3rd
            case 5:
                return 3; // 11
            case 6:
                return has(7) ? 3 : 4; // #11 alongside a perfect 5th, else ♭5
            case 7:
                return 4; // 5th
            case 8:
                return has(7) ? 5 : 4; // ♭13 alongside a perfect 5th, else #5
            case 9:
                return has(3) && has(6) && !has(7) && !has(10) && !has(11) ? 6 : 5; // ♭♭7 in a dim7, else 13
            case 10:
                return 6; // ♭7
            case 11:
                return 6; // 7
            default:
                return 0;
        }
    });
}

/**
 * Spells a chord by placing each tone on its functional-degree letter (see
 * `chordLetterSteps`). Two alterations of the same degree deliberately share a
 * letter — a ♭9 and #9 both sit on the 9th, spelled e.g. "Db" and "D#" — which is
 * the theoretically correct reading and avoids a spurious "Fbb".
 */
function spellChordByDegree(tonic: SpelledLetter, pitchClasses: number[], chordSteps: number[]): SpelledLetter[] {
    return pitchClasses.map((pitchClass, note) => {
        const letterIndex = (tonic.letterIndex + chordSteps[note]) % 7;
        return { letterIndex, alt: altForLetter(letterIndex, pitchClass) };
    });
}

/**
 * Cost of naming each note (row) with each of the seven letters (column), used by
 * the scale assignment DP. Accidentals dominate; ties break toward consecutive
 * letters from the tonic. Letters beyond a double accidental are disallowed.
 */
function buildScaleCost(tonic: SpelledLetter, pitchClasses: number[]): number[][] {
    return pitchClasses.map((pitchClass) =>
        Array.from({ length: 7 }, (_, letterIndex) => {
            const alt = altForLetter(letterIndex, pitchClass);
            if (Math.abs(alt) > MAX_ACCIDENTAL) return Infinity;
            const step = (letterIndex - tonic.letterIndex + 7) % 7;
            return Math.abs(alt) * 8 + step;
        })
    );
}

/** A heptatonic scale takes consecutive letters from the tonic (each of A–G once). */
function consecutiveSpelling(tonic: SpelledLetter, pitchClasses: number[]): SpelledLetter[] {
    return pitchClasses.map((pitchClass, degree) => {
        const letterIndex = (tonic.letterIndex + degree) % 7;
        return { letterIndex, alt: altForLetter(letterIndex, pitchClass) };
    });
}

/**
 * Assigns a distinct letter A–G to each pitch class by minimizing `letterCost`
 * over a small dynamic program (128 states, one per set of used letters). Note 0
 * is the tonic and keeps its spelling. Searching globally rather than greedily is
 * what keeps an assignment from backing into a needless double accidental. Sets
 * with more than seven notes (or with no distinct assignment) fall back to a
 * per-note cheapest-letter pass, reusing letters where unavoidable.
 */
function assignLetters(tonic: SpelledLetter, pitchClasses: number[], letterCost: number[][]): SpelledLetter[] {
    const count = pitchClasses.length;

    if (count <= 7) {
        const size = 1 << 7;
        const tonicBit = 1 << tonic.letterIndex;
        const dp = new Array<number>(size).fill(Infinity);
        const chosenLetter = new Array<number>(size).fill(-1);
        dp[tonicBit] = 0;

        for (let mask = 0; mask < size; mask++) {
            if (dp[mask] === Infinity) continue;
            const noteIndex = countBits(mask); // note 0 (tonic) already counted by tonicBit
            if (noteIndex >= count) continue;
            for (let letterIndex = 0; letterIndex < 7; letterIndex++) {
                if (mask & (1 << letterIndex)) continue;
                const stepCost = letterCost[noteIndex][letterIndex];
                if (stepCost === Infinity) continue;
                const nextMask = mask | (1 << letterIndex);
                if (dp[mask] + stepCost < dp[nextMask]) {
                    dp[nextMask] = dp[mask] + stepCost;
                    chosenLetter[nextMask] = letterIndex;
                }
            }
        }

        // Cheapest complete assignment, then walk the chosen letters back.
        let bestMask = -1;
        for (let mask = 0; mask < size; mask++) {
            if (countBits(mask) === count && dp[mask] < Infinity && (bestMask === -1 || dp[mask] < dp[bestMask])) {
                bestMask = mask;
            }
        }

        if (bestMask !== -1) {
            const lettersByNote: number[] = [];
            for (let mask = bestMask; countBits(mask) > 1; mask &= ~(1 << chosenLetter[mask])) {
                lettersByNote.push(chosenLetter[mask]);
            }
            lettersByNote.reverse(); // notes 1..count-1, in order
            const result: SpelledLetter[] = [{ letterIndex: tonic.letterIndex, alt: tonic.alt }];
            for (let i = 1; i < count; i++) {
                const letterIndex = lettersByNote[i - 1];
                result.push({ letterIndex, alt: altForLetter(letterIndex, pitchClasses[i]) });
            }
            return result;
        }
    }

    // Fallback (more notes than letters, or no distinct assignment fits): pick
    // the cheapest letter per note, allowing a letter to be reused.
    const result: SpelledLetter[] = [{ letterIndex: tonic.letterIndex, alt: tonic.alt }];
    for (let i = 1; i < count; i++) {
        let bestLetter = 0;
        let bestCost = Infinity;
        for (let letterIndex = 0; letterIndex < 7; letterIndex++) {
            if (letterCost[i][letterIndex] < bestCost) {
                bestCost = letterCost[i][letterIndex];
                bestLetter = letterIndex;
            }
        }
        result.push({ letterIndex: bestLetter, alt: altForLetter(bestLetter, pitchClasses[i]) });
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
 * @param kind - Whether to spell as a "chord" (letters follow functional degrees —
 *   stacked thirds) or a "scale" (letters follow consecutive steps). Defaults to
 *   "chord".
 * @returns Correctly spelled Note objects, in ascending interval order
 */
export function getSpelledNotes(rootPitchClass: number, halfSteps: number[], preferredRootName?: string, kind: SpellingKind = "chord"): Note[] {
    const offsets = normalizeHalfSteps(halfSteps);
    if (offsets.length === 0) return [];
    const pitchClasses = offsets.map((offset) => (rootPitchClass + offset) % 12);

    const preferredTonic = preferredRootName ? parseNoteName(preferredRootName) : undefined;
    const candidateTonics =
        preferredTonic && altForLetter(preferredTonic.letterIndex, rootPitchClass) === preferredTonic.alt
            ? [preferredTonic]
            : getCandidateTonics(rootPitchClass);

    const chordSteps = kind === "chord" ? chordLetterSteps(offsets) : [];

    const spellFor = (tonic: SpelledLetter): SpelledLetter[] => {
        if (kind === "chord") return spellChordByDegree(tonic, pitchClasses, chordSteps);
        if (pitchClasses.length === 7) return consecutiveSpelling(tonic, pitchClasses);
        return assignLetters(tonic, pitchClasses, buildScaleCost(tonic, pitchClasses));
    };

    let best: { spelling: SpelledLetter[]; rootAlt: number; score: number; tonicAlt: number } | undefined;
    for (const tonic of candidateTonics) {
        const spelling = spellFor(tonic);
        const rootAlt = Math.abs(tonic.alt);
        const score = scoreSpelling(spelling);
        // A chord/scale is named from its root, so keep the root's own spelling as
        // simple as possible first (never "B#" for pitch class 0); then use the
        // fewest accidentals overall; then prefer the flatter tonic (Gb over F#).
        if (
            !best ||
            rootAlt < best.rootAlt ||
            (rootAlt === best.rootAlt && score < best.score) ||
            (rootAlt === best.rootAlt && score === best.score && tonic.alt < best.tonicAlt)
        ) {
            best = { spelling, rootAlt, score, tonicAlt: tonic.alt };
        }
    }

    return best!.spelling.map(({ letterIndex, alt }, i) => new Note({ name: formatNoteName(letterIndex, alt), number: pitchClasses[i] }));
}
