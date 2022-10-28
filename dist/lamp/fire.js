"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var NB_LED_1 = require("../NB_LED");
var utils_1 = require("../utils");
var env_1 = require("../env");
var FireAnimation = /** @class */ (function () {
    function FireAnimation(rotation) {
        this.rotation = rotation;
        this.name = "Fire";
        this.options = [
            { name: "Top Led Number", type: "number", default: env_1.TOP_LED_NB, min: 0, max: NB_LED_1.NB_LED, step: 1, display: 'range' }
        ];
        this.fireIntensityLeft = 0.5;
        this.fireIntensityRight = 0.5;
        this.previousTemperatures = [];
        this.temperatures = [];
        this.name += rotation ? " rotating" : "";
    }
    FireAnimation.prototype.animate = function (t, display, options) {
        var _a;
        // Magic numbers that works quite well
        var minTemp = 1500;
        var maxTemp = 2500;
        var sourceVariationSpeed = 40 / NB_LED_1.NB_LED;
        var meanTemperatureDecrease = 80 * (80 / NB_LED_1.NB_LED);
        var temperatureDecreaseVariation = NB_LED_1.NB_LED;
        var topLedNb = options[0];
        for (var n = 1; n < NB_LED_1.NB_LED / 2; n++) {
            if (typeof this.previousTemperatures[n - 1] === 'undefined') {
                break;
            }
            var temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
            var temp = Math.max(this.previousTemperatures[n - 1] - temperatureDecrease, 0);
            this.temperatures[n] = temp;
            var color = utils_1.temperatureToRgb(temp);
            if (!this.rotation) {
                display.drawDot(utils_1.normalize(n + NB_LED_1.NB_LED / 2 + topLedNb), color);
            }
            else {
                display.drawDot(utils_1.normalize(t - n + NB_LED_1.NB_LED / 2 + topLedNb), color);
            }
        }
        for (var n = NB_LED_1.NB_LED - 1; n >= NB_LED_1.NB_LED / 2; n--) {
            if (typeof this.previousTemperatures[n + 1] === 'undefined') {
                break;
            }
            var temperatureDecrease = (Math.random() - 0.5) * temperatureDecreaseVariation + meanTemperatureDecrease;
            var temp = Math.max(this.previousTemperatures[n + 1] - temperatureDecrease, 0);
            this.temperatures[n] = temp;
            var color = utils_1.temperatureToRgb(temp);
            if (!this.rotation) {
                display.drawDot(utils_1.normalize(n + NB_LED_1.NB_LED / 2 + topLedNb), color);
            }
            else {
                display.drawDot(utils_1.normalize(t + n + topLedNb), color);
            }
        }
        this.fireIntensityLeft += (Math.random() - 0.5) * sourceVariationSpeed;
        this.fireIntensityLeft = Math.min(Math.max(this.fireIntensityLeft, 0), 1);
        this.fireIntensityRight += (Math.random() - 0.5) * sourceVariationSpeed;
        this.fireIntensityRight = Math.min(Math.max(this.fireIntensityLeft, 0), 1);
        this.temperatures[0] = (maxTemp - minTemp) * this.fireIntensityLeft + minTemp;
        this.temperatures[NB_LED_1.NB_LED] = (maxTemp - minTemp) * this.fireIntensityRight + minTemp;
        if (!this.rotation) {
            display.drawDot(utils_1.normalize(NB_LED_1.NB_LED / 2 + topLedNb), utils_1.temperatureToRgb(this.temperatures[0]));
            display.drawDot(utils_1.normalize(NB_LED_1.NB_LED / 2 + topLedNb - 1), utils_1.temperatureToRgb(this.temperatures[NB_LED_1.NB_LED]));
        }
        else {
            display.drawDot(utils_1.normalize(t + NB_LED_1.NB_LED / 2 + topLedNb), utils_1.temperatureToRgb(this.temperatures[0]));
            display.drawDot(utils_1.normalize(t + topLedNb), utils_1.temperatureToRgb(this.temperatures[NB_LED_1.NB_LED]));
            var colorFront = utils_1.temperatureToRgb(this.temperatures[0] - 500);
            display.drawDot(utils_1.normalize(t + 1 + NB_LED_1.NB_LED / 2 + topLedNb), colorFront);
            display.drawDot(utils_1.normalize(t + 1 + topLedNb), colorFront);
        }
        _a = __read(__spreadArray([], __read(this.temperatures))), this.previousTemperatures = _a.slice(0);
    };
    return FireAnimation;
}());
exports.default = FireAnimation;
