import { secondsToHHMMSS } from "./formatters";


const SECONDS_CASES = [
    [10, '00:10'],
    [4001, '01:06'],
];
describe("seconds to human time formatter", () => {
    it.each(SECONDS_CASES)("shows us the right time given the right amount of seconds", (seconds, expectedString) => {
        expect(secondsToHHMMSS(seconds)).toBe(expectedString);
    });
});