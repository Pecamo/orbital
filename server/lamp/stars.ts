import { Color } from "../color";
import { HtmlColors } from "../htmlColors";
import { ColorOption, LampAnimation, NumberOption } from "../types/LampAnimation";

const initial = { color: HtmlColors.white, life: 0 };

export default class StarsAnimation implements LampAnimation<[ColorOption, ColorOption, NumberOption]> {
    public name = "Stars";
    public options: [ColorOption, ColorOption, NumberOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.cyan },
        { name: "Color 2", type: "color", default: HtmlColors.magenta },
        { name: "Star life", type: "number", default: 120, min: 0, max: 10000, step: 1, display: 'range' },
    ];

    private readonly stars: Array<{ color: Color, life: number }> = [];

    constructor(public star_life: number, public NB_LED: number) {
        this.stars = new Array(this.NB_LED).fill(initial);
        console.log('NB_LED', NB_LED);
        console.log('star_life', star_life);
    }

    public animate(t, display, options) {
        const [color1, color2] = options;
        const newStar = Math.floor(Math.random() * this.NB_LED);
        const newColor = Color.overlap(color1, color2, Math.random());
        this.stars[newStar] = { color: newColor, life: this.star_life };
        for (let n = 0; n < this.NB_LED; n++) {
            const star = this.stars[n];
            display.drawDot(n, star.color.withOpacitiy(star.life / this.star_life))
            this.stars[n].life = Math.max(0, star.life - 1);
        }
    }
}
