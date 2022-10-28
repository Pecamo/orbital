"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlColors_1 = require("../htmlColors");
var NB_LED_1 = require("../NB_LED");
var Line_1 = require("../types/Line");
var utils_1 = require("../utils");
var FlashingApertureAnimation = /** @class */ (function () {
    function FlashingApertureAnimation() {
        this.name = "Flashing Aperture";
        this.options = [
            { name: "Static Color", type: "color", default: htmlColors_1.HtmlColors.orange }
        ];
        this.FLASH_DUR = 10;
        this.APERTURE_DUR = 25;
        this.OFF_DUR = 25;
        this.NB_OF_SEGMENTS = 5; // 3 is cool as well
        this.SEG_LENGTH = Math.floor(NB_LED_1.NB_LED / this.NB_OF_SEGMENTS);
        this.lines = [];
        this.shift = 0;
        this.lines = [];
        for (var i = 0; i < this.NB_OF_SEGMENTS; i++) {
            this.lines.push(new Line_1.Line(NB_LED_1.NB_LED, i * this.SEG_LENGTH, (i + 1) * this.SEG_LENGTH - 1));
        }
    }
    FlashingApertureAnimation.prototype.animate = function (t, display, options) {
        var _this = this;
        var color = options[0];
        var step = t % (this.FLASH_DUR + this.APERTURE_DUR + this.OFF_DUR);
        // Randomize segments positions
        if (step === 0) {
            this.shift = utils_1.randomInt(0, this.SEG_LENGTH - 1);
            this.lines.forEach(function (l) { return l.from += _this.shift; });
        }
        if (step < this.FLASH_DUR) {
            // Flash
            display.drawAll(color);
        }
        else if (step < this.FLASH_DUR + this.APERTURE_DUR) {
            // Aperture
            for (var i = 0; i < this.lines.length; i++) {
                var ratio = 1 - (step - this.FLASH_DUR) / this.APERTURE_DUR;
                var length_1 = ratio * this.SEG_LENGTH;
                this.lines[i].to = this.lines[i].from + length_1 - 1;
                display.drawGradient(this.lines[i], color.withOpacity(ratio * 2), color.withOpacity(ratio));
            }
        }
        else {
            // Off
            display.drawAll(htmlColors_1.HtmlColors.black);
        }
    };
    return FlashingApertureAnimation;
}());
exports.default = FlashingApertureAnimation;
