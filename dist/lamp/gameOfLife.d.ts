import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { Display } from "../display";
import { Color } from "../color";
export default class GameOfLifeAnimation implements LampAnimation<[ColorOption]> {
    private cells;
    private previousCells;
    name: string;
    options: [ColorOption];
    constructor(cells?: any[], previousCells?: any[]);
    animate(t: number, display: Display, parameters: [Color]): void;
    private live;
}
