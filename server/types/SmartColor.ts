import { Color } from "../color";

export type SmartColor =
  | StaticColor
  | SmartGradientColor
  | SmartRainbowColor
  | SmartRandomColor;

export type StaticColor = {
  type: "static";
  color: Color;
};

export type SmartGradientColor = {
  type: "gradient";
  parameters: {
    colorFrom: Color;
    colorTo: Color;
  };
};

export type SmartRainbowColor = {
  type: "rainbow";
};

export type SmartRandomColor = {
  type: "random";
};
