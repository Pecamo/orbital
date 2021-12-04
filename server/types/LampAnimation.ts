import { Display } from "../display"

type NumberOption = {
    type: 'number',
    min: number,
    max: number,
    step: number,
    default: number,
    display: 'range' | 'input',
};

type ColorOption = {
    type: 'color',
    default: string,
};

type SelectOption = {
    type: 'select',
    options: Array<{
        value: string,
        label: string,
    }>,
    default: string,
};

type TypeOfOption<O extends Option> = O['default'];

type Option = NumberOption | ColorOption | SelectOption;

export interface LampAnimation {
    name: string;
    options: Array<Option>;
    animate(t: number, display: Display, options: Array<TypeOfOption<Option>>): void;
}
