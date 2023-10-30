import { NB_LED } from '../NB_LED';
import { HtmlColors } from "../htmlColors";
import {ColorOption, LampAnimation, NumberOption, SelectOption} from "../types/LampAnimation";
import {normalize} from "../utils";
import { TOP_LED_NB } from '../env';
import { Color } from '../color';

export default class PulseAnimation implements LampAnimation<[ColorOption, ColorOption, SelectOption, NumberOption, NumberOption, NumberOption, NumberOption]> {
    public name = "Pulse";
    public options: [ColorOption, ColorOption, SelectOption, NumberOption, NumberOption, NumberOption, NumberOption] = [
        { name: "Start color", type: "color", default: HtmlColors.cyan },
        { name: "End color", type: "color", default: HtmlColors.cyan },
        { name: "Branches", type: "select", options: [
            {optionValue: "rl", label: "Both"},
            {optionValue: "l", label: "Clockwise"},
            {optionValue: "r", label: "Counter-Clockwise"},
          ], default: "rl" },
        { name: "Speed", type: "number", default: 10, min: 1, max: 100, step: 1, display: 'range' },
        { name: "# of Pulses", type: "number", default: 1, min: 1, max: 10, step: 1, display: 'range' },
        { name: "Rotation speed", type: "number", default: 0, min: 0, max: 360, step: 1, display: 'range' },
        { name: "Top Led Number", type: "number", default: TOP_LED_NB, min: 0, max: NB_LED, step: 1, display: 'range' }
    ];

    public animate(t, display, options) {
        const [color1, color2, branches, speed, pulses, rotationSpeed, topLedNb] = options;
        const realSpeed = speed / 10;

        const isFull = branches === 'rl';
        const maxProgress = Math.ceil(NB_LED / (isFull ? 2 : 1));
        const progress = (t * realSpeed) % maxProgress;
        const rotationProgress = t * rotationSpeed / 360;

        for (let pulse = 0; pulse < pulses; pulse++) {
            const pulseProgress = (progress + (pulse / pulses * maxProgress)) % maxProgress;
            const progressedColor = Color.overlap(color1, color2, pulseProgress / maxProgress);
            if (branches.includes('l')) {
                display.drawDot(normalize(Math.round(pulseProgress + topLedNb + rotationProgress)), progressedColor);
            }
            if (branches.includes('r')) {
                display.drawDot(normalize(Math.round(-pulseProgress + topLedNb + rotationProgress)), progressedColor);
            }
        }
    }
}

