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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("../env");
var NB_LED_1 = require("../NB_LED");
var htmlColors_1 = require("../htmlColors");
var GameOfLifeAnimation = /** @class */ (function () {
    function GameOfLifeAnimation(cells, previousCells) {
        if (cells === void 0) { cells = []; }
        if (previousCells === void 0) { previousCells = []; }
        this.cells = cells;
        this.previousCells = previousCells;
        this.name = "Game of Life";
        this.options = [
            { name: "Cells' Color", type: "color", default: htmlColors_1.HtmlColors.cyan },
        ];
    }
    GameOfLifeAnimation.prototype.animate = function (t, display, parameters) {
        var speed = env_1.LAMP_FPS / 6;
        var _a = __read(parameters, 1), color = _a[0];
        // init
        if (this.cells.length === 0) {
            for (var i = 0; i < NB_LED_1.NB_LED; i++) {
                this.cells[i] = (Math.random() < 0.5) ? 0 : 1;
            }
        }
        // draw
        for (var i = 0, l = this.cells.length; i < l; i++) {
            display.drawDot(i, color.withOpacity(this.cells[i] / 5));
        }
        // live
        if (t % Math.round(env_1.LAMP_FPS / speed) === 0) {
            this.live();
        }
    };
    GameOfLifeAnimation.prototype.live = function () {
        this.previousCells = __spreadArray([], __read(this.cells));
        for (var i = 0, l = this.cells.length; i < l; i++) {
            var previousAlive = this.previousCells[(i - 1) % l] === 0;
            var nextAlive = this.previousCells[(i + 1) % l] === 0;
            if (previousAlive !== nextAlive) {
                this.cells[i]++;
            }
            else {
                this.cells[i] = 0;
            }
        }
    };
    return GameOfLifeAnimation;
}());
exports.default = GameOfLifeAnimation;
