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
    }

    /**
     * Returns the scale's notes with correct enharmonic spelling (using flats or
     * sharps as the key requires), e.g. an F major scale returns F G A Bb C D E.
     * The tonic is spelled with the fewest accidentals, so pitch class 6 as a
     * major scale reads "Gb" rather than "F#".
     */
    getNotes(): Note[] {
        if (this.rootNote === undefined || this.scaleType === undefined) return [];
        return getSpelledNotes(this.rootNote.number, this.scaleType.halfSteps);
    }
}
