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
var color_1 = require("../color");
var htmlColors_1 = require("../htmlColors");
var initial = { color: htmlColors_1.HtmlColors.white, life: 0 };
var StarsAnimation = /** @class */ (function () {
    function StarsAnimation(star_life) {
        this.star_life = star_life;
        this.name = "Stars";
        this.options = [
            { name: "Color 1", type: "color", default: htmlColors_1.HtmlColors.cyan },
            { name: "Color 2", type: "color", default: htmlColors_1.HtmlColors.magenta },
        ];
        this.stars = [];
        this.stars = new Array(NB_LED_1.NB_LED).fill(initial);
    }
    StarsAnimation.prototype.animate = function (t, display, options) {
        var _a = __read(options, 2), color1 = _a[0], color2 = _a[1];
        var newStar = Math.floor(Math.random() * NB_LED_1.NB_LED);
        var newColor = color_1.Color.overlap(color1, color2, Math.random());
        this.stars[newStar] = { color: newColor, life: this.star_life };
        for (var n = 0; n < NB_LED_1.NB_LED; n++) {
            var star = this.stars[n];
            display.drawDot(n, star.color.withOpacity(star.life / this.star_life));
            this.stars[n].life = Math.max(0, star.life - 1);
        }
    };
    return StarsAnimation;
}());
exports.default = StarsAnimation;
