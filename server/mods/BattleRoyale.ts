import { Display } from "../display";
import { GameState } from "../game";
import { HtmlColors } from "../htmlColors";
import { Line } from "../types/Line";

export type BattleRoyaleState = {
    warnLines: Line[],
    deathLines: Line[],
    lastExpansion: number,
};

export class BattleRoyale {
    private static DEATH_COLOR = HtmlColors.orangered;
    private static WARN_COLOR = HtmlColors.darkred;
    private static EXPANSION_SIZE = 10;
    private static EXPANSION_DELAY = 200;

    public static startingGameState: BattleRoyaleState = {
        warnLines: [],
        deathLines: [],
        lastExpansion: 0,
    }

    public static tick(gameState: GameState, display: Display) {
        Line.simplifyArray(gameState.battleRoyale.deathLines).forEach(line => display.drawLine(line, this.DEATH_COLOR));
        Line.simplifyArray(gameState.battleRoyale.warnLines).forEach(line => display.drawLine(line, this.WARN_COLOR));
    }

    public static nextState(gameState: GameState, nextState: GameState, stageSize: number): BattleRoyaleState {
        if (gameState.turnNb >= this.startingGameState.lastExpansion + this.EXPANSION_DELAY) {
            this.startingGameState.lastExpansion = gameState.turnNb;

            const warnLines = Line.simplifyArray(gameState.battleRoyale.warnLines);
            const deathLines = Line.simplifyArray(gameState.battleRoyale.deathLines);

            // Init
            if (warnLines.length === 0 && deathLines.length === 0) {
                const initX = ~~(Math.random() * stageSize + 1);

                nextState.battleRoyale.warnLines = [new Line(stageSize, initX, initX + this.EXPANSION_SIZE)];
            } else {
                // New Death Lines
                warnLines.forEach(warnLine => {
                    nextState.battleRoyale.deathLines.push(new Line(stageSize, warnLine.from, warnLine.to));
                });

                nextState.battleRoyale.deathLines = Line.simplifyArray(nextState.battleRoyale.deathLines);

                nextState.battleRoyale.warnLines = [];

                // New Warn Lines
                nextState.battleRoyale.deathLines.forEach(deathLine => {
                    nextState.battleRoyale.warnLines.push(new Line(stageSize, deathLine.to, deathLine.to + this.EXPANSION_SIZE));
                    nextState.battleRoyale.warnLines.push(new Line(stageSize, deathLine.from - this.EXPANSION_SIZE, deathLine.from));
                });

                nextState.battleRoyale.warnLines = Line.simplifyArray(nextState.battleRoyale.warnLines);
            }
        }

        return nextState.battleRoyale;
    }
}
