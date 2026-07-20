import ChordType from "./ChordType";
import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";
import { getSpelledNotes } from "../helpers/spellingHelpers";

/**
 * Class representing a musical chord, which is a type of note selection.
 */
export default class Chord {
    chordType: ChordType | undefined;
    rootNote: Note | undefined;
    bassNote: Note | undefined;

    constructor(props: { chordType: NoteSelectionProps, rootNote: Note, bassNote?: Note }) {
        this.chordType = new ChordType(props?.chordType);
        this.rootNote = props?.rootNote ? new Note(props?.rootNote) : undefined;
        this.bassNote = props?.bassNote ? new Note(props?.bassNote) : undefined;
    }

    /**
     * Returns the chord's notes with correct enharmonic spelling relative to the
     * root, e.g. an F minor chord returns F Ab C rather than F G# C. The root
     * keeps its given spelling; only the remaining notes are respelled to fit.
     */
    getNotes(): Note[] {
        if (this.rootNote === undefined || this.chordType === undefined) return [];
        return getSpelledNotes(this.rootNote.number, this.chordType.halfSteps, this.rootNote.name);
    }
}
