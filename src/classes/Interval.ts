export interface IntervalProps {
    name: string;
    fullName?: string;
    number: number;
}

export default class Interval {
    name: string;
    fullName: string;
    number: number;

    constructor(props: IntervalProps) {
        this.name = props?.name;
        this.fullName = props?.fullName || "";
        this.number = props?.number;
    }
}
