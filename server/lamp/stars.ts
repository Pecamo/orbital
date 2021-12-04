import { NB_LED } from "../server";
import { Color } from "../color";
import { HtmlColors } from "../htmlColors";
import { LampAnimation } from "../types/LampAnimation";

const initial = { color: HtmlColors.white, life: 0 };

export default class StarsAnimation implements LampAnimation {
    name: "Stars";
    options: [
        { name: "Color 1", type: "color", default: HtmlColors.cyan },
        { name: "Color 2", type: "color", default: HtmlColors.magenta },
        { name: "Star life", type: "number", default: 120, min: 0, max: 10000, step: 1, display: 'range' },
    ];

    public stars: Array<{ color: Color, life: number }> = [];

    constructor() {
        this.stars = new Array(NB_LED).fill(initial);
    }

    animate(t, display, options) {
        const [color1, color2, star_life] = options;
        const newStar = Math.floor(Math.random() * NB_LED);
        const newColor = Color.overlap(color1, color2, Math.random());
        this.stars[newStar] = { color: newColor, life: star_life };
        for (let n = 0; n < NB_LED; n++) {
            const star = this.stars[n];
            display.drawDot(n, star.color.withOpacitiy(star.life / star_life))
            this.stars[n].life = Math.max(0, star.life - 1);
        }
    }
}
