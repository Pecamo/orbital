"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var display_1 = require("./display");
var gameOptions = {
    BattleRoyale: {
        type: "boolean",
        default: false,
        value: false,
    },
    MissileCollision: {
        type: "enum",
        default: "on",
        value: "on",
        options: ["on", "off", "stronger"]
    },
    ShotCooldown: {
        type: "number",
        default: 12,
        value: 12,
        min: 1,
        max: 20
    }
};
test('Game is created correctly', function () {
    var display = new display_1.Display(100, '', 13335, false);
    var game = new game_1.Game(20, 2, display, gameOptions);
    expect(game.newInputs.length).toBe(0);
});
