# @benjamindehli/music-utils

A TypeScript/JavaScript library for music theory utilities and chord detection from MIDI note input.

## Features

- Detect chord names from MIDI note input
- Music theory classes: Chord, Interval, Note, Scale, Midi, NoteSelection
- Data modules for chords, intervals, notes, scales, selection types
- Helper functions for matching and note normalization
- Deep import support for optimized usage and tree-shaking
- TypeScript type definitions included

## Installation

```bash
yarn add @benjamindehli/music-utils
# or
npm install @benjamindehli/music-utils
```

## Usage

### Top-level import

```js
import { Midi, getChordsFromSelectedNotes } from '@benjamindehli/music-utils';

const midi = new Midi();
midi.init(handleMIDIMessage);

const detectedChord = getChordsFromSelectedNotes([60, 64, 67]);
```

### Deep imports

```js
import Chord from '@benjamindehli/music-utils/classes/Chord';
import chords from '@benjamindehli/music-utils/data/chords';
import { getChordsFromSelectedNotes } from '@benjamindehli/music-utils/helpers/matchHelpers';
```

## API Overview

- **Classes**: Chord, Interval, Midi, Note, NoteSelection, Scale
- **Data**: chords, intervals, notes, scales, selectionTypes
- **Helpers**: getChordsFromSelectedNotes, getRelativeNoteNumber, normalizeHalfStep, normalizeHalfSteps

## TypeScript Support

All exports include type definitions for seamless TypeScript integration.
