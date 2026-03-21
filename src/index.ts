// Classes
import Chord from "./classes/Chord";
import ChordType from "./classes/ChordType";
import Interval from "./classes/Interval";
import Midi from "./classes/Midi";
import NoteSelection from "./classes/NoteSelection";
import Scale from "./classes/Scale";
import ScaleType from "./classes/ScaleType";

// Data
import chordTypes from "./data/chordTypes";
import intervals from "./data/intervals";
import notes from "./data/notes";
import scaleTypes from "./data/scaleTypes";

export { Chord, ChordType, Interval, Midi, NoteSelection, Scale, ScaleType, chordTypes, intervals, notes, scaleTypes };

export { getChordsFromSelectedNotes } from "./helpers/matchHelpers";
export { getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./helpers/noteHelpers";
