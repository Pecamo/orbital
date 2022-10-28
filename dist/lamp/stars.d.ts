import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class StarsAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    star_life: number;
    name: string;
    options: [ColorOption, ColorOption];
    private readonly stars;
    constructor(star_life: number);
    animate(t: any, display: any, options: any): void;
}
