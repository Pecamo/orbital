export interface BaseMessage {
    cmd: string;
    data?: any;
}

// Client -> Server
export type CSMessage = KeyMessage | JoinMessage;

export interface KeyMessage extends BaseMessage {
    cmd: 'press' | 'release';
    data: 'left' | 'right' | 'fire';
}

export interface JoinMessage extends BaseMessage {
    cmd: 'join';
}

// Server -> Client
export type SCMessage = SimpleStateMessage | PlayMessage | GetReadyMessage;

export interface SimpleStateMessage  extends BaseMessage {
    cmd: 'welcome' | 'wait' | 'won' | 'lost' | 'gameInProgress'
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
