import { NB_LED } from "../NB_LED";
import { Color } from "../color";
import { LampAnimation } from "../types/LampAnimation";
import * as convert from "color-convert";

export default class RainbowAnimation implements LampAnimation {
  public name = "Rainbow";
  public options: [] = [];

  public animate(t, display) {
    for (let n = 0; n < NB_LED; n++) {
      const rgb = convert.hsv.rgb([((n + t) * 360) / NB_LED, 100, 100]);
      const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
      display.drawDot(n, color);
    }
  }
}
