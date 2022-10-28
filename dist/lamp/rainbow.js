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
var NB_LED_1 = require("../NB_LED");
var color_1 = require("../color");
var convert = __importStar(require("color-convert"));
var RainbowAnimation = /** @class */ (function () {
    function RainbowAnimation() {
        this.name = "Rainbow";
        this.options = [];
    }
    RainbowAnimation.prototype.animate = function (t, display, options) {
        for (var n = 0; n < NB_LED_1.NB_LED; n++) {
            var rgb = convert.hsv.rgb([(n + t) * 360 / NB_LED_1.NB_LED, 100, 100]);
            var color = new color_1.Color(rgb[0], rgb[1], rgb[2]);
            display.drawDot(n, color);
        }
    };
    return RainbowAnimation;
}());
exports.default = RainbowAnimation;
