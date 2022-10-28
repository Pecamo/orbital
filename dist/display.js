"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
var color_1 = require("./color");
var htmlColors_1 = require("./htmlColors");
var display_api_1 = require("./display-api");
var Line_1 = require("./types/Line");
var Display = /** @class */ (function () {
    function Display(size, rootHost, rootPort, invertOrientation) {
        if (invertOrientation === void 0) { invertOrientation = false; }
        this.size = size;
        this.invertOrientation = invertOrientation;
        this.brightness = 100;
        this.previousFrame = this.newBlackArray(this.size);
        this.nextFrame = this.newBlackArray(this.size);
        this.displayApi = new display_api_1.DisplayAPI(size, rootHost, rootPort);
    }
    Display.prototype.render = function () {
        var _this = this;
        if (this.invertOrientation) {
            this.nextFrame.reverse();
        }
        this.brightness = Math.max(0, Math.min(this.brightness, 100));
        if (this.brightness < 100) {
            this.nextFrame = this.nextFrame.map(function (color) { return color.withOpacity(_this.brightness / 100); });
        }
        this.nextFrame.forEach(function (color) { return color === null || color === void 0 ? void 0 : color.safe(); });
        this.displayApi.set(this.nextFrame);
        // Keep at the end
        this.previousFrame = this.nextFrame;
        this.nextFrame = this.newBlackArray(this.size);
    };
    Display.prototype.drawDot = function (index, color) {
        this.nextFrame[index] = color;
    };
    Display.prototype.drawLine = function (line, color) {
        if (line.isLooping) {
            for (var i = line.from; i <= this.size; i++) {
                this.nextFrame[i] = color;
            }
            for (var i = 0; i <= line.to; i++) {
                this.nextFrame[i] = color;
            }
        }
        else {
            for (var i = line.from; i <= line.to; i++) {
                this.nextFrame[i] = color;
            }
        }
    };
    Display.prototype.drawGradient = function (line, colorFrom, colorTo) {
        var length = line.getLength();
        if (line.isLooping) {
            for (var i = line.from; i <= this.size; i++) {
                var ratio = (i - line.from) / length;
                this.nextFrame[i] = color_1.Color.overlap(colorFrom, colorTo, ratio);
            }
            for (var i = 0; i <= line.to; i++) {
                var ratio = (i + this.size - line.from) / length;
                this.nextFrame[i] = color_1.Color.overlap(colorFrom, colorTo, ratio);
            }
        }
        else {
            for (var i = line.from; i <= line.to; i++) {
                var ratio = (i - line.from) / length;
                this.nextFrame[i] = color_1.Color.overlap(colorFrom, colorTo, ratio);
            }
        }
    };
    Display.prototype.drawAll = function (color) {
        this.drawLine(new Line_1.Line(this.size, 0, this.size), color);
    };
    Display.prototype.get = function (index) {
        return this.nextFrame[index];
    };
    Display.prototype.screenshot = function () {
        return this.previousFrame;
    };
    Display.prototype.clear = function () {
        this.drawAll(htmlColors_1.HtmlColors.black);
    };
    Display.prototype.newBlackArray = function (length) {
        var arr = [];
        for (var i = 0; i < length; i++) {
            arr[i] = htmlColors_1.HtmlColors.black;
        }
        return arr;
    };
    return Display;
}());
exports.Display = Display;
