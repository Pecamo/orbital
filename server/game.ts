import { Player } from "./player";
import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";

export class Game {
    public players: Player[] = [];
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];
    public display: Display = new Display(300);

    constructor(public numberOfPlayer: number) {
        for (let i = 0; i < numberOfPlayer; i++) {
            this.players.push(new Player(Color.getRandom(), 0));
        }
    }

    public tick() {
        // Loop timing, keep at the begining
        const tickStart: Date = new Date();

        this.display.render();

        // Loop timing, keep at the end
        const tickEnd: Date = new Date();
        const diff = tickStart.getTime() - tickEnd.getTime();
        setTimeout(() => this.tick, diff);
    }
}
