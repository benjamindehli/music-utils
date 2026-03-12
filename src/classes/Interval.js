/**
 * Represents a musical interval, which is the distance between two pitches.
 * @class
 * @property {string} name - The name of the interval (e.g., "m2", "M2", "m3", "M3", etc.)
 * @property {number} number - The number of semitones in the interval (0-12)
 * @param {Object} props - The properties to initialize the interval
 * @param {string} props.name - The name of the interval
 * @param {number} props.number - The number of semitones in the interval (0-12)
 *
 * @example
 * const m2Interval = new Interval({ name: "m2", number: 1 });
 * console.log(m2Interval.name); // "m2"
 * console.log(m2Interval.number); // 1
 */
export default class Interval {
    constructor(props) {
        this.name = props?.name;
        this.number = props?.number;
    }
}
