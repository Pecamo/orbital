import { mod } from "../utils";

export class Line {
    private _from: number;
    private _to: number;
    private _isLooping: boolean;

    constructor (private stageSize: number, lineFrom: number, lineTo: number) {
        this.from = lineFrom;
        this.to = lineTo;
        this._isLooping = this.from > this.to;
    }

    get isLooping(): boolean {
        return this._isLooping;
    }

    get from(): number {
        return this._from;
    }

    set from(x: number) {
        this._from = mod(x, this.stageSize);
    }

    get to(): number {
        return this._to;
    }

    set to(x: number) {
        this._to = mod(x, this.stageSize);
    }

    public includes(x: number): boolean {
        x = mod(x, this.stageSize);

        if (this.isLooping) {
            return (this.from <= x && x >= this.stageSize) || (x >= 0 && this.to <= x);
        } else {
            return this.from <= x && this.to >= x;
        }
    }

    public isOverlapping(line: Line): boolean {
        if (this.includes(line.from) || this.includes(line.to)) {
            return true;
        } else if (line.includes(this.from) || line.includes(this.to)) {
            return true;
        } else {
            return false;
        }
    }

    public merge(line: Line): Line {
        let from: number;
        let to: number;

        if (this.includes(line.from)) {
            from = this.from;
        } else {
            from = line.from;
        }

        if (this.includes(line.to)) {
            to = this.to;
        } else {
            to = line.to;
        }

        return new Line(this.stageSize, from, to);
    }

    public static simplifyArray(lines: Line[]): Line[] {
        const simplifiedLines = [];

        if (lines.length < 2) {
            return lines;
        }

        lines = lines.sort((a, b) => {
            return a.from - b.from;
        });

        for (let i = 0; i < lines.length - 1; i++) {
            let currentLine: Line;

            if (lines[i].isOverlapping(lines[i + 1])) {
                if (currentLine) {
                    currentLine = currentLine.merge(lines[i + 1]);
                } else {
                    currentLine = lines[i].merge(lines[i + 1]);
                }
            } else {
                if (currentLine) {
                    simplifiedLines.push(currentLine);
                    currentLine = null;
                } else {
                    simplifiedLines.push(lines[i]);
                }
            }
        }

        return simplifiedLines;
    }
}
