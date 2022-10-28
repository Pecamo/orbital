"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
var utils_1 = require("../utils");
var Line = /** @class */ (function () {
    function Line(stageSize, lineFrom, lineTo) {
        this.stageSize = stageSize;
        this.from = lineFrom;
        this.to = lineTo;
        this._isLooping = this.from > this.to;
    }
    Object.defineProperty(Line.prototype, "isLooping", {
        get: function () {
            return this._isLooping;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "from", {
        get: function () {
            return this._from;
        },
        set: function (x) {
            this._from = utils_1.mod(x, this.stageSize + 1);
            this._isLooping = this.from > this.to;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "to", {
        get: function () {
            return this._to;
        },
        set: function (x) {
            this._to = utils_1.mod(x, this.stageSize + 1);
            this._isLooping = this.from > this.to;
        },
        enumerable: false,
        configurable: true
    });
    Line.prototype.getLength = function () {
        if (this.isLooping) {
            return (this.stageSize - this.from) + this.to;
        }
        else {
            return this.to - this.from;
        }
    };
    Line.prototype.includes = function (x) {
        x = utils_1.mod(x, this.stageSize + 1);
        if (this.isLooping) {
            return (this.from <= x && x <= this.stageSize) || (x >= 0 && x <= this.to);
        }
        else {
            return this.from <= x && this.to >= x;
        }
    };
    Line.prototype.isOverlapping = function (line) {
        if (this.includes(line.from) || this.includes(line.to)) {
            return true;
        }
        else if (line.includes(this.from) || line.includes(this.to)) {
            return true;
        }
        else {
            return false;
        }
    };
    Line.prototype.merge = function (line) {
        var from;
        var to;
        if (this.includes(line.from)) {
            from = this.from;
        }
        else {
            from = line.from;
        }
        if (this.includes(line.to)) {
            to = this.to;
        }
        else {
            to = line.to;
        }
        return new Line(this.stageSize, from, to);
    };
    Line.simplifyArray = function (lines) {
        var simplifiedLines = [];
        if (lines.length < 2) {
            return lines;
        }
        lines = lines.sort(function (a, b) {
            return a.from - b.from;
        });
        var currentLine;
        for (var i = 0; i < lines.length - 1; i++) {
            if (lines[i].isOverlapping(lines[i + 1])) {
                if (currentLine) {
                    currentLine = currentLine.merge(lines[i + 1]);
                }
                else {
                    currentLine = lines[i].merge(lines[i + 1]);
                }
                // last loop
                if (i === lines.length - 2) {
                    simplifiedLines.push(currentLine);
                }
            }
            else {
                if (currentLine) {
                    simplifiedLines.push(currentLine);
                    currentLine = null;
                }
                else {
                    simplifiedLines.push(lines[i]);
                }
                // last loop
                if (i === lines.length - 2) {
                    simplifiedLines.push(lines[i + 1]);
                }
            }
        }
        if (simplifiedLines.length > 1 && simplifiedLines[0].isOverlapping(simplifiedLines[simplifiedLines.length - 1])) {
            var line1 = simplifiedLines.shift();
            var line2 = simplifiedLines.pop();
            var newLine = line1.merge(line2);
            simplifiedLines.push(newLine);
        }
        return simplifiedLines;
    };
    return Line;
}());
exports.Line = Line;
