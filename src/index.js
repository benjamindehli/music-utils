// Classes
import Chord from "./classes/Chord.js";
import Midi from "./classes/Midi.js";
import NoteSelection from "./classes/NoteSelection.js";
import Scale from "./classes/Scale.js";

// Data
import chords from "./data/chords.js";
import notes from "./data/notes.js";
import scales from "./data/scales.js";

export { chords, scales, notes, Midi, Chord, Scale, NoteSelection };

export { getChordsFromSelectedNotes } from "./helpers/matchHelpers.js";
export { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./helpers/noteHelpers.js";
