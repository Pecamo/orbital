import { Display } from "../display";
import { GameState } from "../game";
import { Line } from "../types/Line";
export declare type BattleRoyaleState = {
    warnLines: Line[];
    deathLines: Line[];
    lastExpansion: number;
};
export declare class BattleRoyale {
    private static DEATH_COLOR;
    private static WARN_COLOR;
    private static EXPANSION_SIZE;
    private static EXPANSION_DELAY;
    static startingGameState: BattleRoyaleState;
    static tick(gameState: GameState, display: Display): void;
    static nextState(gameState: GameState, nextState: GameState, stageSize: number): BattleRoyaleState;
}
