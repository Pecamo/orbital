import { Color } from "../color";
import { Display } from "../display"

export type NumberOption = {
    type: 'number',
    name: string,
    min: number,
    max: number,
    step: number,
    display: 'range' | 'input',
    default: number,
    currentCharacteristicValue?: number,
};

export type ColorOption = {
    type: 'color',
    name: string,
    default: Color,
    currentCharacteristicValue?: SmartColor,
};

export type SelectOption = {
    type: 'select',
    name: string,
    options: Array<{
        optionValue: string,
        label: string,
    }>,
    default: string,
    currentCharacteristicValue?: string,
};

export type Option = NumberOption | ColorOption | SelectOption;

export type OptionWithCurrentCharacteristic = Required<Option>;

export type NumberCharacteristic = {
    type: 'number',
    value: number,
};

export type SmartColorCharacteristic = {
    type: 'color',
    value: SmartColor,
};

export type SelectCharacteristic = {
    type: 'select',
    value: string,
};

export type Characteristic = NumberCharacteristic |SmartColorCharacteristic | SelectCharacteristic;

export type AnimateParameter = number | string | Color;

export interface LampAnimation<T extends Array<Option> = Array<Option>> {
    name: string;
    options: T;
    animate(t: number, display: Display, parameters: AnimateParameter[]): void;
}

export type StaticColor = {
    type: 'static',
    color: Color,
};

export type SmartGradientColor = {
    type: 'gradient',
    parameters: {
        colorFrom: Color,
        colorTo: Color,
    },
};

export type SmartRainbowColor = {
    type: 'rainbow'
};

export type SmartColor = StaticColor | SmartGradientColor | SmartRainbowColor;
