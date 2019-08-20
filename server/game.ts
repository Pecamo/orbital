import { Character } from "./character";
import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";

export class Game {
    public fps: number = 60;
    public players: Character[] = [];
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];
    public display: Display = new Display(300);

    constructor(public numberOfPlayer: number) {
        for (let i = 0; i < numberOfPlayer; i++) {
            this.players.push(new Character(Color.getRandom(), 0));
        }
    }

    public tick() {
        // Loop timing, keep at the begining
        const tickStart: Date = new Date();

        this.display.render();

        // Loop timing, keep at the end
        const tickEnd: Date = new Date();
        const diff = tickStart.getTime() - tickEnd.getTime();
        const waitingTime = this.fps - diff / 1000;
        setTimeout(() => this.tick, waitingTime);
    }
}
