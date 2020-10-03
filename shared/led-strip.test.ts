import { LedStrip } from "./led-strip";
import {Color, ColorDiff, LEDDiffs} from "../server/color";

const strip1 = [new Color(1, 2, 3)];
const strip2 = [new Color(1, 2, 3)];

test('Empty diffs are created and applied correctly', () => {
    const ledStripDiff = LedStrip.computeDiff(strip1, strip2);
    expect(Object.keys(ledStripDiff).length).toBe(0);
});

const strip3 = [new Color(1, 2, 3)];
const strip4 = [new Color(4, 2, 3)];

test('Single channel single LED diff', () => {
    const ledStripDiff = LedStrip.computeDiff(strip3, strip4);
    const colorDiff = strip3[0].getDiff(strip4[0]);

    expect(Object.keys(ledStripDiff).length).toBe(1);
    expect(Object.keys(colorDiff).length).toBe(1);

    expect(colorDiff.r).toBe(4);
    expect(colorDiff.g).toBe(undefined);
    expect(colorDiff.b).toBe(undefined);
    expect(colorDiff.w).toBe(undefined);

    expect(ledStripDiff[0].r).toBe(4);
    expect(ledStripDiff[0].g).toBe(undefined);
    expect(ledStripDiff[0].b).toBe(undefined);
    expect(ledStripDiff[0].w).toBe(undefined);
});

const strip5 = [new Color(1, 2, 3), new Color(4, 5, 6), new Color(7, 8, 9), new Color(10, 11, 12, 13)];
const strip6 = [new Color(1, 2, 3), new Color(4, 7, 6), new Color(9, 8, 7), new Color(10, 11, 12, 15)];

test('Getting some more complex cases with color diffs', () => {
    const colorDiff0 = strip5[0].getDiff(strip6[0]);
    const colorDiff1 = strip5[1].getDiff(strip6[1]);
    const colorDiff2 = strip5[2].getDiff(strip6[2]);
    const colorDiff3 = strip5[3].getDiff(strip6[3]);

    expect(Object.keys(colorDiff0).length).toBe(0);
    expect(Object.keys(colorDiff1).length).toBe(1);
    expect(Object.keys(colorDiff2).length).toBe(2);
    expect(Object.keys(colorDiff3).length).toBe(1);

    expect(colorDiff1.g).toBe(7);

    expect(colorDiff2.r).toBe(9);
    expect(colorDiff2.g).toBe(undefined);
    expect(colorDiff2.b).toBe(7);
});

test('Getting some more complex cases with LED strip diffs', () => {
    const stripDiff = LedStrip.computeDiff(strip5, strip6);

    expect(Object.keys(stripDiff).length).toBe(3);

    expect(stripDiff[0]).toBe(undefined);

    expect(stripDiff[1].r).toBe(undefined);
    expect(stripDiff[1].g).toBe(7);
    expect(stripDiff[1].b).toBe(undefined);

    expect(stripDiff[2].r).toBe(9);
    expect(stripDiff[2].g).toBe(undefined);
    expect(stripDiff[2].b).toBe(7);
    expect(stripDiff[2].w).toBe(undefined);

    expect(stripDiff[3].w).toBe(15);
});

const strip7 = [new Color(1, 2, 3), new Color(4, 5, 6), new Color(7, 8, 9)];

const rDiff: ColorDiff = {
    r: 11
}

const bDiff: ColorDiff = {
    b: 12
}

const allDiff: ColorDiff = {
    r: 13,
    g: 14,
    b: 15,
    w: 16,
}

test('Applying some diffs', () => {
    const newStrip1 = LedStrip.applyDiff(strip7, {0: rDiff});
    const newStrip2 = LedStrip.applyDiff(strip7, {0: bDiff});
    const newStrip3 = LedStrip.applyDiff(strip7, {0: allDiff});

    expect(strip7[0].r).toBe(1);
    expect(strip7[0].g).toBe(2);
    expect(strip7[0].b).toBe(3);
    expect(strip7[0].w).toBe(0);

    expect(newStrip1[0].r).toBe(11);
    expect(newStrip1[0].g).toBe(2);
    expect(newStrip1[0].b).toBe(3);
    expect(newStrip1[0].w).toBe(0);

    expect(newStrip2[0].r).toBe(1);
    expect(newStrip2[0].g).toBe(2);
    expect(newStrip2[0].b).toBe(12);

    expect(newStrip3[0].r).toBe(13);
    expect(newStrip3[0].g).toBe(14);
    expect(newStrip3[0].b).toBe(15);
    expect(newStrip3[0].w).toBe(16);
});
