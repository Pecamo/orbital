import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class OldSchoolSegmentsAnimation implements LampAnimation<[ColorOption]> {
    segmentsLife: any[];
    name: string;
    options: [ColorOption];
    constructor(segmentsLife?: any[]);
    animate(t: any, display: any, options: any): void;
    static computeOpacity(life: any, maxLife: any): number;
}
