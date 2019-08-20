import { Player } from "./player";
import { Color } from "./color";
import { HtmlColors } from "./htmlColors";

export class Game {
    public players: Player[] = [];
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];

    constructor(public numberOfPlayer: number, ) {
        for (let i = 0; i < numberOfPlayer; i++) {
            this.players.push(new Player(Color.getRandom(), 0));
        }
    }
}
