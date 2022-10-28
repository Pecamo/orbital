import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class NoneAnimation implements LampAnimation<[ColorOption]> {
    name: string;
    options: [ColorOption];
    animate(t: any, display: any, options: any): void;
}
