import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class MatrixAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    name: string;
    options: [ColorOption, ColorOption];
    animate(t: any, display: any, options: any): void;
}
