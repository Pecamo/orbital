import {ColorOption, LampAnimation, NumberOption} from "../types/LampAnimation";
import {HtmlColors} from "../htmlColors";

export default class StrobeAnimation implements LampAnimation<[ColorOption, ColorOption, NumberOption]> {
    public name = "Strobe";
    public options: [ColorOption, ColorOption, NumberOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.black },
        { name: "Color 2", type: "color", default: HtmlColors.black },
        { name: "Color duration", type: "number", default: 2, min: 0, max: 20, step: 1, display: 'input' }
    ];

    public animate(t, display, options) {
        display.drawAll(options[Math.floor(t * 10 / options[2]) % 2]); // Yeah!
    }
}
