export interface Message {
    cmd: string;
    data?: any,
}

export class MoveMessage implements Message {
    public cmd = 'move';
    public data = { directionRight: true };
}

export class ShootMessage implements Message {
    public cmd = 'shoot';
}

export class ClearMessage implements Message {
    public cmd = 'clear';
}
