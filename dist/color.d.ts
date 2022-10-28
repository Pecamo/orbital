export declare class Color {
    r: number;
    g: number;
    b: number;
    w: number;
    constructor(r: number, g: number, b: number, w?: number);
    static getRandom(): Color;
    static getRandom255(): number;
    static invert(color: Color): Color;
    static overlap(color1: Color, color2: Color, ratio?: number): Color;
    toString(): string;
    withOpacity(opacity: number): Color;
    safe(): void;
    static getRange(nb: number): Color[];
    static fromHex(hexString: string): Color;
    static toHex(color: Color): string;
    static fromObject(colorObject: {
        r: number;
        g: number;
        b: number;
        w: number;
    }): Color;
}
export declare type LEDStrip = Color[];
