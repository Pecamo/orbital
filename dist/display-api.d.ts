import { Color } from "./color";
export declare class DisplayAPI {
    size: number;
    rootHost: string;
    rootPort: any;
    constructor(size: number, rootHost: string, rootPort: any);
    private lastFrameRendered;
    private socket;
    set(colors: Color[]): void;
    private sendColors;
}
