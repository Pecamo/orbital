import { Display } from "../display";
import { NB_LED } from "../server";
import { temperatureToRgb } from "../utils";

export class Fire {
    static fireIntensity = 0.5;
    static previousTemperatures: number[] = [];
    static temperatures: number[] = [];

    static animate(display: Display): void {
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
            display.drawDot(n, color);
        }

        for (let n = NB_LED - 1; n >= NB_LED / 2; n--) {
            if (typeof Fire.previousTemperatures[n + 1] === 'undefined') {
                break;
            }

            const temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
            const temp = Math.max(Fire.previousTemperatures[n + 1] - temperatureDecrease, 0);
            Fire.temperatures[n] = temp;
            const color = temperatureToRgb(temp);
            display.drawDot(n, color);
        }

        Fire.fireIntensity += (Math.random() - 0.5) * sourceVariationSpeed;
        Fire.fireIntensity = Math.min(Math.max(Fire.fireIntensity, 0), 1);

        Fire.temperatures[0] = (maxTemp - minTemp) * Fire.fireIntensity + minTemp;
        Fire.temperatures[NB_LED] = (maxTemp - minTemp) * Fire.fireIntensity + minTemp;

        const color = temperatureToRgb(Fire.temperatures[0]);

        display.drawDot(0, color);
        display.drawDot(NB_LED, color);

        [...Fire.previousTemperatures] = [...Fire.temperatures];
    }
}
