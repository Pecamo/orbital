import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class StrobeAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    duration: number;
    name: string;
    options: [ColorOption, ColorOption];
    constructor(duration: number);
    animate(t: any, display: any, options: any): void;
}
