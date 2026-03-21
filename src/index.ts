// Classes
import ChordType from "./classes/ChordType";
import Interval from "./classes/Interval";
import Midi from "./classes/Midi";
import NoteSelection from "./classes/NoteSelection";
import Scale from "./classes/Scale";

// Data
import chords from "./data/chords";
import intervals from "./data/intervals";
import notes from "./data/notes";
import scales from "./data/scales";

export { ChordType, Interval, Midi, NoteSelection, Scale, chords, intervals, notes, scales };

export { getChordsFromSelectedNotes } from "./helpers/matchHelpers";
export { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./helpers/noteHelpers";
