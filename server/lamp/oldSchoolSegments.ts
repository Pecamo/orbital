import { LAMP_FPS } from "../env";
import { NB_LED } from '../NB_LED';
import { Line } from "../types/Line";
import { randomInt } from "../utils";
import {ColorOption, LampAnimation, NumberOption} from "../types/LampAnimation";
import {HtmlColors} from "../htmlColors";

export class OldSchoolSegmentsAnimation implements LampAnimation<[ColorOption, ColorOption, NumberOption]> {
    public name = "Old School Segments";
    public options: [ColorOption, ColorOption, NumberOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.black }, // Unused but all options need to be the same for now
        { name: "Color 2", type: "color", default: HtmlColors.black }, // Unused but all options need to be the same for now
        { name: "Top Led Number", type: "number", default: 0, min: 0, max: 100, step: 1, display: 'range' }
    ];

    constructor(public segmentsLife = []) {
    }

    public animate(t, display, options): void {
        const [color, _, topLed] = options;
        const nbSegments = 8; // TODO set as parameter
        const blockLength = Math.round(NB_LED / nbSegments);
        const separatorsLength = 2;
        const marginsLength = 2;
        const segmentsLength = blockLength - separatorsLength - marginsLength * 2;
        const maxLife = LAMP_FPS * 2;

        if (t % Math.floor(LAMP_FPS / 3) === 0) {
            const n = randomInt(0, nbSegments - 1);

            if (typeof this.segmentsLife[n] === 'undefined' || this.segmentsLife[n] <= 0) {
                this.segmentsLife[n] = maxLife + randomInt(-5, 5);
            }
        }

        let pos = 0;
        for (let i = 0; i < nbSegments; i++) {
            display.drawLine(new Line(NB_LED, pos, pos + separatorsLength - 1), color);
            pos += separatorsLength;
            pos += marginsLength;

            if (this.segmentsLife[i] && this.segmentsLife[i] > 0) {
                const opacity = OldSchoolSegmentsAnimation.computeOpacity(this.segmentsLife[i], maxLife);
                display.drawLine(new Line(NB_LED, pos, pos + segmentsLength - 1), color.withOpacitiy(opacity));
                this.segmentsLife[i]--;
            }

            pos += segmentsLength;
            pos += marginsLength;
        }
    }

    static computeOpacity(life, maxLife): number {
        if (life > maxLife * 3 / 4) {
            return (maxLife - life) / (maxLife / 4);
        } else if (life < maxLife / 4) {
            return life / (maxLife / 4);
        } else {
            return 1;
        }
    }
}
