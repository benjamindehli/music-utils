// Classes
import Chord from "./classes/Chord";
import ChordMatch from "./classes/ChordMatch";
import ChordType from "./classes/ChordType";
import Interval from "./classes/Interval";
import Midi from "./classes/Midi";
import Note from "./classes/Note";
import NoteSelection from "./classes/NoteSelection";
import Scale from "./classes/Scale";
import ScaleMatch from "./classes/ScaleMatch";
import ScaleType from "./classes/ScaleType";

// Data
import chordTypes from "./data/chordTypes";
import intervals from "./data/intervals";
import notes from "./data/notes";
import scaleTypes from "./data/scaleTypes";

export { Chord, ChordMatch, ChordType, Interval, Midi, Note, NoteSelection, Scale, ScaleMatch, ScaleType, chordTypes, intervals, notes, scaleTypes };

// Helpers
export { getChordsFromSelectedNotes, getScalesFromSelectedNotes } from "./helpers/matchHelpers";
export { getAbsoluteNoteNumber, getNoteFromNoteNumber, getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps } from "./helpers/noteHelpers";
