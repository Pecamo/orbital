import { Color } from "./color";
import { DisplayAPI } from "./display-api";
import { Line } from "./types/Line";
export declare class Display {
    size: number;
    invertOrientation: boolean;
    displayApi: DisplayAPI;
    brightness: number;
    constructor(size: number, rootHost: string, rootPort: number, invertOrientation?: boolean);
    private previousFrame;
    private nextFrame;
    render(): void;
    drawDot(index: number, color: Color): void;
    drawLine(line: Line, color: Color): void;
    drawGradient(line: Line, colorFrom: Color, colorTo: Color): void;
    drawAll(color: Color): void;
    get(index: number): Color;
    screenshot(): Color[];
    clear(): void;
    private newBlackArray;
}
