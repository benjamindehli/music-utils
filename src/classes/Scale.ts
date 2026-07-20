import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";
import ScaleType from "./ScaleType";
import { getSpelledNotes } from "../helpers/spellingHelpers";

/**
 * Class representing a musical scale, which is a type of note selection.
 */
export default class Scale {
    scaleType: ScaleType | undefined;
    rootNote: Note | undefined;

    constructor(props: { scaleType: NoteSelectionProps; rootNote: Note }) {
        this.scaleType = new ScaleType(props.scaleType);
        this.rootNote = new Note(props.rootNote);
        // Re-spell the tonic with correct enharmonics for this scale, so the root
        // of pitch class 6 reads "Gb" for a major scale but "F#" for a minor one.
        if (this.rootNote !== undefined && this.scaleType !== undefined) {
            const [spelledRoot] = getSpelledNotes(this.rootNote.number, this.scaleType.halfSteps);
            if (spelledRoot !== undefined) this.rootNote = spelledRoot;
        }
    }

    /**
     * Returns the scale's notes with correct enharmonic spelling (using flats or
     * sharps as the key requires), e.g. an F major scale returns F G A Bb C D E.
     * The first note matches `rootNote`, which is spelled with the fewest accidentals.
     */
    getNotes(): Note[] {
        if (this.rootNote === undefined || this.scaleType === undefined) return [];
        return getSpelledNotes(this.rootNote.number, this.scaleType.halfSteps, this.rootNote.name);
    }
}
