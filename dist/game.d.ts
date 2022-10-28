import { Color } from "./color";
import { Display } from "./display";
import { GameOptions } from "./types/GameOptions";
import { BattleRoyaleState } from "./mods/BattleRoyale";
export declare type Character = {
    id: number;
    x: number;
    color: Color;
    shotCooldown: number;
    shotRange: number;
    facesRight: boolean;
    alive: boolean;
};
export declare type Shot = {
    owner: string;
    x: number;
    facesRight: boolean;
    age: number;
    range: number;
};
export interface GameState {
    turnNb: number;
    startDate: Date;
    characters: Character[];
    shots: Shot[];
    winner?: Character;
    battleRoyale?: BattleRoyaleState;
}
declare type inputKeys = 'right' | 'left' | 'fire';
export declare type Inputs = {
    [key in inputKeys]: boolean;
};
declare type InputsState = Array<Partial<Inputs>>;
export declare class Game {
    fps: number;
    numberOfPlayers: number;
    display: Display;
    gameOptions: GameOptions;
    onCharacterDeathCallback?: (player: Character) => void;
    onNewStateCallback?: (state: GameState) => void;
    stageSize: number;
    gameState: GameState;
    heldInputs: InputsState;
    newInputs: Partial<InputsState>;
    constructor(fps: number, numberOfPlayers: number, display: Display, gameOptions: GameOptions, onCharacterDeathCallback?: (player: Character) => void, onNewStateCallback?: (state: GameState) => void);
    start(): Promise<Character>;
    move: (from: any, toAdd: any) => number;
    startingGameState: (nbCharacters: number) => GameState;
    static startingInputsState(nbPlayer: number): any[];
    toString(): string;
    tick(): Promise<Character>;
    static nextInputs(heldInputs: InputsState, newInputs: Partial<InputsState>): InputsState;
    nextState: (gameState: GameState, heldInputs: InputsState) => GameState;
}
export {};
