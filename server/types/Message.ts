import { GameOptions } from "./GameOptions";

export interface BaseMessage {
    cmd: string;
    data?: any;
}

// Client -> Server
export type CSMessage = KeyMessage | JoinMessage | SpectateMessage | QueryGameOptionsMessage | WriteGameOptionsMessage;

export interface KeyMessage extends BaseMessage {
    cmd: 'press' | 'release';
    data: 'left' | 'right' | 'fire';
}

export interface JoinMessage extends BaseMessage {
    cmd: 'join';
}

export interface SpectateMessage extends BaseMessage {
    cmd: 'spectate';
}

export interface QueryGameOptionsMessage {
    cmd: 'queryGameOptions';
}

export interface WriteGameOptionsMessage {
    cmd: 'writeGameOptions';
    data: GameOptions;
}

// Server -> Client
export type SCMessage = SimpleStateMessage | PlayMessage | GetReadyMessage | SpectateDataMessage | ReadGameOptionsMessage;

export interface SimpleStateMessage  extends BaseMessage {
    cmd: 'welcome' | 'wait' | 'won' | 'lost' | 'gameInProgress'
}

export interface SpectateDataMessage extends BaseMessage {
    cmd: 'spectateData';
    data: Object;
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
