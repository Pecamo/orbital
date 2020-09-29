import { mod } from "./utils";

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

    public includes(x: number) {
        x = mod(x, this.stageSize);

        if (this.isLooping) {
            return this.from <= x && this.to >= x; // FIXME
        } else {
            return this.from <= x && this.to >= x;
        }
    }

    public overlap(line: Line): boolean {
        if (this.includes(line.from) || this.includes(line.to)) {
            return true;
        } else if (line.includes(this.from) || line.includes(this.to)) {
            return true;
        } else {
            return false;
        }
    }

    public merge(line: Line): Line {
        // return new Line(this.stageSize)
    }

    public static simplifyArray(lines: Line[]) {
        lines.forEach(lineA => {
            lines.forEach(lineB => {
                if (lineA.overlap(lineB)) {

                }
            })
        })
    }
}
