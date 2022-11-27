import {NB_LED} from '../NB_LED';
import {normalize, temperatureToRgb} from "../utils";
import {LampAnimation, NumberOption, SelectOption} from "../types/LampAnimation";
import {Color} from '../color';
import {TOP_LED_NB} from '../env';

export default class FireAnimation implements LampAnimation<[NumberOption, SelectOption]> {
  public name = "Fire";
  public options: [NumberOption, SelectOption] = [
    {name: "Top Led Number", type: "number", default: TOP_LED_NB, min: 0, max: NB_LED, step: 1, display: 'range'},
    {
      name: "Color",
      type: "select",
      options: [
        {optionValue: 'red', label: "Red"},
        {optionValue: 'blue', label: "Blue"},
        {optionValue: 'green', label: "Green"},
        {optionValue: 'white', label: "White"},
      ],
      default: 'red'
    }
  ];

  private fireIntensityLeft = 0.5;
  private fireIntensityRight = 0.5;
  private previousTemperatures: number[] = [];
  private temperatures: number[] = [];

  constructor(private rotation: boolean) {
    this.name += rotation ? " rotating" : "";
  }

  private swapColorModifier(color: Color, modifier: 'red' | 'blue' | 'green' | 'white'): Color {
    switch (modifier) {
      case 'red':
        return new Color(color.r, color.g, color.b);
      case 'blue':
        return new Color(color.b, color.g, color.r);
      case 'green':
        return new Color(color.g, color.r, color.b);
      case 'white':
        return Color.getGray(color);
    }
  }

  public animate(t, display, options) {
    // Magic numbers that works quite well
    const minTemp = 1500;
    const maxTemp = 2500;
    const sourceVariationSpeed = 40 / NB_LED;
    const meanTemperatureDecrease = 80 * (80 / NB_LED);
    const temperatureDecreaseVariation = NB_LED;

    const [topLedNb, modifier] = options;

    for (let n = 1; n < NB_LED / 2; n++) {
      if (typeof this.previousTemperatures[n - 1] === 'undefined') {
        break;
      }

      const temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
      const temp = Math.max(this.previousTemperatures[n - 1] - temperatureDecrease, 0);
      this.temperatures[n] = temp;
      const color = this.swapColorModifier(temperatureToRgb(temp), modifier);

      if (!this.rotation) {
        display.drawDot(normalize(n + NB_LED / 2 + topLedNb), color);
      } else {
        display.drawDot(normalize(t - n + NB_LED / 2 + topLedNb), color);
      }
    }

    for (let n = NB_LED - 1; n >= NB_LED / 2; n--) {
      if (typeof this.previousTemperatures[n + 1] === 'undefined') {
        break;
      }

      const temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
      const temp = Math.max(this.previousTemperatures[n + 1] - temperatureDecrease, 0);
      this.temperatures[n] = temp;
      const color = this.swapColorModifier(temperatureToRgb(temp), modifier);

      if (!this.rotation) {
        display.drawDot(normalize(n + NB_LED / 2 + topLedNb), color);
      } else {
        display.drawDot(normalize(t + n + topLedNb), color);
      }
    }

    this.fireIntensityLeft += (Math.random() - 0.5) * sourceVariationSpeed;
    this.fireIntensityLeft = Math.min(Math.max(this.fireIntensityLeft, 0), 1);
    this.fireIntensityRight += (Math.random() - 0.5) * sourceVariationSpeed;
    this.fireIntensityRight = Math.min(Math.max(this.fireIntensityLeft, 0), 1);

    this.temperatures[0] = (maxTemp - minTemp) * this.fireIntensityLeft + minTemp;
    this.temperatures[NB_LED] = (maxTemp - minTemp) * this.fireIntensityRight + minTemp;

    if (!this.rotation) {
      display.drawDot(normalize(NB_LED / 2 + topLedNb), this.swapColorModifier(temperatureToRgb(this.temperatures[0]), modifier));
      display.drawDot(normalize(NB_LED / 2 + topLedNb - 1), this.swapColorModifier(temperatureToRgb(this.temperatures[NB_LED]), modifier));
    } else {
      display.drawDot(normalize(t + NB_LED / 2 + topLedNb), this.swapColorModifier(temperatureToRgb(this.temperatures[0]), modifier));
      display.drawDot(normalize(t + topLedNb), this.swapColorModifier(temperatureToRgb(this.temperatures[NB_LED]), modifier));

      const colorFront = this.swapColorModifier(temperatureToRgb(this.temperatures[0] - 500), modifier);
      display.drawDot(normalize(t + 1 + NB_LED / 2 + topLedNb), colorFront);
      display.drawDot(normalize(t + 1 + topLedNb), colorFront);
    }

    [...this.previousTemperatures] = [...this.temperatures];
  }
}
