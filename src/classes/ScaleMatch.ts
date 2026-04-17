import Scale from "./Scale";

export type MatchType = "exactRoot" | "nonRoot";

export default class ScaleMatch {
    scale: Scale | undefined;
    matchType: MatchType | undefined;

    constructor(props: { scale: Scale; matchType: MatchType }) {
        this.scale = props.scale;
        this.matchType = props.matchType;
    }
}
