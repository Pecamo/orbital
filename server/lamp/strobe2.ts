import { ColorOption, LampAnimation, NumberOption } from "../types/LampAnimation";
import { HtmlColors } from "../htmlColors";
import { LAMP_FPS } from "../env";

export default class Strobe2Animation implements LampAnimation<[ColorOption, ColorOption, NumberOption]> {
    public name = "Strobe2";
    public options: [ColorOption, ColorOption, NumberOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.white },
        { name: "Color 2", type: "color", default: HtmlColors.black },
        { name: "Color duration", type: "number", default: 2, min: 0, max: 20, step: 1, display: 'input' }
    ];

    constructor() {}

    public animate(t, display, options) {
        if (t % 10 === 0) {
            display.drawAll(options[0]);
        } else {
            display.drawAll(options[1]);
        }
    }
}
