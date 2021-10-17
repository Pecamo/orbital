import { Display } from "../display";
import { TOP_LED_NB } from "../env";
import { NB_LED } from "../server";
import { normalize, temperatureToRgb } from "../utils";

export class Fire {
    static fireIntensityLeft = 0.5;
    static fireIntensityRight = 0.5;
    static previousTemperatures: number[] = [];
    static temperatures: number[] = [];

    static animate(t: number, display: Display, rotation: boolean): void {
        // Magic numbers that works quite well
        const minTemp = 1500;
        const maxTemp = 2500;
        const sourceVariationSpeed = 40 / NB_LED;
        const meanTemperatureDecrease = 80 * (80 / NB_LED);
        const temperatureDecreaseVariation = NB_LED;

        for (let n = 1; n < NB_LED / 2; n++) {
            if (typeof Fire.previousTemperatures[n - 1] === 'undefined') {
                break;
            }

            const temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
            const temp = Math.max(Fire.previousTemperatures[n - 1] - temperatureDecrease, 0);
            Fire.temperatures[n] = temp;
            const color = temperatureToRgb(temp);

            if (!rotation) {
                display.drawDot(normalize(n + NB_LED / 2 + TOP_LED_NB), color);
            } else {
                display.drawDot(normalize(t - n + NB_LED / 2 + TOP_LED_NB), color);
            }
        }

        for (let n = NB_LED - 1; n >= NB_LED / 2; n--) {
            if (typeof Fire.previousTemperatures[n + 1] === 'undefined') {
                break;
            }

            const temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
            const temp = Math.max(Fire.previousTemperatures[n + 1] - temperatureDecrease, 0);
            Fire.temperatures[n] = temp;
            const color = temperatureToRgb(temp);

            if (!rotation) {
                display.drawDot(normalize(n + NB_LED / 2 + TOP_LED_NB), color);
            } else {
                display.drawDot(normalize(t + n + TOP_LED_NB), color);
            }
        }

        Fire.fireIntensityLeft += (Math.random() - 0.5) * sourceVariationSpeed;
        Fire.fireIntensityLeft = Math.min(Math.max(Fire.fireIntensityLeft, 0), 1);
        Fire.fireIntensityRight += (Math.random() - 0.5) * sourceVariationSpeed;
        Fire.fireIntensityRight = Math.min(Math.max(Fire.fireIntensityLeft, 0), 1);

        Fire.temperatures[0] = (maxTemp - minTemp) * Fire.fireIntensityLeft + minTemp;
        Fire.temperatures[NB_LED] = (maxTemp - minTemp) * Fire.fireIntensityRight + minTemp;

        if (!rotation) {
            display.drawDot(normalize(NB_LED / 2 + TOP_LED_NB), temperatureToRgb(Fire.temperatures[0]));
            display.drawDot(normalize(NB_LED / 2 + TOP_LED_NB - 1), temperatureToRgb(Fire.temperatures[NB_LED]));
        } else {
            display.drawDot(normalize(t + NB_LED / 2 + TOP_LED_NB), temperatureToRgb(Fire.temperatures[0]));
            display.drawDot(normalize(t + TOP_LED_NB), temperatureToRgb(Fire.temperatures[NB_LED]));

            const colorFront = temperatureToRgb(Fire.temperatures[0] - 500);
            display.drawDot(normalize(t + 1 + NB_LED / 2 + TOP_LED_NB), colorFront);
            display.drawDot(normalize(t + 1 + TOP_LED_NB), colorFront);
        }

        [...Fire.previousTemperatures] = [...Fire.temperatures];
    }
}
