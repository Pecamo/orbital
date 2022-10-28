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
var env_1 = require("../env");
var NB_LED_1 = require("../NB_LED");
var Line_1 = require("../types/Line");
var utils_1 = require("../utils");
var htmlColors_1 = require("../htmlColors");
var OldSchoolSegmentsAnimation = /** @class */ (function () {
    function OldSchoolSegmentsAnimation(segmentsLife) {
        if (segmentsLife === void 0) { segmentsLife = []; }
        this.segmentsLife = segmentsLife;
        this.name = "Old School Segments";
        this.options = [
            { name: "Segments' Color", type: "color", default: htmlColors_1.HtmlColors.gold },
        ];
    }
    OldSchoolSegmentsAnimation.prototype.animate = function (t, display, options) {
        var _a = __read(options, 1), color = _a[0];
        var nbSegments = 8; // TODO set as parameter
        var blockLength = Math.round(NB_LED_1.NB_LED / nbSegments);
        var separatorsLength = 2;
        var marginsLength = 2;
        var segmentsLength = blockLength - separatorsLength - marginsLength * 2;
        var maxLife = env_1.LAMP_FPS * 2;
        if (t % Math.floor(env_1.LAMP_FPS / 3) === 0) {
            var n = utils_1.randomInt(0, nbSegments - 1);
            if (typeof this.segmentsLife[n] === 'undefined' || this.segmentsLife[n] <= 0) {
                this.segmentsLife[n] = maxLife + utils_1.randomInt(-5, 5);
            }
        }
        var pos = 0;
        for (var i = 0; i < nbSegments; i++) {
            display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, pos, pos + separatorsLength - 1), color);
            pos += separatorsLength;
            pos += marginsLength;
            if (this.segmentsLife[i] && this.segmentsLife[i] > 0) {
                var opacity = OldSchoolSegmentsAnimation.computeOpacity(this.segmentsLife[i], maxLife);
                display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, pos, pos + segmentsLength - 1), color.withOpacity(opacity));
                this.segmentsLife[i]--;
            }
            pos += segmentsLength;
            pos += marginsLength;
        }
    };
    OldSchoolSegmentsAnimation.computeOpacity = function (life, maxLife) {
        if (life > maxLife * 3 / 4) {
            return (maxLife - life) / (maxLife / 4);
        }
        else if (life < maxLife / 4) {
            return life / (maxLife / 4);
        }
        else {
            return 1;
        }
    };
    return OldSchoolSegmentsAnimation;
}());
exports.default = OldSchoolSegmentsAnimation;
