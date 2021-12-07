import * as ct from 'color-temperature';
import { Color } from "./color";
import { NB_LED } from './NB_LED';
import { HtmlColors } from "./htmlColors";

export function mod(x, n) {
    return ((x % n) + n) % n;
}

export function temperatureToRgb(temperature): Color {
    // Assume temperature in Kelvin
    // 1st step: too cold to glow (theorically 798K (Draper point), but it looks quite better like this)
    // 2nd step: the lib returns NaN or 0 for green under 652K
    // 3rd step: starts to emit green ligth, we can count on the lib
    const steps = [200, 652, 1000];
    if (temperature < steps[0]) {
        return HtmlColors.black;
    } else if (temperature < steps[1]) {
        const red = Math.round((temperature - steps[0]) * (255 / (steps[2] - steps[0])));
        return new Color(red, 0, 0);
    } else if (temperature < steps[2]) {
        const red = Math.round((temperature - steps[0]) * (255 / (steps[2] - steps[0])));
        const { green, blue } = ct.colorTemperature2rgb(temperature);
        return new Color(red, green, blue);
    } else {
        const { red, green, blue } = ct.colorTemperature2rgb(temperature);
        return new Color(red, green, blue);
    }
}

export function normalize(n) {
    return mod(n, NB_LED);
}
