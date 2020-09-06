export type GameOptionBoolean = {
    type: "boolean",
    value: boolean,
    default: boolean,
};

export type GameOptionEnum = {
    type: "enum",
    value: string,
    default: string,
    options: string[],
};

export type GameOptionNumber = {
    type: "number",
    value: number,
    default: number,
    min: number,
    max: number,
};
