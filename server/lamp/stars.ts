import { LAMP_FPS } from "../env";
import { NB_LED } from "../NB_LED";
import { Color } from "../color";
import { HtmlColors } from "../htmlColors";
import {
  ColorOption,
  LampAnimation,
  NumberOption,
} from "../types/LampAnimation";
import { normalize } from "../utils";

const initial = { color: HtmlColors.white, life: 0 };

export default class StarsAnimation
  implements
    LampAnimation<
      [ColorOption, ColorOption, NumberOption, NumberOption, NumberOption]
    >
{
  public name = "Stars";
  public options: [
    ColorOption,
    ColorOption,
    NumberOption,
    NumberOption,
    NumberOption
  ] = [
    { name: "Color 1", type: "color", default: HtmlColors.cyan },
    { name: "Color 2", type: "color", default: HtmlColors.magenta },
    {
      name: "Star lifetime",
      type: "number",
      default: 120,
      min: 0,
      max: 600,
      step: 10,
      display: "range",
    },
    {
      name: "New stars per second",
      type: "number",
      default: 60,
      min: 0,
      max: 600,
      step: 10,
      display: "range",
    },
    {
      name: "Star width",
      type: "number",
      default: 1,
      min: 1,
      max: 10,
      step: 1,
      display: "input",
    },
  ];

  private readonly stars: Array<{ color: Color; life: number }> = [];
  private newStarIncrement = 0;

  constructor() {
    this.stars = new Array(NB_LED).fill(initial);
  }

  public animate(t, display, options) {
    const [color1, color2, starLifetime, newStarsRate, starWidth] = options;
    this.newStarIncrement += newStarsRate;
    while (this.newStarIncrement >= LAMP_FPS) {
      const newStarCenter = Math.floor(Math.random() * NB_LED);
      const newColor = Color.overlap(color1, color2, Math.random());
      for (let starPixelI = 0; starPixelI < starWidth; starPixelI++) {
        const pixelTranslationDirection = (starPixelI % 2) * 2 - 1;
        const pixelTranslation =
          Math.floor((starPixelI + 1) / 2) * pixelTranslationDirection;
        const starPixel = newStarCenter + pixelTranslation;
        this.stars[normalize(starPixel)] = {
          color: newColor,
          life: starLifetime,
        };
      }
      this.newStarIncrement -= LAMP_FPS;
    }
    for (let n = 0; n < NB_LED; n++) {
      const star = this.stars[n];
      display.drawDot(n, star.color.withOpacity(star.life / starLifetime));
      this.stars[n].life = Math.max(0, star.life - 1);
    }
  }
}
