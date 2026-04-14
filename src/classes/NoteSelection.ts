import { normalizeHalfSteps } from "../helpers/noteHelpers";
import selectionTypes from "../data/selectionTypes";

export interface NoteSelectionProps {
    name: string;
    halfSteps: number[];
}

export interface SelectionType {
    label: string;
    value: string;
}

/**
 * Class representing a musical note selection, which can be either a chord or a scale.
 */
export default class NoteSelection {
    name: string;
    halfSteps: number[];

    constructor(props: NoteSelectionProps) {
        this.name = props?.name;
        this.halfSteps = props?.halfSteps || [];
    }

    /**
     * Returns an array of normalized half steps (0-11) without duplicates, derived from the halfSteps property.
     */
    getParsedHalfSteps(): number[] {
        return normalizeHalfSteps(this.halfSteps);
    }

    _getSelectionType(selectionTypeValue: string): SelectionType | undefined {
        return selectionTypes.find((selectionType: SelectionType) => selectionType.value === selectionTypeValue);
    }
}
