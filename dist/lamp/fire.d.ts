import { LampAnimation, NumberOption } from "../types/LampAnimation";
export default class FireAnimation implements LampAnimation<[NumberOption]> {
    private rotation;
    name: string;
    options: [NumberOption];
    private fireIntensityLeft;
    private fireIntensityRight;
    private previousTemperatures;
    private temperatures;
    constructor(rotation: boolean);
    animate(t: any, display: any, options: any): void;
}
