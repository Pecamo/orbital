import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";

export default class StrobeAnimation
  implements LampAnimation<[ColorOption, ColorOption]>
{
  public name = "Strobe";
  public options: [ColorOption, ColorOption] = [
    { name: "Color 1", type: "color", default: HtmlColors.white },
    { name: "Color 2", type: "color", default: HtmlColors.black },
  ];

  constructor(public duration: number) {}

  public animate(t, display, options) {
    display.drawAll(options[Math.floor((t * 10) / this.duration) % 2]); // Yeah!
  }
}
