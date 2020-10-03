import { Color } from "./color";

const strip1 = [new Color(1, 2, 3)];
const strip2 = [new Color(1, 2, 3)];

test('Empty diffs are created and applied correctly', () => {
    const colorDiff = strip1[0].getDiff(strip2[0]);
    expect(Object.keys(colorDiff).length).toBe(0);
});

const strip3 = [new Color(1, 2, 3)];
const strip4 = [new Color(4, 2, 3)];

test('Single channel single LED diff', () => {
    const colorDiff = strip3[0].getDiff(strip4[0]);

    expect(Object.keys(colorDiff).length).toBe(1);

    expect(colorDiff.r).toBe(4);
    expect(colorDiff.g).toBe(undefined);
    expect(colorDiff.b).toBe(undefined);
    expect(colorDiff.w).toBe(undefined);
});
