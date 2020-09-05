import { Color } from "./color";
import { HtmlColors } from "./htmlColors";
import { DisplayAPI } from "./display-api";

export class Display {
    public displayApi: DisplayAPI;

    constructor(public size: number, rootEndpoint: string, public isDisplay: boolean = true, public invertOrientation: boolean = false) {
        this.displayApi = new DisplayAPI(rootEndpoint);
    }

    private previousFrame: Color[] = this.newBlackArray(this.size);
    private nextFrame: Color[] = this.newBlackArray(this.size);

    public render(): void {
        if (this.isDisplay) {
            if (this.invertOrientation) {
                this.nextFrame.reverse();
            }

            this.nextFrame.forEach(color => color.safe());

            this.displayApi.set(this.nextFrame);
        }

        // Keep at the end
        this.previousFrame = this.nextFrame;
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
        return this.nextFrame[index];
    }

    public screenshot(): Color[] {
        return this.previousFrame;
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
