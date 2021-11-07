import { Display } from "../display";
import { NB_LED } from "../server";
import { Color } from "../color";
import { HtmlColors } from "../htmlColors";

const initial = { color: HtmlColors.white, life: 0 };
let stars: Array<{ color: Color, life: number }> = null;

const STAR_LIFE = 120;

export default function animate(display: Display, color1: Color, color2: Color): void {
    if (stars === null) {
        stars = new Array(NB_LED).fill(initial);
    }
    const newStar = Math.floor(Math.random() * NB_LED);
    const newColor = Color.overlap(color1, color2, Math.random());
    stars[newStar] = { color: newColor, life: STAR_LIFE };
    for (let n = 0; n < NB_LED; n++) {
        const star = stars[n];
        display.drawDot(n, star.color.withOpacitiy(star.life / STAR_LIFE))
        stars[n].life = Math.max(0, star.life - 1);
    }
}
