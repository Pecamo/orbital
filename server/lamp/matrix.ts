import { NB_LED } from "../NB_LED";
import { normalize } from "../utils";
import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { Color } from "../color";

const brightness: number[] = new Array(NB_LED).fill(0);
let currentColor: Color = HtmlColors.black;
let lines: Array<{
  headLed: number;
  life: number;
  tailColor: Color;
  headColor: Color;
}> = [];

const PIXEL_LIFE = 30;
const MIN_LINE_LENGTH = 20;
const MAX_LINE_LENGTH = 30;
const CCW = false;

export default class MatrixAnimation
  implements LampAnimation<[ColorOption, ColorOption]>
{
  public name = "Matrix";
  public options: [ColorOption, ColorOption] = [
    { name: "Tail Color", type: "color", default: HtmlColors.green },
    { name: "Head Color", type: "color", default: HtmlColors.white },
  ];

  public animate(t, display, options) {
    if (t % Math.round(PIXEL_LIFE / 20) === 0) {
      lines.push({
        headLed: Math.floor(Math.random() * NB_LED),
        life:
          MIN_LINE_LENGTH + Math.random() * (MAX_LINE_LENGTH - MIN_LINE_LENGTH),
        tailColor: options[0],
        headColor: options[1],
      });
    }

    // Move lines
    lines.forEach((line) => {
      // Brighten pixel
      brightness[line.headLed] = PIXEL_LIFE;
      // Move head
      line.headLed = normalize(line.headLed + (CCW ? -1 : 1));
      line.life -= 1;
    });

    // Remove dead lines
    lines = lines.filter((line) => line.life > 0);

    // Draw
    for (let n = 0; n < NB_LED; n++) {
      brightness[n] = Math.max(0, brightness[n] - 1);
      const line = lines.find((line) => line.headLed === n);
      if (lines.find((line) => line.headLed === n)) {
        display.drawDot(n, line.headColor);
        currentColor = line.tailColor;
      } else {
        display.drawDot(
          n,
          currentColor.withOpacity(brightness[n] / PIXEL_LIFE)
        );
      }
    }
  }
}
