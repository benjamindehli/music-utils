# @benjamindehli/music-utils

Music theory utilities for detecting chords and scales from MIDI note input. Zero dependencies.

## Installation

```sh
npm install @benjamindehli/music-utils
```

## Quick start

```ts
import { getChordsFromSelectedNotes, getScalesFromSelectedNotes } from "@benjamindehli/music-utils";

// Detect chords from held MIDI notes (C, E, G = C major)
const chords = getChordsFromSelectedNotes([60, 64, 67]);
// → [ChordMatch { chord: Chord { rootNote: C, chordType: major }, matchType: "exactRoot" }, ...]

// Detect scales from held MIDI notes (C major scale)
const scales = getScalesFromSelectedNotes([60, 62, 64, 65, 67, 69, 71]);
// → [ScaleMatch { scale: Scale { rootNote: C, scaleType: "major scale" }, matchType: "exactRoot" }, ...]
```

## Chord detection

### `getChordsFromSelectedNotes(noteNumbers)`

Takes an array of absolute MIDI note numbers and returns all matching chords, ranked by match quality.

```ts
import { getChordsFromSelectedNotes } from "@benjamindehli/music-utils";

const results = getChordsFromSelectedNotes([60, 64, 67]); // C, E, G

for (const { chord, matchType } of results) {
    console.log(`${chord.rootNote?.name} ${chord.chordType?.name} (${matchType})`);
    // "C major (exactRoot)"
}
```

Each result is a `ChordMatch` with a `matchType` that describes how the notes relate to the chord:

| `matchType` | Description |
|---|---|
| `exactRoot` | Notes match the chord exactly, with the root as the lowest note |
| `invertedRoot` | Notes match the chord, but in an inversion |
| `nonRoot` | Notes match a chord type rooted on a different note |
| `slashChord` | Notes match a chord with an explicit bass note (e.g. C/E) |

**Slash chords** include a `bassNote` on the `chord` object:

```ts
const results = getChordsFromSelectedNotes([64, 67, 72]); // E, G, C
const slash = results.find((r) => r.matchType === "slashChord");

console.log(slash?.chord.bassNote?.name); // "E"
// → C/E
```

## Scale detection

### `getScalesFromSelectedNotes(noteNumbers)`

Takes an array of absolute MIDI note numbers and returns all matching scales.

```ts
import { getScalesFromSelectedNotes } from "@benjamindehli/music-utils";

const results = getScalesFromSelectedNotes([60, 62, 64, 65, 67, 69, 71]); // C major

for (const { scale, matchType } of results) {
    console.log(`${scale.rootNote?.name} ${scale.scaleType?.name} (${matchType})`);
    // "C major scale (exactRoot)"
}
```

`matchType` is either `"exactRoot"` (the lowest note is the scale root) or `"nonRoot"`.

## Web MIDI integration

The `Midi` class wraps the Web MIDI API and wires up your message handler to all connected devices.

```ts
import { Midi, getChordsFromSelectedNotes } from "@benjamindehli/music-utils";

const midi = new Midi();
const heldNotes = new Set<number>();

midi.init((event: MIDIMessageEvent) => {
    const [status, note, velocity] = event.data;
    const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
    const isNoteOff = (status & 0xf0) === 0x80 || ((status & 0xf0) === 0x90 && velocity === 0);

    if (isNoteOn) heldNotes.add(note);
    if (isNoteOff) heldNotes.delete(note);

    const chords = getChordsFromSelectedNotes([...heldNotes]);
    console.log(chords);
});
```

## API reference

### Helper functions

| Function | Description |
|---|---|
| `getChordsFromSelectedNotes(noteNumbers)` | Detect chords from MIDI note numbers |
| `getScalesFromSelectedNotes(noteNumbers)` | Detect scales from MIDI note numbers |
| `getNoteFromNoteNumber(noteNumber)` | Look up a `Note` object from a MIDI note number |
| `normalizeHalfStep(noteNumber)` | Reduce a MIDI note number to a pitch class (0–11) |
| `normalizeHalfSteps(noteNumbers)` | Reduce an array to unique, sorted pitch classes (0–11) |
| `getRelativeNoteNumber(noteNumber, rootNoteNumber)` | Get semitone distance from a root note |
| `getAbsoluteNoteNumber(relativeNoteNumber, rootNoteNumber)` | Convert a relative interval back to a pitch class |

### Classes

#### `ChordMatch`

| Property | Type | Description |
|---|---|---|
| `chord` | `Chord` | The matched chord |
| `matchType` | `"exactRoot" \| "invertedRoot" \| "nonRoot" \| "slashChord"` | How the notes relate to the chord |

#### `Chord`

| Property | Type | Description |
|---|---|---|
| `rootNote` | `Note` | The chord's root note |
| `chordType` | `ChordType` | The chord quality (major, minor7, etc.) |
| `bassNote` | `Note \| undefined` | The bass note for slash chords |

#### `ScaleMatch`

| Property | Type | Description |
|---|---|---|
| `scale` | `Scale` | The matched scale |
| `matchType` | `"exactRoot" \| "nonRoot"` | Whether the lowest note is the scale root |

#### `Scale`

| Property | Type | Description |
|---|---|---|
| `rootNote` | `Note` | The scale's root note |
| `scaleType` | `ScaleType` | The scale type (major scale, dorian mode, etc.) |

#### `Note`

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Note name, e.g. `"C"`, `"C#"` |
| `number` | `number` | Pitch class 0–11 |

#### `NoteSelection` (base for `ChordType` / `ScaleType`)

| Property | Type | Description |
|---|---|---|
| `name` | `string` | e.g. `"major"`, `"natural minor scale"` |
| `halfSteps` | `number[]` | Semitone intervals that define the chord or scale |
| `getParsedHalfSteps()` | `() => number[]` | Returns normalized (0–11), deduplicated, sorted half steps |

### Data

The library ships with pre-built arrays you can import directly:

```ts
import { chordTypes, scaleTypes, notes, intervals } from "@benjamindehli/music-utils";
```

| Export | Count | Description |
|---|---|---|
| `chordTypes` | 130 | `ChordType[]` — triads, sevenths, ninths, extended, altered, suspended, slash, and more |
| `scaleTypes` | 60+ | `ScaleType[]` — modes, pentatonics, blues, bebop, exotic/world scales |
| `notes` | 12 | `Note[]` — chromatic notes C through B (pitch classes 0–11) |
| `intervals` | 26 | `Interval[]` — P1 through A15, each with semitone count and full name |

## Deep imports

All modules are individually accessible for tree-shaking in environments that need it:

```ts
import Chord from "@benjamindehli/music-utils/classes/Chord";
import { getChordsFromSelectedNotes } from "@benjamindehli/music-utils/helpers/matchHelpers";
import chordTypes from "@benjamindehli/music-utils/data/chordTypes";
```

Available paths: `classes/Chord`, `classes/ChordType`, `classes/Interval`, `classes/Midi`, `classes/Note`, `classes/NoteSelection`, `classes/Scale`, `classes/ScaleType`, `classes/SelectionType`, `data/chordTypes`, `data/intervals`, `data/notes`, `data/scaleTypes`, `data/selectionTypes`, `helpers/matchHelpers`, `helpers/noteHelpers`.

## Formats

Ships as both ESM and CommonJS. Node.js and bundlers pick the right format automatically.

## Support the project

- [Ko-fi](https://ko-fi.com/benjamindehli)
- [Dehli Musikk store](https://store.dehlimusikk.no/coffee)
