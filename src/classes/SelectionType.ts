export interface SelectionTypeProps {
    label: string;
    value: string;
}

export default class SelectionType {
    label: string;
    value: string;

    constructor(props: SelectionTypeProps) {
        this.label = props?.label;
        this.value = props?.value;
    }
}
