import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { Display } from "../display";
export default class FlashingSegmentsAnimation implements LampAnimation<[ColorOption]> {
    segmentsLife: any[];
    name: string;
    options: [ColorOption];
    constructor(segmentsLife?: any[]);
    animate(t: any, display: Display, options: any): void;
}
