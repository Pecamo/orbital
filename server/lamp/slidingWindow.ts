import {LampAnimation} from "../types/LampAnimation";
import {NB_LED} from "../NB_LED";
import * as convert from "color-convert";
import {Color} from "../color";
import {normalize} from "../utils";

export default class SlidingWindowAnimation implements LampAnimation<[]> {
    public name = "Sliding Window";
    public options: [] = [];

    public animate(t, display, options) {
        const speed = NB_LED / 30;
        for (let n = 0; n < NB_LED / 3; n++) {
            const rgb = convert.hsv.rgb([(n + Math.floor(t * speed)) * 360 / NB_LED, 100, 100]);
            const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
            display.drawDot(normalize(n + Math.floor(t * speed)), color);
        }
    }
}
