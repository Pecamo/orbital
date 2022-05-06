import {ColorOption, LampAnimation} from "../types/LampAnimation";
import {HtmlColors} from "../htmlColors";
import { NB_LED } from "../NB_LED";
import { Display } from "../display";
import { Line } from "../types/Line";
import { Color } from "../color";
import { randomInt } from "../utils";

export default class FlashingAperture implements LampAnimation<[ColorOption]> {
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

    private segments = [this.FLASH_DUR, this.APERTURE_DUR, this.OFF_DUR];
    private totalDuration = this.segments.reduce((a, c) => a + c, 0);

    constructor() {
        this.lines = [];
        for (let i = 0; i < this.NB_OF_SEGMENTS; i++) {
            this.lines.push(new Line(NB_LED,
                i * this.SEG_LENGTH,
                (i + 1) * this.SEG_LENGTH - 1,
            ));
        }
    }

    private getSegment(t: number) {
        let acc = 0;
        for (let i = 0; i < this.segments.length; i++) {
            acc += this.segments[i];
            if (acc >= t) {
                return i;
            }
        }
        return this.segments.length - 1;
    }

    public animate(t, display: Display, options) {
        const color: Color = options[0];

        const step = t % this.totalDuration;
        const segment = this.getSegment(step);

        // Randomize segments positions
        if (t === 0) {
            this.shift = randomInt(0, this.SEG_LENGTH - 1);
            this.lines.forEach(l => l.from += this.shift);
        }

        switch (segment) {
            case 0: {
                // All lights
                display.drawAll(color);
                break;
            }
            case 1: {
                // Aperture
                for (let i = 0; i < this.lines.length; i++) {
                    const ratio = 1 - (step - this.FLASH_DUR) / this.APERTURE_DUR;
                    const length = ratio * this.SEG_LENGTH;
                    this.lines[i].to = this.lines[i].from + length - 1;
                    display.drawGradient(this.lines[i], color.withOpacitiy(ratio * 2), color.withOpacitiy(ratio));
                }
            }
            case 2: {
                // Off
                display.drawAll(HtmlColors.black);
            }
        }
    }
}
