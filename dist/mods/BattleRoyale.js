"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleRoyale = void 0;
var color_1 = require("../color");
var Line_1 = require("../types/Line");
var BattleRoyale = /** @class */ (function () {
    function BattleRoyale() {
    }
    BattleRoyale.tick = function (gameState, display) {
        var _this = this;
        Line_1.Line.simplifyArray(gameState.battleRoyale.deathLines).forEach(function (line) { return display.drawLine(line, _this.DEATH_COLOR); });
        Line_1.Line.simplifyArray(gameState.battleRoyale.warnLines).forEach(function (line) { return display.drawLine(line, _this.WARN_COLOR); });
    };
    BattleRoyale.nextState = function (gameState, nextState, stageSize) {
        var _this = this;
        if (gameState.turnNb >= gameState.battleRoyale.lastExpansion + this.EXPANSION_DELAY) {
            nextState.battleRoyale.lastExpansion = gameState.turnNb;
            var warnLines = Line_1.Line.simplifyArray(gameState.battleRoyale.warnLines);
            var deathLines = Line_1.Line.simplifyArray(gameState.battleRoyale.deathLines);
            // Init
            if (warnLines.length === 0 && deathLines.length === 0) {
                var initX = ~~(Math.random() * stageSize + 1);
                nextState.battleRoyale.warnLines = [new Line_1.Line(stageSize, initX, initX + this.EXPANSION_SIZE)];
            }
            else {
                // New Death Lines
                warnLines.forEach(function (warnLine) {
                    nextState.battleRoyale.deathLines.push(new Line_1.Line(stageSize, warnLine.from, warnLine.to));
                });
                nextState.battleRoyale.deathLines = Line_1.Line.simplifyArray(nextState.battleRoyale.deathLines);
                nextState.battleRoyale.warnLines = [];
                // New Warn Lines
                nextState.battleRoyale.deathLines.forEach(function (deathLine) {
                    nextState.battleRoyale.warnLines.push(new Line_1.Line(stageSize, deathLine.to, deathLine.to + _this.EXPANSION_SIZE));
                    nextState.battleRoyale.warnLines.push(new Line_1.Line(stageSize, deathLine.from - _this.EXPANSION_SIZE, deathLine.from));
                });
                nextState.battleRoyale.warnLines = Line_1.Line.simplifyArray(nextState.battleRoyale.warnLines);
            }
        }
        return nextState.battleRoyale;
    };
    BattleRoyale.DEATH_COLOR = new color_1.Color(128, 64, 0);
    BattleRoyale.WARN_COLOR = new color_1.Color(40, 30, 0);
    BattleRoyale.EXPANSION_SIZE = 10;
    BattleRoyale.EXPANSION_DELAY = 200;
    BattleRoyale.startingGameState = {
        warnLines: [],
        deathLines: [],
        lastExpansion: 0,
    };
    return BattleRoyale;
}());
exports.BattleRoyale = BattleRoyale;
