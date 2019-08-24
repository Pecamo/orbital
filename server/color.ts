export class Color {
    public static getRandom(): Color {
        return new Color(Color.getRandom255(), Color.getRandom255(), Color.getRandom255());
    }

    public static getRandom255(): number {
        return ~~(Math.random() * 256);
    }

    public static invert(color: Color): Color {
        return new Color(255 - color.r, 255 - color.g, 255 - color.b);
    }

    public static overlap(color1: Color, color2: Color, ratio: number = 0.5): Color {
        return new Color(
            Math.round(color1.r * (1 - ratio) + color2.r * ratio),
            Math.round(color1.g * (1 - ratio) + color2.g * ratio),
            Math.round(color1.b * (1 - ratio) + color2.b * ratio),
        );
    }

    public toString(): string {
        return `rgb(${this.r},${this.g},${this.b})`;
    }

    constructor(public r: number, public g: number, public b: number, public w?: number) {}
}

export type LEDStrip = Color[];
