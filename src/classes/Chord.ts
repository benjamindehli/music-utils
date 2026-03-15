import NoteSelection, { NoteSelectionProps, SelectionType } from "./NoteSelection";

/**
 * Class representing a musical chord, which is a type of note selection.
 */
export default class Chord extends NoteSelection {
    type: SelectionType | undefined;

    constructor(props: NoteSelectionProps) {
        super(props);
        this.type = this._getSelectionType("chord");
    }
}
