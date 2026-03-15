import NoteSelection, { NoteSelectionProps, SelectionType } from "./NoteSelection";

/**
 * Class representing a musical scale, which is a type of note selection.
 */
export default class Scale extends NoteSelection {
    type: SelectionType | undefined;

    constructor(props: NoteSelectionProps) {
        super(props);
        this.type = this._getSelectionType("scale");
    }
}
