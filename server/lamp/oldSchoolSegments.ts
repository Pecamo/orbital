import { LAMP_FPS } from "../env";
import { NB_LED } from '../NB_LED';
import { Line } from "../types/Line";
import { randomInt } from "../utils";
import { ColorOption, LampAnimation, NumberOption } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { Color } from "../color";

export default class OldSchoolSegmentsAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    public name = "Old School Segments";
    public options: [ColorOption, ColorOption] = [
        { name: "Segments' Color", type: "color", default: HtmlColors.gold },
        { name: "Separations' Color", type: "color", default: HtmlColors.gold },
    ];

    private readonly segments: Array<{ color: Color, life: number }> = [];

    public animate(t, display, options): void {
        const nbSegments = 8; // TODO set as parameter
        const blockLength = Math.round(NB_LED / nbSegments);
        const separatorsLength = 2;
        const marginsLength = 2;
        const segmentsLength = blockLength - separatorsLength - marginsLength * 2;
        const maxLife = LAMP_FPS * 2;

        if (t % Math.floor(LAMP_FPS / 3) === 0) {
            const n = randomInt(0, nbSegments - 1);

            if (typeof this.segments[n] === 'undefined' || this.segments[n].life <= 0) {
                this.segments[n] = {
                    life: maxLife + randomInt(-5, 5),
                    color: options[0],
                }
            }
        }

        let pos = 0;
        for (let i = 0; i < nbSegments; i++) {
            display.drawLine(new Line(NB_LED, pos, pos + separatorsLength - 1), options[1]);
            pos += separatorsLength;
            pos += marginsLength;

            if (this.segments[i] && this.segments[i].life && this.segments[i].life > 0) {
                const opacity = OldSchoolSegmentsAnimation.computeOpacity(this.segments[i].life, maxLife);
                const line = new Line(NB_LED, pos, pos + segmentsLength - 1);
                display.drawLine(line, this.segments[i].color.withOpacity(opacity));
                this.segments[i].life--;
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
