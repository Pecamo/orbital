"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlColors_1 = require("../htmlColors");
var StrobeAnimation = /** @class */ (function () {
    function StrobeAnimation(duration) {
        this.duration = duration;
        this.name = "Strobe";
        this.options = [
            { name: "Color 1", type: "color", default: htmlColors_1.HtmlColors.white },
            { name: "Color 2", type: "color", default: htmlColors_1.HtmlColors.black },
        ];
    }
    StrobeAnimation.prototype.animate = function (t, display, options) {
        display.drawAll(options[Math.floor(t * 10 / this.duration) % 2]); // Yeah!
    };
    return StrobeAnimation;
}());
exports.default = StrobeAnimation;
