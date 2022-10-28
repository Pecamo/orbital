"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var color_1 = require("./color");
var htmlColors_1 = require("./htmlColors");
var lodash_1 = __importDefault(require("lodash"));
var BattleRoyale_1 = require("./mods/BattleRoyale");
var MAX_SHOT_RANGE = 18;
var MIN_SHOT_RANGE = 2;
var Game = /** @class */ (function () {
    function Game(fps, numberOfPlayers, display, gameOptions, onCharacterDeathCallback, onNewStateCallback) {
        var _this = this;
        this.fps = fps;
        this.numberOfPlayers = numberOfPlayers;
        this.display = display;
        this.gameOptions = gameOptions;
        this.onCharacterDeathCallback = onCharacterDeathCallback;
        this.onNewStateCallback = onNewStateCallback;
        this.move = function (from, toAdd) {
            return ((from + toAdd) + _this.stageSize) % _this.stageSize;
        };
        this.startingGameState = function (nbCharacters) {
            var characters = [];
            var colors = color_1.Color.getRange(nbCharacters);
            for (var i = 0; i < nbCharacters; i++) {
                characters.push({
                    id: i,
                    x: Math.floor((_this.stageSize / nbCharacters) * i),
                    color: colors[i],
                    shotCooldown: 0,
                    facesRight: true,
                    alive: true,
                    shotRange: MAX_SHOT_RANGE,
                });
            }
            if (_this.gameOptions.BattleRoyale.value) {
                return {
                    startDate: new Date(),
                    turnNb: 0,
                    characters: characters,
                    shots: [],
                    battleRoyale: BattleRoyale_1.BattleRoyale.startingGameState,
                };
            }
            else {
                return {
                    startDate: new Date(),
                    turnNb: 0,
                    characters: characters,
                    shots: [],
                };
            }
        };
        this.nextState = function (gameState, heldInputs) {
            // End condition
            var alive = 0;
            var lastAlive = null;
            for (var i = 0; i < _this.gameState.characters.length; i++) {
                var character = _this.gameState.characters[i];
                if (character.alive) {
                    alive += 1;
                    lastAlive = character;
                }
            }
            if (alive === 1) {
                return Object.assign({}, gameState, { winner: lastAlive });
            }
            // Usual handle
            var nextState = lodash_1.default.cloneDeep(gameState);
            // Frame characters
            for (var characterId in nextState.characters) {
                var character = nextState.characters[characterId];
                // Skip if character is dead
                if (!character.alive) {
                    continue;
                }
                // Decrease shot cooldown
                character.shotCooldown = Math.max(0, character.shotCooldown - 1);
                // Recover shot range
                if (character.shotCooldown === 0) {
                    character.shotRange = Math.min(MAX_SHOT_RANGE, character.shotRange + 0.2);
                }
                // Update movement or direction if any move characterId is pressed
                if (heldInputs[characterId].left || heldInputs[characterId].right) {
                    var wantedMove = (heldInputs[characterId].left ? -1 : 0) + (heldInputs[characterId].right ? 1 : 0);
                    character.facesRight = wantedMove > 0;
                    var wantedPos = _this.move(character.x, wantedMove);
                    // Check if any other character is already here
                    var free = true;
                    var alives = nextState.characters.filter(function (p) { return p.alive; });
                    for (var otherId in alives) {
                        if (alives[otherId].x === wantedPos) {
                            free = false;
                        }
                    }
                    if (free) {
                        character.x = _this.move(character.x, wantedMove);
                    }
                }
                if (heldInputs[characterId].fire && character.shotCooldown == 0) {
                    var newShot = {
                        owner: characterId,
                        x: character.x,
                        facesRight: character.facesRight,
                        age: 0,
                        range: character.shotRange
                    };
                    nextState.shots.push(newShot);
                    nextState.characters[characterId].shotCooldown = _this.gameOptions.ShotCooldown.value;
                    nextState.characters[characterId].shotRange = MIN_SHOT_RANGE;
                }
            }
            // Frame Shots
            var nextShots = [];
            for (var key in nextState.shots) {
                var shot = nextState.shots[key];
                // Detect if it hits anything
                var hit = false;
                var _loop_1 = function (characterId) {
                    var character = nextState.characters[characterId];
                    if (!character.alive) {
                        return "continue";
                    }
                    if ((character.x === shot.x || character.x === _this.move(shot.x, shot.facesRight ? -1 : 1)) && shot.owner !== characterId) {
                        character.alive = false;
                        if (_this.onCharacterDeathCallback) {
                            setTimeout(function () {
                                _this.onCharacterDeathCallback(character);
                            }, 1);
                        }
                        hit = true;
                    }
                };
                // Loop on characters
                for (var characterId in nextState.characters) {
                    _loop_1(characterId);
                }
                // Loop on other shots
                for (var skey in nextState.shots) {
                    var other = nextState.shots[skey];
                    var shot_0 = shot.x;
                    var shot_1 = _this.move(shot.x, shot.facesRight ? 1 : -1);
                    var shot_2 = _this.move(shot.x, shot.facesRight ? 2 : -2);
                    var other_0 = other.x;
                    var other_1 = _this.move(other.x, other.facesRight ? 1 : -1);
                    var other_2 = _this.move(other.x, other.facesRight ? 2 : -2);
                    if ((shot_0 === other_0 ||
                        shot_0 === other_1 ||
                        shot_0 === other_2 ||
                        shot_1 === other_0 ||
                        shot_1 === other_1 ||
                        shot_1 === other_2 ||
                        shot_2 === other_0 ||
                        shot_2 === other_1 ||
                        shot_2 === other_2) && other.owner !== shot.owner) {
                        shot.age = 1000;
                        other.age = 1000;
                    }
                }
            }
            for (var key in nextState.shots) {
                var shot = nextState.shots[key];
                if (shot.age <= shot.range) {
                    var newShot = __assign(__assign({}, shot), { x: _this.move(shot.x, shot.facesRight ? 2 : -2), age: shot.age + 1 });
                    nextShots.push(newShot);
                }
            }
            nextState.shots = nextShots;
            // Mods
            if (_this.gameOptions.BattleRoyale.value) {
                nextState.battleRoyale = BattleRoyale_1.BattleRoyale.nextState(gameState, nextState, _this.stageSize);
                nextState.characters.forEach(function (character) {
                    if (nextState.battleRoyale.deathLines.some(function (line) { return line.includes(character.x); })) {
                        character.alive = false;
                    }
                });
            }
            nextState.turnNb++;
            if (_this.onNewStateCallback) {
                setTimeout(function () {
                    _this.onNewStateCallback(nextState);
                }, 1);
            }
            return nextState;
        };
        this.display = display;
        this.stageSize = display.size;
        this.newInputs = [];
        this.gameState = this.startingGameState(numberOfPlayers);
        this.heldInputs = Game.startingInputsState(numberOfPlayers);
    }
    Game.prototype.start = function () {
        return this.tick();
    };
    Game.startingInputsState = function (nbPlayer) {
        var inputs = [];
        for (var i = 0; i < nbPlayer; i++) {
            inputs.push({
                left: false,
                right: false,
                fire: false,
            });
        }
        return inputs;
    };
    Game.prototype.toString = function () {
        var world = '';
        if (this.gameState.winner) {
            return "Winner : " + this.gameState.winner;
        }
        for (var x = 0; x < this.stageSize; x++) {
            var char = '_';
            for (var characterId in this.gameState.characters) {
                var character = this.gameState.characters[characterId];
                if (character.x === x && character.alive) {
                    char = '' + characterId;
                }
            }
            for (var shotId in this.gameState.shots) {
                var shot = this.gameState.shots[shotId];
                if (shot.x === x) {
                    char = shot.facesRight ? '⯈' : '⯇';
                }
                if (shot.x === this.move(x, 1) && shot.facesRight) {
                    char = '⬩';
                }
                if (shot.x === this.move(x, -1) && !shot.facesRight) {
                    char = '⬩';
                }
            }
            world += char;
        }
        return world;
    };
    Game.prototype.tick = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // Loop timing, keep at the beginning
            var tickStart = Date.now();
            if (_this.gameOptions.BattleRoyale.value) {
                BattleRoyale_1.BattleRoyale.tick(_this.gameState, _this.display);
            }
            // draw characters
            Object.keys(_this.gameState.characters).forEach(function (key) {
                var character = _this.gameState.characters[key];
                if (character.alive) {
                    _this.display.drawDot(character.x, character.color);
                }
            });
            // draw shots
            _this.gameState.shots.forEach(function (shot) {
                _this.display.drawDot(shot.x, color_1.Color.overlap(color_1.Color.overlap(htmlColors_1.HtmlColors.darkgrey, _this.gameState.characters[shot.owner].color, 0.3), htmlColors_1.HtmlColors.black, shot.age / 24));
            });
            _this.display.render();
            _this.heldInputs = Game.nextInputs(_this.heldInputs, _this.newInputs);
            _this.gameState = _this.nextState(_this.gameState, _this.heldInputs);
            if (_this.gameState.winner) {
                resolve(_this.gameState.winner);
                return;
            }
            // Loop timing, keep at the end
            var tickEnd = Date.now();
            var diff = tickStart - tickEnd;
            var waitingTime = 1 / _this.fps * 1000 + diff;
            setTimeout(function () { return resolve(_this.tick()); }, waitingTime);
        });
    };
    Game.nextInputs = function (heldInputs, newInputs) {
        var result = Object.assign({}, heldInputs);
        for (var key in newInputs) {
            result[key] = Object.assign({}, heldInputs[key], newInputs[key]);
        }
        return result;
    };
    return Game;
}());
exports.Game = Game;
