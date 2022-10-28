import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class Strobe2Animation implements LampAnimation<[ColorOption, ColorOption]> {
    name: string;
    options: [ColorOption, ColorOption];
    constructor();
    animate(t: any, display: any, options: any): void;
}
