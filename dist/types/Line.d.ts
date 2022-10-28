export declare class Line {
    private stageSize;
    private _from;
    private _to;
    private _isLooping;
    constructor(stageSize: number, lineFrom: number, lineTo: number);
    get isLooping(): boolean;
    get from(): number;
    set from(x: number);
    get to(): number;
    set to(x: number);
    getLength(): number;
    includes(x: number): boolean;
    isOverlapping(line: Line): boolean;
    merge(line: Line): Line;
    static simplifyArray(lines: Line[]): Line[];
}
