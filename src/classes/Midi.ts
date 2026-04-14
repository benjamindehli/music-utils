export type MidiMessageHandler = () => void;

interface WebMidiInput {
    onmidimessage: MidiMessageHandler | null;
}

interface WebMidiInputMap {
    values(): IterableIterator<WebMidiInput>;
}

interface WebMidiAccess {
    readonly inputs: WebMidiInputMap;
}

interface WebMidiNavigator {
    requestMIDIAccess(): Promise<WebMidiAccess>;
}

/**
 * Class representing MIDI access and handling MIDI messages.
 */
export default class Midi {
    /**
     * Initializes MIDI access and sets up the MIDI message handler.
     * @param midiMessageHandler - A callback function that will be called whenever a MIDI message is received. This function should accept a single parameter, which will be the MIDI message event.
     */
    init(midiMessageHandler: MidiMessageHandler): void {
        if (globalThis.window === undefined) {
            console.warn("MIDI is not supported in this environment.");
            return;
        }

        const nav = navigator as unknown as WebMidiNavigator;
        if (nav.requestMIDIAccess) {
            (async () => {
                try {
                    const midiAccess = await nav.requestMIDIAccess();
                    this.onMidiSuccess(midiAccess, midiMessageHandler);
                } catch (error) {
                    console.error("Error accessing MIDI devices:", error);
                }
            })();
        } else {
            console.warn("Web MIDI API is not supported in this browser.");
        }
    }

    /**
     * Sets up the MIDI message handler for all available MIDI input devices.
     * @param midiAccess - The MIDI access object obtained from the Web MIDI API.
     * @param midiMessageHandler - A callback function that will be called whenever a MIDI message is received.
     */
    onMidiSuccess(midiAccess: WebMidiAccess, midiMessageHandler: MidiMessageHandler): void {
        for (const input of midiAccess.inputs.values()) {
            input.onmidimessage = midiMessageHandler;
        }
    }
}
