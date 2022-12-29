import * as convert from "color-convert";

export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public w: number = 0
  ) {}

  public static getRandom(): Color {
    return new Color(
      Color.getRandom255(),
      Color.getRandom255(),
      Color.getRandom255()
    );
  }

  public static getRandomHue(): Color {
    const rgb = convert.hsv.rgb([Math.random() * 360, 100, 100]);
    return new Color(rgb[0], rgb[1], rgb[2]);
  }

  public static getGray(color: Color): Color {
    const gray = convert.rgb.gray([color.r, color.g, color.b])[0] * 255 / 100;
    return new Color(gray, gray, gray);
  }

  public static getRandom255(): number {
    return ~~(Math.random() * 256);
  }

  public static invert(color: Color): Color {
    return new Color(255 - color.r, 255 - color.g, 255 - color.b);
  }

  public static overlap(color1: Color, color2: Color, ratio = 0.5): Color {
    return new Color(
      Math.round(color1.r * (1 - ratio) + color2.r * ratio),
      Math.round(color1.g * (1 - ratio) + color2.g * ratio),
      Math.round(color1.b * (1 - ratio) + color2.b * ratio)
    );
  }

  public toString(): string {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  public withOpacity(opacity: number): Color {
    opacity = Math.min(Math.max(opacity, 0), 1);

    return new Color(
      Math.round(this.r * opacity),
      Math.round(this.g * opacity),
      Math.round(this.b * opacity),
      Math.round(this.w * opacity)
    );
  }

  public safe() {
    this.r = Math.max(0, Math.min(this.r, 255));
    this.g = Math.max(0, Math.min(this.g, 255));
    this.b = Math.max(0, Math.min(this.b, 255));
    this.w = Math.max(0, Math.min(this.w, 255));
  }

  public static getRange(nb: number): Color[] {
    const tintIncrement = (256 * 6) / nb;
    return [...Array(nb).keys()].map((c) => {
      const tint = tintIncrement * c;
      const phase = tint % 256;
      if (tint < 256) {
        return new Color(255, phase, 0);
      }
      if (tint < 256 * 2) {
        return new Color(255 - phase, 255, 0);
      }
      if (tint < 256 * 3) {
        return new Color(0, 255, phase);
      }
      if (tint < 256 * 4) {
        return new Color(0, 255 - phase, 255);
      }
      if (tint < 256 * 5) {
        return new Color(phase, 0, 255);
      }
      return new Color(255, 0, 255 - phase);
    });
  }

  public static fromHex(hexString: string): Color {
    return new Color(
      parseInt(hexString.substring(1, 3), 16),
      parseInt(hexString.substring(3, 5), 16),
      parseInt(hexString.substring(5, 7), 16),
      0
    );
  }

  public static toHex(color: Color): string {
    return (
      "#" +
      ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b)
        .toString(16)
        .slice(1)
    );
  }

  public static fromObject(colorObject: {
    r: number;
    g: number;
    b: number;
    w: number;
  }): Color {
    const { r, g, b, w } = colorObject;
    return new Color(r, g, b, w);
  }
}

export type LEDStrip = Color[];
