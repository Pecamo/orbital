import { LAMP_FPS } from "../env";
import { NB_LED } from '../NB_LED';
import { Characteristic, ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { Display } from "../display";

export default class GameOfLifeAnimation implements LampAnimation<[ColorOption]> {
    public name = "Game of Life";
    public options: [ColorOption] = [
        { name: "Color", type: "color", default: HtmlColors.cyan },
    ];

    constructor(private cells = [], private previousCells = []) {

    }

    public animate(t: number, display: Display, characteristics: Characteristic[]) {
        const speed = LAMP_FPS / 6;
        const [color] = characteristics;

        // init
        if (this.cells.length === 0) {
            for (let i = 0; i < NB_LED; i++) {
                this.cells[i] = (Math.random() < 0.5) ? 0 : 1;
            }
        }

        // draw
        for (let i = 0, l = this.cells.length; i < l; i++) {
            display.drawDot(i, color.withOpacitiy(this.cells[i] / 5));
        }

        // live
        if (t % Math.round(LAMP_FPS / speed) === 0) {
            this.live();
        }
    }

    private live() {
        this.previousCells = [...this.cells];

        for (let i = 0, l = this.cells.length; i < l; i++) {
            const previousAlive: boolean = this.previousCells[(i-1) % l] === 0;
            const nextAlive: boolean = this.previousCells[(i+1) % l] === 0;

            if (previousAlive !== nextAlive) {
                this.cells[i]++;
            } else {
                this.cells[i] = 0;
            }
        }
    }
}
