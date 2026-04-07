import Chord from "./Chord";

export type MatchType = "exactRoot" | "invertedRoot" | "nonRoot" | "slashChord";

export default class ChordMatch {
    chord: Chord | undefined;
    matchType: MatchType | undefined;

    constructor(props: { chord: Chord; matchType: MatchType }) {
        this.chord = props.chord;
        this.matchType = props.matchType;
    }
}
