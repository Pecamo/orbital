import { LampAnimation } from "../types/LampAnimation";
export default class RainbowAnimation implements LampAnimation<[]> {
    name: string;
    options: [];
    animate(t: any, display: any, options: any): void;
}
