import { Color } from "../color";
import { Display } from "../display";
export declare type NumberOption = {
    type: 'number';
    name: string;
    min: number;
    max: number;
    step: number;
    display: 'range' | 'input';
    default: number;
    currentCharacteristicValue?: number;
};
export declare type ColorOption = {
    type: 'color';
    name: string;
    default: Color;
    currentCharacteristicValue?: SmartColor;
};
export declare type SelectOption = {
    type: 'select';
    name: string;
    options: Array<{
        optionValue: string;
        label: string;
    }>;
    default: string;
    currentCharacteristicValue?: string;
};
export declare type Option = NumberOption | ColorOption | SelectOption;
export declare type OptionWithCurrentCharacteristic = Required<Option>;
export declare type NumberCharacteristic = {
    type: 'number';
    value: number;
};
export declare type SmartColorCharacteristic = {
    type: 'color';
    value: SmartColor;
};
export declare type SelectCharacteristic = {
    type: 'select';
    value: string;
};
export declare type Characteristic = NumberCharacteristic | SmartColorCharacteristic | SelectCharacteristic;
export declare type AnimateParameter = number | string | Color;
export interface LampAnimation<T extends Array<Option> = Array<Option>> {
    name: string;
    options: T;
    animate(t: number, display: Display, parameters: AnimateParameter[]): void;
}
export declare type StaticColor = {
    type: 'static';
    color: Color;
};
export declare type SmartGradientColor = {
    type: 'gradient';
    parameters: {
        colorFrom: Color;
        colorTo: Color;
    };
};
export declare type SmartRainbowColor = {
    type: 'rainbow';
};
export declare type SmartColor = StaticColor | SmartGradientColor | SmartRainbowColor;
