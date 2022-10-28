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
var htmlColors_1 = require("../htmlColors");
var AlternatingAnimation = /** @class */ (function () {
    function AlternatingAnimation(duration) {
        this.duration = duration;
        this.name = "Alternating";
        this.options = [
            { name: "Color 1", type: "color", default: htmlColors_1.HtmlColors.cyan },
            { name: "Color 2", type: "color", default: htmlColors_1.HtmlColors.magenta },
        ];
    }
    AlternatingAnimation.prototype.animate = function (t, display, options) {
        var _a = __read(options, 2), color1 = _a[0], color2 = _a[1];
        var offset = Math.floor(t / this.duration) % 2;
        for (var n = 0; n < NB_LED_1.NB_LED; n++) {
            var colorParam = (Math.floor(n / 2) + offset) % 2;
            display.drawDot(n, [color1, color2][colorParam]);
        }
    };
    return AlternatingAnimation;
}());
exports.default = AlternatingAnimation;
