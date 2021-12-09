import { Color } from "../color";
import { Display } from "../display";
import { LAMP_FPS } from "../env";
import { NB_LED } from '../NB_LED';

export class GameOfLife {
    static cells = [];
    static previousCells = [];

    static animate(t: number, display: Display, color: Color): void {
        const speed = LAMP_FPS / 2;

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

    private static live() {
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
