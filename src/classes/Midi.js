/**
 * Class representing MIDI access and handling MIDI messages.
 * @class
 */
export default class Midi {
    /**
     * Initializes MIDI access and sets up the MIDI message handler.
     * @param {function} midiMessageHandler - A callback function that will be called whenever a MIDI message is received. This function should accept a single parameter, which will be the MIDI message event.
     */
    init(midiMessageHandler) {
        if (globalThis.window === undefined) {
            console.warn("MIDI is not supported in this environment.");
            return;
        }

        if (navigator.requestMIDIAccess) {
            (async () => {
                try {
                    const midiAccess = await navigator.requestMIDIAccess();
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
     * @param {WebMidi.MIDIAccess} midiAccess - The MIDI access object obtained from the Web MIDI API.
     * @param {function} midiMessageHandler - A callback function that will be called whenever a MIDI message is received. This function should accept a single parameter, which will be the MIDI message event.
     *
     * This method sets up the MIDI message handler for all available MIDI input devices. It iterates through all MIDI inputs and assigns the provided `midiMessageHandler` function to handle incoming MIDI messages. Whenever a MIDI message is received from any of the connected MIDI devices, the `midiMessageHandler` will be invoked with the message event as its argument.
     */
    onMidiSuccess(midiAccess, midiMessageHandler) {
        const inputs = midiAccess.inputs.values();
        for (let input of inputs) {
            input.onmidimessage = midiMessageHandler;
        }
    }
}
