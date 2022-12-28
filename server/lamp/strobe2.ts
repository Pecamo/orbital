import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";

export default class Strobe2Animation
  implements LampAnimation<[ColorOption, ColorOption]>
{
  public name = "Strobe2";
  public options: [ColorOption, ColorOption] = [
    { name: "Short Color", type: "color", default: HtmlColors.white },
    { name: "Long Color", type: "color", default: HtmlColors.black },
  ];

  public animate(t, display, options) {
    if (t % 10 === 0) {
      display.drawAll(options[0]);
    } else {
      display.drawAll(options[1]);
    }
  }
}
