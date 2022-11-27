import {ColorOption, LampAnimation} from "../types/LampAnimation";
import {HtmlColors} from "../htmlColors";
import { NB_LED } from "../NB_LED";
import { Display } from "../display";
import { Line } from "../types/Line";
import { Color } from "../color";
import { randomInt } from "../utils";

export default class FlashingApertureAnimation implements LampAnimation<[ColorOption]> {
    public name = "Flashing Aperture";
    public options: [ColorOption] = [
        { name: "Static Color", type: "color", default: HtmlColors.orange }
    ];

    private FLASH_DUR = 10;
    private APERTURE_DUR = 25;
    private OFF_DUR = 25;
    private NB_OF_SEGMENTS = 5; // 3 is cool as well
    private SEG_LENGTH = Math.floor(NB_LED / this.NB_OF_SEGMENTS);
    private lines: Line[] = [];
    private shift: number = 0;
    private currentColor: Color = HtmlColors.black;

    constructor() {
        this.lines = [];
        for (let i = 0; i < this.NB_OF_SEGMENTS; i++) {
            this.lines.push(new Line(NB_LED,
                i * this.SEG_LENGTH,
                (i + 1) * this.SEG_LENGTH - 1,
            ));
        }
    }

    public animate(t, display: Display, options) {
        const step = t % (this.FLASH_DUR + this.APERTURE_DUR + this.OFF_DUR);

        // Randomize segments positions
        if (step === 0) {
            this.currentColor = options[0];
            this.shift = randomInt(0, this.SEG_LENGTH - 1);
            this.lines.forEach(l => l.from += this.shift);
        }

        if (step < this.FLASH_DUR) {
            // Flash
            display.drawAll(this.currentColor);
        } else if (step < this.FLASH_DUR + this.APERTURE_DUR) {
            // Aperture
            for (let i = 0; i < this.lines.length; i++) {
                const ratio = 1 - (step - this.FLASH_DUR) / this.APERTURE_DUR;
                const length = ratio * this.SEG_LENGTH;
                this.lines[i].to = this.lines[i].from + length - 1;
                display.drawGradient(this.lines[i], this.currentColor.withOpacity(ratio * 2), this.currentColor.withOpacity(ratio));
            }
        } else {
            // Off
            display.drawAll(HtmlColors.black);
        }
    }
}
