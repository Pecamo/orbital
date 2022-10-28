"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("../env");
var NB_LED_1 = require("../NB_LED");
var Line_1 = require("../types/Line");
var utils_1 = require("../utils");
var htmlColors_1 = require("../htmlColors");
var FlashingSegmentsAnimation = /** @class */ (function () {
    function FlashingSegmentsAnimation(segmentsLife) {
        if (segmentsLife === void 0) { segmentsLife = []; }
        this.segmentsLife = segmentsLife;
        this.name = "Flashing Segments";
        this.options = [
            { name: "Flash Color", type: "color", default: htmlColors_1.HtmlColors.red },
        ];
    }
    FlashingSegmentsAnimation.prototype.animate = function (t, display, options) {
        var color = options[0];
        var nbSegments = 12;
        var segmentsLength = Math.round(NB_LED_1.NB_LED / nbSegments);
        var maxLife = env_1.LAMP_FPS / 4;
        if (t % Math.floor(env_1.LAMP_FPS / 20) === utils_1.randomInt(0, 10)) {
            var n = utils_1.randomInt(0, nbSegments - 1);
            if (typeof this.segmentsLife[n] === 'undefined' || this.segmentsLife[n] <= 0) {
                this.segmentsLife[n] = maxLife + utils_1.randomInt(-5, 5);
            }
        }
        for (var i = 0; i < nbSegments; i++) {
            if (this.segmentsLife[i] && this.segmentsLife[i] > 0) {
                var opacity = this.segmentsLife[i] / maxLife;
                display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, i * segmentsLength, (i + 1) * segmentsLength - 1), color.withOpacity(opacity));
                this.segmentsLife[i]--;
            }
        }
    };
    return FlashingSegmentsAnimation;
}());
exports.default = FlashingSegmentsAnimation;
