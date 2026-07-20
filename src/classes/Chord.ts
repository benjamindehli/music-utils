import ChordType from "./ChordType";
import Note from "./Note";
import { NoteSelectionProps } from "./NoteSelection";
import { getSpelledNotes } from "../helpers/spellingHelpers";

/**
 * Class representing a musical chord, which is a type of note selection.
 */
export default class Chord {
    chordType: ChordType | undefined;
    rootNote: Note | undefined;
    bassNote: Note | undefined;

    constructor(props: { chordType: NoteSelectionProps, rootNote: Note, bassNote?: Note }) {
        this.chordType = new ChordType(props?.chordType);
        this.rootNote = props?.rootNote ? new Note(props?.rootNote) : undefined;
        this.bassNote = props?.bassNote ? new Note(props?.bassNote) : undefined;

        // Re-spell the root with correct enharmonics for this chord, e.g. an Eb
        // minor chord reads "Eb", not "D#".
        if (this.rootNote !== undefined && this.chordType !== undefined) {
            const [spelledRoot] = getSpelledNotes(this.rootNote.number, this.chordType.halfSteps);
            if (spelledRoot !== undefined) this.rootNote = spelledRoot;
        }

        // Spell the slash-chord bass note relative to the (respelled) root so it
        // agrees with the chord, e.g. a Gb chord's bass reads "Bb", not "A#".
        if (this.bassNote !== undefined && this.rootNote !== undefined) {
            const offset = (((this.bassNote.number - this.rootNote.number) % 12) + 12) % 12;
            const spelled = offset === 0 ? [this.rootNote] : getSpelledNotes(this.rootNote.number, [0, offset], this.rootNote.name);
            const spelledBass = spelled.find((note) => note.number === this.bassNote!.number);
            if (spelledBass !== undefined) this.bassNote = new Note({ name: spelledBass.name, number: this.bassNote.number });
        }
    }

    /**
     * Returns the chord's notes with correct enharmonic spelling relative to the
     * root, e.g. an F minor chord returns F Ab C rather than F G# C. The first
     * note matches `rootNote`.
     */
    getNotes(): Note[] {
        if (this.rootNote === undefined || this.chordType === undefined) return [];
        return getSpelledNotes(this.rootNote.number, this.chordType.halfSteps, this.rootNote.name);
    }
}
