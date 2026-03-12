// Classes
import { normalizeHalfSteps } from "../helpers/noteHelpers.js";

// Data
import selectionTypes from "../data/selectionTypes.js";

/**
 * Class representing a musical note selection, which can be either a chord or a scale.
 * @class
 * @property {string} name - The name of the note selection (e.g., "maj7", "m7", "dim", "major scale", "minor scale", etc.)
 * @property {number[]} halfSteps - An array of half steps (0-11) that define the note selection
 * @property {string} type - The type of the note selection (e.g., "chord" or "scale")
 * @param {Object} props - The properties to initialize the note selection
 * @param {string} props.name - The name of the note selection
 * @param {number[]} props.halfSteps - An array of half steps (0-11) that define the note selection
 * @param {string} props.type - The type of the note selection (e.g., "chord" or "scale")
 *
 * @example
 * const majorChord = new NoteSelection({ name: "maj7", halfSteps: [0, 4, 7, 11, 14, 17], type: "chord" });
 * console.log(majorChord.name); // "maj7"
 * console.log(majorChord.halfSteps); // [0, 4, 7, 11, 14, 17]
 * console.log(majorChord.type); // "chord"
 * console.log(majorChord.getParsedHalfSteps(majorChord.halfSteps)); // [0, 2, 3, 5, 7, 10]
 */
export default class NoteSelection {
    constructor(props) {
        this.name = props?.name;
        this.halfSteps = props?.halfSteps || [];
        this.type = props?.type;
    }

    /**
     * Returns an array of normalized half steps (0-11) without duplicates, derived from the halfSteps property.
     * This is useful for matching the note selection against a set of notes, as it ensures that the half steps are in a consistent format and that duplicates are removed.
     * @returns {number[]} An array of normalized half steps (0-11) without duplicates
     */
    getParsedHalfSteps() {
        return normalizeHalfSteps(this.halfSteps);
    }

    _getSelectionType(selectionTypeValue) {
        return selectionTypes.find((selectionType) => selectionType.value === selectionTypeValue);
    }
}
