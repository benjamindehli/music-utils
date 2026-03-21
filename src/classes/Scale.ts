import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";
import ScaleType from "./ScaleType";

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
}
