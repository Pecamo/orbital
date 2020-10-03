import {LEDDiffs, LEDStrip} from "../server/color";

export class LedStrip {
    static computeDiff(colors: LEDStrip, colorsNext: LEDStrip): LEDDiffs {
        const result = {};
        for (let i = 0; i < colors.length; i++) {
            if (!colors[i].isEqual(colorsNext[i])) {
                result[i] = colors[i].getDiff(colorsNext[i])
            }
        }
        return result;
    }

    static applyDiff(colors: LEDStrip, diffs: LEDDiffs) {
        const result = [...colors];
        for (const [pos, diff] of Object.entries(diffs)) {
            result[pos] = colors[pos].applyDiff(diff);
        }
        return result;
    }
}
