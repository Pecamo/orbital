import { LAMP_FPS } from "../env";
import { NB_LED } from "../NB_LED";
import { Line } from "../types/Line";
import { randomInt } from "../utils";
import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { Display } from "../display";
import { Color } from "../color";

export default class FlashingSegmentsAnimation
  implements LampAnimation<[ColorOption]>
{
  public name = "Flashing Segments";
  public options: [ColorOption] = [
    { name: "Flash Color", type: "color", default: HtmlColors.red },
  ];

  private readonly segments: Array<{ color: Color; life: number }> = [];

  public animate(t, display: Display, options): void {
    const nbSegments = 12;
    const segmentsLength = Math.round(NB_LED / nbSegments);
    const maxLife = LAMP_FPS / 4;

    if (t % Math.floor(LAMP_FPS / 20) === randomInt(0, 10)) {
      const n = randomInt(0, nbSegments - 1);

      if (
        typeof this.segments[n] === "undefined" ||
        this.segments[n].life <= 0
      ) {
        this.segments[n] = {
          life: maxLife + randomInt(-5, 5),
          color: options[0],
        };
      }
    }

    for (let i = 0; i < nbSegments; i++) {
      if (
        this.segments[i] &&
        this.segments[i].life &&
        this.segments[i].life > 0
      ) {
        const opacity = this.segments[i].life / maxLife;
        const line = new Line(
          NB_LED,
          i * segmentsLength,
          (i + 1) * segmentsLength - 1
        );
        display.drawLine(line, this.segments[i].color.withOpacity(opacity));
        this.segments[i].life--;
      }
    }
  }
}
