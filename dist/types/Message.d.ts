import { Character } from "../game";
import { GameOptions } from "./GameOptions";
export interface BaseMessage {
    cmd: string;
    data?: any;
}
export declare type CSMessage = KeyMessage | JoinMessage | CancelMessage | SpectateMessage | QueryGameOptionsMessage | WriteGameOptionsMessage;
export interface KeyMessage extends BaseMessage {
    cmd: 'press' | 'release';
    data: 'left' | 'right' | 'fire';
}
export interface JoinMessage extends BaseMessage {
    cmd: 'join';
}
export interface CancelMessage extends BaseMessage {
    cmd: 'cancel';
}
export interface SpectateMessage extends BaseMessage {
    cmd: 'spectate';
}
export interface QueryGameOptionsMessage {
    cmd: 'queryGameOptions';
}
export interface WriteGameOptionsMessage {
    cmd: 'writeGameOptions';
    data: {
        [key in keyof GameOptions]: {
            value: any;
        };
    };
}
export declare type SCMessage = SimpleStateMessage | PlayMessage | GetReadyMessage | SpectateDataMessage | SpectateEndMessage | ReadGameOptionsMessage;
export interface SimpleStateMessage extends BaseMessage {
    cmd: 'welcome' | 'wait' | 'won' | 'lost' | 'gameInProgress';
}
export interface SpectateDataMessage extends BaseMessage {
    cmd: 'spectateData';
    data: Object;
}
export interface SpectateEndMessage extends BaseMessage {
    cmd: 'spectateEnd';
    data: {
        winner: Character;
    };
}
export interface PlayMessage {
    cmd: 'play';
    color: string;
}
export interface GetReadyMessage extends BaseMessage {
    cmd: 'getReady';
    data: number;
    color: string;
}
export interface ReadGameOptionsMessage {
    cmd: 'readGameOptions';
    data: GameOptions;
}
