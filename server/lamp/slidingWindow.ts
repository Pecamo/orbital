import {ColorOption, LampAnimation} from "../types/LampAnimation";
import {NB_LED} from "../NB_LED";
import {normalize} from "../utils";
import { HtmlColors } from "../htmlColors";

export default class SlidingWindowAnimation implements LampAnimation<[ColorOption]> {
    public name = "Sliding Window";
    public options: [ColorOption] = [
        { name: "Color", type: "color", default: HtmlColors.white },
    ];

    public animate(t, display, options) {
        const speed = NB_LED / 30;
        for (let n = 0; n < NB_LED / 3; n++) {
            display.drawDot(normalize(n + Math.floor(t * speed)), options[0]);
        }
    }
}
