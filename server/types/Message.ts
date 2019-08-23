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

// Server -> Server
export type SCMessage = StateMessage | WaitMessage;

export interface StateMessage extends BaseMessage {
    cmd: 'welcome' | 'wait' | 'play' | 'won' | 'lost' | 'gameInProgress'
}

export interface WaitMessage extends BaseMessage {
    cmd: 'getReady';
    data: number;
}
