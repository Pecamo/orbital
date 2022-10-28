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
exports.Color = void 0;
var Color = /** @class */ (function () {
    function Color(r, g, b, w) {
        if (w === void 0) { w = 0; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.w = w;
    }
    Color.getRandom = function () {
        return new Color(Color.getRandom255(), Color.getRandom255(), Color.getRandom255());
    };
    Color.getRandom255 = function () {
        return ~~(Math.random() * 256);
    };
    Color.invert = function (color) {
        return new Color(255 - color.r, 255 - color.g, 255 - color.b);
    };
    Color.overlap = function (color1, color2, ratio) {
        if (ratio === void 0) { ratio = 0.5; }
        return new Color(Math.round(color1.r * (1 - ratio) + color2.r * ratio), Math.round(color1.g * (1 - ratio) + color2.g * ratio), Math.round(color1.b * (1 - ratio) + color2.b * ratio));
    };
    Color.prototype.toString = function () {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    };
    Color.prototype.withOpacity = function (opacity) {
        opacity = Math.min(Math.max(opacity, 0), 1);
        return new Color(Math.round(this.r * opacity), Math.round(this.g * opacity), Math.round(this.b * opacity), Math.round(this.w * opacity));
    };
    Color.prototype.safe = function () {
        this.r = Math.max(0, Math.min(this.r, 255));
        this.g = Math.max(0, Math.min(this.g, 255));
        this.b = Math.max(0, Math.min(this.b, 255));
        this.w = Math.max(0, Math.min(this.w, 255));
    };
    Color.getRange = function (nb) {
        var tintIncrement = 256 * 6 / nb;
        return __spreadArray([], __read(Array(nb).keys())).map(function (c) {
            var tint = tintIncrement * c;
            var phase = tint % 256;
            if (tint < 256) {
                return new Color(255, phase, 0);
            }
            if (tint < 256 * 2) {
                return new Color(255 - phase, 255, 0);
            }
            if (tint < 256 * 3) {
                return new Color(0, 255, phase);
            }
            if (tint < 256 * 4) {
                return new Color(0, 255 - phase, 255);
            }
            if (tint < 256 * 5) {
                return new Color(phase, 0, 255);
            }
            return new Color(255, 0, 255 - phase);
        });
    };
    Color.fromHex = function (hexString) {
        return new Color(parseInt(hexString.substring(1, 3), 16), parseInt(hexString.substring(3, 5), 16), parseInt(hexString.substring(5, 7), 16), 0);
    };
    Color.toHex = function (color) {
        return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
    };
    Color.fromObject = function (colorObject) {
        var r = colorObject.r, g = colorObject.g, b = colorObject.b, w = colorObject.w;
        return new Color(r, g, b, w);
    };
    return Color;
}());
exports.Color = Color;
