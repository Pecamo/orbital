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
Object.defineProperty(exports, "__esModule", { value: true });
var NB_LED_1 = require("../NB_LED");
var utils_1 = require("../utils");
var htmlColors_1 = require("../htmlColors");
var brightness = new Array(NB_LED_1.NB_LED).fill(0);
var lines = [];
var PIXEL_LIFE = 30;
var MIN_LINE_LENGTH = 20;
var MAX_LINE_LENGTH = 30;
var LINE_EACH = 8;
var CCW = false;
var MatrixAnimation = /** @class */ (function () {
    function MatrixAnimation() {
        this.name = "Matrix";
        this.options = [
            { name: "Tail Color", type: "color", default: htmlColors_1.HtmlColors.green },
            { name: "Head Color", type: "color", default: htmlColors_1.HtmlColors.white },
        ];
    }
    MatrixAnimation.prototype.animate = function (t, display, options) {
        var _a = __read(options, 2), color1 = _a[0], color2 = _a[1];
        if (t++ >= LINE_EACH) {
            lines.push({
                led: Math.floor(Math.random() * NB_LED_1.NB_LED),
                life: MIN_LINE_LENGTH + Math.random() * (MAX_LINE_LENGTH - MIN_LINE_LENGTH),
            });
        }
        // Move lines
        lines.forEach(function (line) {
            // Brighten pixel
            brightness[line.led] = PIXEL_LIFE;
            // Move head
            line.led = utils_1.normalize(line.led + (CCW ? -1 : 1));
            line.life -= 1;
        });
        // Remove dead lines
        lines = lines.filter(function (line) { return line.life > 0; });
        // Look for line heads
        var heads = lines.map(function (line) { return line.led; });
        // Draw
        for (var n = 0; n < NB_LED_1.NB_LED; n++) {
            brightness[n] = Math.max(0, brightness[n] - 1);
            if (heads.includes(n)) {
                display.drawDot(n, color2);
            }
            else {
                display.drawDot(n, color1.withOpacity(brightness[n] / PIXEL_LIFE));
            }
        }
    };
    return MatrixAnimation;
}());
exports.default = MatrixAnimation;
