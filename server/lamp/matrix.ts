import { NB_LED } from '../NB_LED';
import {normalize} from "../utils";
import {ColorOption, LampAnimation} from "../types/LampAnimation";
import {HtmlColors} from "../htmlColors";

const brightness: number[] = new Array(NB_LED).fill(0);
let lines: Array<{ led: number, life: number }> = [];

const PIXEL_LIFE = 30;
const MIN_LINE_LENGTH = 20;
const MAX_LINE_LENGTH = 30;
const LINE_EACH = 8;
const CCW = false;

export default class MatrixAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    public name = "Matrix";
    public options: [ColorOption, ColorOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.cyan },
        { name: "Color 2", type: "color", default: HtmlColors.magenta },
    ];

    public animate(t, display, options) {
        const [color1, color2] = options;

        if (t++ >= LINE_EACH) {
            t = 0;
            lines.push({
                led: Math.floor(Math.random() * NB_LED),
                life: MIN_LINE_LENGTH + Math.random() * (MAX_LINE_LENGTH - MIN_LINE_LENGTH),
            });
        }

        // Move lines
        lines.forEach(line => {
            // Brighten pixel
            brightness[line.led] = PIXEL_LIFE;
            // Move head
            line.led = normalize(line.led + (CCW ? -1 : 1));
            line.life -= 1;
        })

        // Remove dead lines
        lines = lines.filter(line => line.life > 0);

        // Look for line heads
        const heads = lines.map(line => line.led);

        // Draw
        for (let n = 0; n < NB_LED; n++) {
            brightness[n] = Math.max(0, brightness[n] - 1);
            if (heads.includes(n)) {
                display.drawDot(n, color2);
            } else {
                display.drawDot(n, color1.withOpacitiy(brightness[n] / PIXEL_LIFE));
            }
        }
    }
}
