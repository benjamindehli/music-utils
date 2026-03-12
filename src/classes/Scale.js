// Classes
import NoteSelection from "./NoteSelection.js";

/**
 * Class representing a musical scale, which is a type of note selection.
 * @class
 * @property {string} name - The name of the scale (e.g., "major scale", "minor scale", etc.)
 * @property {number[]} halfSteps - An array of half steps (0-11) that define the scale
 * @property {string} type - The type of the note selection (e.g., "scale")
 * @param {Object} props - The properties to initialize the scale
 * @param {string} props.name - The name of the scale
 * @param {number[]} props.halfSteps - An array of half steps (0-11) that define the scale
 */
export default class Scale extends NoteSelection {
    constructor(props) {
        super(props);
        this.type = this._getSelectionType("scale");
    }
}
