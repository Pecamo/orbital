import { NB_LED } from '../NB_LED';
import { HtmlColors } from "../htmlColors";
import { ColorOption, LampAnimation, NumberOption } from "../types/LampAnimation";

export default class AlternatingAnimation implements LampAnimation<[ColorOption, ColorOption, NumberOption]> {
  public name = "Alternating";
  public options: [ColorOption, ColorOption, NumberOption] = [
    { name: "Color 1", type: "color", default: HtmlColors.cyan },
    { name: "Color 2", type: "color", default: HtmlColors.magenta },
    { name: "Duration", type: "number", default: 100, min: 0, max: 10000, step: 100, display: 'range' },
  ];

  constructor(public duration: number) {}

  public animate(t, display, options) {
    const [color1, color2] = options;
    const offset = Math.floor(t / this.duration) % 2;
    for (let n = 0; n < NB_LED; n++) {
      const colorParam = (Math.floor(n / 2) + offset) % 2;
      display.drawDot(n, [color1, color2][colorParam]);
    }
  }
}
