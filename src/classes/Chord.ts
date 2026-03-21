import ChordType from "./ChordType";
import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";

/**
 * Class representing a musical chord, which is a type of note selection.
 */
export default class Chord {
    chordType: ChordType | undefined;
    rootNote: Note | undefined;

    constructor(props: { chordType: NoteSelectionProps, rootNote: Note }) {
        this.chordType = new ChordType(props.chordType);
        this.rootNote = new Note(props.rootNote);
    }
}
