export interface IntervalProps {
    name: string;
    number: number;
}

export default class Interval {
    name: string;
    number: number;

    constructor(props: IntervalProps) {
        this.name = props?.name;
        this.number = props?.number;
    }
}
