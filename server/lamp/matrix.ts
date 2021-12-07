import { Display } from "../display";
import { NB_LED } from '../NB_LED';
import {Color} from "../color";
import {normalize} from "../utils";

const brightness: number[] = new Array(NB_LED).fill(0);
let lines: Array<{ led: number, life: number }> = [];

const PIXEL_LIFE = 30;
const MIN_LINE_LENGTH = 20;
const MAX_LINE_LENGTH = 30;
const LINE_EACH = 8;
const CCW = false;

let t = 0;

export default function animate(display: Display, color: Color, colorHead: Color): void {
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
            display.drawDot(n, colorHead);
        } else {
            display.drawDot(n, color.withOpacitiy(brightness[n] / PIXEL_LIFE));
        }
    }
}
