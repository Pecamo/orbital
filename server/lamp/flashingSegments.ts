import { LAMP_FPS } from "../env";
import { NB_LED } from '../NB_LED';
import { Line } from "../types/Line";
import { randomInt } from "../utils";
import { ColorOption, LampAnimation, NumberOption } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { Display } from "../display";

export default class FlashingSegmentsAnimation implements LampAnimation<[ColorOption]> {
    public name = "Flashing Segments";
    public options: [ColorOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.red },
    ];

    constructor(public segmentsLife = []) {}

    public animate(t, display: Display, options): void {
        const color = options[0];
        const nbSegments = 12;
        const segmentsLength = Math.round(NB_LED / nbSegments);
        const maxLife = LAMP_FPS / 4;

        if (t % Math.floor(LAMP_FPS / 20) === randomInt(0, 10)) {
            const n = randomInt(0, nbSegments - 1);

            if (typeof this.segmentsLife[n] === 'undefined' || this.segmentsLife[n] <= 0) {
                this.segmentsLife[n] = maxLife + randomInt(-5, 5);
            }
        }

        for (let i = 0; i < nbSegments; i++) {
            if (this.segmentsLife[i] && this.segmentsLife[i] > 0) {
                const opacity = this.segmentsLife[i] / maxLife;
                display.drawLine(new Line(NB_LED, i * segmentsLength, (i + 1) * segmentsLength -1), color.withOpacitiy(opacity));
                this.segmentsLife[i]--;
            }
        }
    }
}
