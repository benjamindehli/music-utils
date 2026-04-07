import ChordType from "./ChordType";
import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";

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
}
