// Classes
import Chord from "./classes/Chord";
import Midi from "./classes/Midi";
import NoteSelection from "./classes/NoteSelection";
import Scale from "./classes/Scale";

// Data
import chords from "./data/chords";
import notes from "./data/notes";
import scales from "./data/scales";

export { chords, scales, notes, Midi, Chord, Scale, NoteSelection };

export { getChordsFromSelectedNotes } from "./helpers/matchHelpers";
export { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./helpers/noteHelpers";
