import { Color } from "./color";
import { HtmlColors } from "./htmlColors";
import { DisplayAPI } from "./display-api";
import { Line } from "./types/Line";

export class Display {
  public displayApi: DisplayAPI;
  public brightness = 100;

  constructor(
    public size: number,
    rootHost: string,
    rootPort: number,
    public invertOrientation: boolean = false
  ) {
    this.displayApi = new DisplayAPI(size, rootHost, rootPort);
  }

  private previousFrame: Color[] = this.newBlackArray(this.size);
  private nextFrame: Color[] = this.newBlackArray(this.size);

  public render(): void {
    if (this.invertOrientation) {
      this.nextFrame.reverse();
    }

    this.brightness = Math.max(0, Math.min(this.brightness, 100));

    if (this.brightness < 100) {
      this.nextFrame = this.nextFrame.map((color) =>
        color.withOpacity(this.brightness / 100)
      );
    }

    this.nextFrame.forEach((color) => color?.safe());

    this.displayApi.set(this.nextFrame);

    // Keep at the end
    this.previousFrame = this.nextFrame;
    this.nextFrame = this.newBlackArray(this.size);
  }

  public drawDot(index: number, color: Color): void {
    this.nextFrame[index] = color;
  }

  public drawLine(line: Line, color: Color): void {
    if (line.isLooping) {
      for (let i = line.from; i <= this.size; i++) {
        this.nextFrame[i] = color;
      }
      for (let i = 0; i <= line.to; i++) {
        this.nextFrame[i] = color;
      }
    } else {
      for (let i = line.from; i <= line.to; i++) {
        this.nextFrame[i] = color;
      }
    }
  }

  public drawGradient(line: Line, colorFrom: Color, colorTo: Color): void {
    const length = line.getLength();

    if (line.isLooping) {
      for (let i = line.from; i <= this.size; i++) {
        const ratio = (i - line.from) / length;
        this.nextFrame[i] = Color.overlap(colorFrom, colorTo, ratio);
      }
      for (let i = 0; i <= line.to; i++) {
        const ratio = (i + this.size - line.from) / length;
        this.nextFrame[i] = Color.overlap(colorFrom, colorTo, ratio);
      }
    } else {
      for (let i = line.from; i <= line.to; i++) {
        const ratio = (i - line.from) / length;
        this.nextFrame[i] = Color.overlap(colorFrom, colorTo, ratio);
      }
    }
  }

  public drawAll(color: Color): void {
    this.drawLine(new Line(this.size, 0, this.size), color);
  }

  public get(index: number): Color {
    return this.nextFrame[index];
  }

  public screenshot(): Color[] {
    return this.previousFrame;
  }

  public clear(): void {
    this.drawAll(HtmlColors.black);
  }

  private newBlackArray(length: number): Color[] {
    const arr: Color[] = [];

    for (let i = 0; i < length; i++) {
      arr[i] = HtmlColors.black;
    }

    return arr;
  }
}
