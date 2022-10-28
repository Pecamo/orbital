"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NB_LED_1 = require("../NB_LED");
var utils_1 = require("../utils");
var htmlColors_1 = require("../htmlColors");
var SlidingWindowAnimation = /** @class */ (function () {
    function SlidingWindowAnimation() {
        this.name = "Sliding Window";
        this.options = [
            { name: "Main Color", type: "color", default: htmlColors_1.HtmlColors.white },
        ];
    }
    SlidingWindowAnimation.prototype.animate = function (t, display, options) {
        var speed = NB_LED_1.NB_LED / 30;
        for (var n = 0; n < NB_LED_1.NB_LED / 3; n++) {
            display.drawDot(utils_1.normalize(n + Math.floor(t * speed)), options[0]);
        }
    };
    return SlidingWindowAnimation;
}());
exports.default = SlidingWindowAnimation;
