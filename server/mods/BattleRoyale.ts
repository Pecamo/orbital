import { warn } from "console";
import { Display } from "../display";
import { GameState } from "../game";
import { HtmlColors } from "../htmlColors";
import { Line } from "../primitives";

export type BattleRoyaleState = {
    warnLines: Line[],
    deathLines: Line[],
};

export class BattleRoyale {
    private static DEATH_COLOR = HtmlColors.orangered;
    private static WARN_COLOR = HtmlColors.darkred;
    private static EXPANSION_SIZE = 10;
    private static EXPANSION_DELAY = 100;
    private static lastExansion = 0;

    public static startingGameState: BattleRoyaleState = {
        warnLines: [],
        deathLines: [],
    }

    public static tick(gameState: GameState, display: Display) {
        // gameState.battleRoyale.deathX.forEach(x => display.drawLine(x, this.DEATH_COLOR));
        // gameState.battleRoyale.warnX.forEach(x => display.drawDot(x, this.WARN_COLOR));
    }

    public static nextState(gameState: GameState, nextState: GameState, stageSize: number): BattleRoyaleState {
        if (gameState.turnNb + this.EXPANSION_DELAY > this.lastExansion) {
            this.lastExansion = gameState.turnNb;

            const warnLines = gameState.battleRoyale.warnLines;
            const deathLines = gameState.battleRoyale.deathLines;

            // Init
            if (warnLines.length === 0 && deathLines.length === 0) {
                const initX = ~~(Math.random() * stageSize + 1);

                nextState.battleRoyale.warnLines = [new Line(stageSize, initX, initX + this.EXPANSION_SIZE)];
            } else {
                // 2nd phase
                if (deathLines.length === 0) {    
                    nextState.battleRoyale.deathLines = [new Line(stageSize, warnLines[0].from, warnLines[0].to)];
                }

                nextState.battleRoyale.warnLines = [];

                deathLines.forEach(deathLine => {
                    nextState.battleRoyale.warnLines.push(new Line(stageSize, deathLine.to, deathLine.to + this.EXPANSION_SIZE));
                    nextState.battleRoyale.warnLines.push(new Line(stageSize, deathLine.from, deathLine.from - this.EXPANSION_SIZE));
                });
            }

        }

        return nextState.battleRoyale;
    }
}
