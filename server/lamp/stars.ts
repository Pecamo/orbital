import { NB_LED } from '../NB_LED';
import { Color } from "../color";
import { HtmlColors } from "../htmlColors";
import { ColorOption, LampAnimation } from "../types/LampAnimation";

const initial = { color: HtmlColors.white, life: 0 };

export default class StarsAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    public name = "Stars";
    public options: [ColorOption, ColorOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.cyan },
        { name: "Color 2", type: "color", default: HtmlColors.magenta },
    ];

    private readonly stars: Array<{ color: Color, life: number }> = [];

    constructor(public star_life: number) {
        this.stars = new Array(NB_LED).fill(initial);
    }

    public animate(t, display, options) {
        const [color1, color2] = options;
        const newStar = Math.floor(Math.random() * NB_LED);
        const newColor = Color.overlap(color1, color2, Math.random());
        this.stars[newStar] = { color: newColor, life: this.star_life };
        for (let n = 0; n < NB_LED; n++) {
            const star = this.stars[n];
            display.drawDot(n, star.color.withOpacitiy(star.life / this.star_life))
            this.stars[n].life = Math.max(0, star.life - 1);
        }
    }
}
