"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlColors_1 = require("../htmlColors");
var Strobe2Animation = /** @class */ (function () {
    function Strobe2Animation() {
        this.name = "Strobe2";
        this.options = [
            { name: "Short Color", type: "color", default: htmlColors_1.HtmlColors.white },
            { name: "Long Color", type: "color", default: htmlColors_1.HtmlColors.black },
        ];
    }
    Strobe2Animation.prototype.animate = function (t, display, options) {
        if (t % 10 === 0) {
            display.drawAll(options[0]);
        }
        else {
            display.drawAll(options[1]);
        }
    };
    return Strobe2Animation;
}());
exports.default = Strobe2Animation;
