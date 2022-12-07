import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";

export default class NoneAnimation implements LampAnimation<[ColorOption]> {
  public name = "None";
  public options: [ColorOption] = [
    { name: "Static Color", type: "color", default: HtmlColors.black },
  ];

  public animate(t, display, options) {
    display.drawAll(options[0]);
  }
}
