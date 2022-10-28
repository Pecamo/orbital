"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var htmlColors_1 = require("../htmlColors");
var NoneAnimation = /** @class */ (function () {
    function NoneAnimation() {
        this.name = "None";
        this.options = [
            { name: "Static Color", type: "color", default: htmlColors_1.HtmlColors.black }
        ];
    }
    NoneAnimation.prototype.animate = function (t, display, options) {
        display.drawAll(options[0]);
    };
    return NoneAnimation;
}());
exports.default = NoneAnimation;
