import { Color } from "./color";

export class Player {
    constructor(
        public color: Color,
        public x: number,
        public speed: number = 1,
        public alive: boolean = true,
        public faceRight: boolean = true,
        public shotCooldown: number = 1,
    ) {}
}
