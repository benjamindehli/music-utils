// Classes
import NoteSelection from "./NoteSelection.js";

/**
 * Class representing a musical chord, which is a type of note selection.
 * @class
 * @property {string} name - The name of the chord (e.g., "maj7", "m7", "dim", etc.)
 * @property {number[]} halfSteps - An array of half steps (0-11) that define the chord
 * @property {string} type - The type of the note selection (e.g., "chord")
 * @param {Object} props - The properties to initialize the chord
 * @param {string} props.name - The name of the chord
 * @param {number[]} props.halfSteps - An array of half steps (0-11) that define the chord
 *
 * @example
 * const majorChord = new Chord({ name: "maj7", halfSteps: [0, 4, 7, 11] });
 * console.log(majorChord.name); // "maj7"
 * console.log(majorChord.halfSteps); // [0, 4, 7, 11]
 * console.log(majorChord.type); // "chord"
 * console.log(majorChord.getParsedHalfSteps(majorChord.halfSteps)); // [0, 2, 3, 5, 7, 10]
 */
export default class Chord extends NoteSelection {
    constructor(props) {
        super(props);
        this.type = this._getSelectionType("chord");
    }
}
