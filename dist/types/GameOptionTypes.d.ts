export declare type GameOptionBoolean = {
    type: "boolean";
    value: boolean;
    default: boolean;
};
export declare type GameOptionEnum = {
    type: "enum";
    value: string;
    default: string;
    options: string[];
};
export declare type GameOptionNumber = {
    type: "number";
    value: number;
    default: number;
    min: number;
    max: number;
};
