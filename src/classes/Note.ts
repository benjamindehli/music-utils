export interface NoteProps {
    name: string;
    number: number;
}

export default class Note {
    name: string;
    number: number;

    constructor(props: NoteProps) {
        this.name = props?.name;
        this.number = props?.number;
    }
}
