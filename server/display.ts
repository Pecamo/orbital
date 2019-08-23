import { Color } from "./color";
import { HtmlColors } from "./htmlColors";
import { DisplayAPI } from "./display-api";

export class Display {
    constructor(public size: number) {}

    private currentFrame: Color[] = this.newBlackArray(this.size);
    private nextFrame: Color[] = this.newBlackArray(this.size);

    public render(): void {
        // TODO play with LEDs
        DisplayAPI.set(this.currentFrame);

        // Keep at the end
        this.currentFrame = this.nextFrame;
        this.nextFrame = this.newBlackArray(this.size);
    }

    public drawDot(index: number, color: Color): void {
        this.nextFrame[index] = color;
    }

    public drawLine(from: number, to: number, color: Color): void {
        for (let i = from; i <= to; i++) {
            this.nextFrame[i] = color;
        }
    }

    public drawGradient(from: number, to: number, colorFrom: Color, colorTo: Color): void {
        for (let i = from; i <= to; i++) {
            const ratio = (i - from) / to;
            this.nextFrame[i] = Color.overlap(colorFrom, colorTo, ratio);
        }
    }

    public drawAll(color: Color): void {
        this.drawLine(0, this.size, color);
    }

    public get(index: number): Color {
        return this.currentFrame[index];
    }

    public screenshot(): Color[] {
        return this.currentFrame;
    }

    public clear(): void {
        this.drawLine(0, this.size, HtmlColors.black);
    }

    private newBlackArray(length: number): Color[] {
        const arr: Color[] = [];

        for (let i = 0; i < length; i++) {
            arr[i] = HtmlColors.black;
        }

        return arr;
    }
}
