import { ColorOption, LampAnimation } from "../types/LampAnimation";
import { Display } from "../display";
export default class FlashingApertureAnimation implements LampAnimation<[ColorOption]> {
    name: string;
    options: [ColorOption];
    private FLASH_DUR;
    private APERTURE_DUR;
    private OFF_DUR;
    private NB_OF_SEGMENTS;
    private SEG_LENGTH;
    private lines;
    private shift;
    constructor();
    animate(t: any, display: Display, options: any): void;
}
