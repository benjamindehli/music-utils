import NoteSelection, { NoteSelectionProps, SelectionType } from "./NoteSelection";

/**
 * Class representing a musical scale type, which is a type of note selection.
 */
export default class ScaleType extends NoteSelection {
    type: SelectionType | undefined;

    constructor(props: NoteSelectionProps) {
        super(props);
        this.type = this._getSelectionType("scale");
    }
}
