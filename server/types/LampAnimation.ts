import { Display } from "../display"

export type NumberOption = {
    type: 'number',
    min: number,
    max: number,
    step: number,
    default: number,
    display: 'range' | 'input',
};

export type ColorOption = {
    type: 'color',
    default: string,
};

export type SelectOption = {
    type: 'select',
    options: Array<{
        value: string,
        label: string,
    }>,
    default: string,
};

type TypeOfOption<O extends Option> = O['default'];

type Option = NumberOption | ColorOption | SelectOption;

type Unpacked<T> = T extends Array<{value: infer U}> ? Array<U> : T;

type TypeOfOptions<T extends Array<Option>> = Array<Unpacked<Option>>;

export interface LampAnimation<T extends Array<Option>> {
    name: string;
    options: T;
    animate(t: number, display: Display, options: TypeOfOptions<T>): void;
}
