"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInt = exports.normalize = exports.temperatureToRgb = exports.mod = void 0;
var ct = __importStar(require("color-temperature"));
var color_1 = require("./color");
var NB_LED_1 = require("./NB_LED");
var htmlColors_1 = require("./htmlColors");
function mod(x, n) {
    return ((x % n) + n) % n;
}
exports.mod = mod;
function temperatureToRgb(temperature) {
    // Assume temperature in Kelvin
    // 1st step: too cold to glow (theorically 798K (Draper point), but it looks quite better like this)
    // 2nd step: the lib returns NaN or 0 for green under 652K
    // 3rd step: starts to emit green light, we can count on the lib
    var steps = [200, 652, 1000];
    if (temperature < steps[0]) {
        return htmlColors_1.HtmlColors.black;
    }
    else if (temperature < steps[1]) {
        var red = Math.round((temperature - steps[0]) * (255 / (steps[2] - steps[0])));
        return new color_1.Color(red, 0, 0);
    }
    else if (temperature < steps[2]) {
        var red = Math.round((temperature - steps[0]) * (255 / (steps[2] - steps[0])));
        var _a = ct.colorTemperature2rgb(temperature), green = _a.green, blue = _a.blue;
        return new color_1.Color(red, green, blue);
    }
    else {
        var _b = ct.colorTemperature2rgb(temperature), red = _b.red, green = _b.green, blue = _b.blue;
        return new color_1.Color(red, green, blue);
    }
}
exports.temperatureToRgb = temperatureToRgb;
function normalize(n) {
    return mod(n, NB_LED_1.NB_LED);
}
exports.normalize = normalize;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
exports.randomInt = randomInt;
