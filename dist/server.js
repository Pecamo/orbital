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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.display = exports.state = exports.State = void 0;
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var https_1 = __importDefault(require("https"));
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var path = __importStar(require("path"));
var env = __importStar(require("./env"));
var game_1 = require("./game");
var display_1 = require("./display");
var color_1 = require("./color");
var htmlColors_1 = require("./htmlColors");
var Line_1 = require("./types/Line");
var lamp_1 = require("./lamp");
var NB_LED_1 = require("./NB_LED");
var cors_1 = __importDefault(require("cors"));
var State;
(function (State) {
    State[State["IDLE"] = 0] = "IDLE";
    State[State["WAITING"] = 1] = "WAITING";
    State[State["GAME"] = 2] = "GAME";
    State[State["END"] = 3] = "END";
})(State = exports.State || (exports.State = {}));
exports.state = State.IDLE;
var cooldown;
var ledAnim;
NB_LED_1.fetchNB_LED().then(function () { return init(); });
function init() {
    var app = express_1.default();
    app.use(cors_1.default());
    lamp_1.initLamp();
    if (env.LAMP_MODE_ENABLED) {
        app.use('/lamp', lamp_1.lamp);
    }
    else {
        app.get('/lamp', function (req, res) {
            res.redirect('/');
        });
    }
    app.use('/', express_1.default.static(__dirname + '/../static'));
    app.get('/', function (req, res, next) {
        res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
    });
    var port = parseInt(process.argv[2]) || env.ORBITAL_PORT;
    var httpServer = http_1.default.createServer(app).listen(port);
    console.log("Server listening on port " + port);
    createSslServer(app);
    var expressWs = express_ws_1.default(app, httpServer);
    expressWs.app.ws('/', function (ws, req) {
        handleWs(ws, req);
    });
    // Catch-all fallback for vue history to be beautiful
    // It must exists after ws handler or it will crash
    app.get('*', function (req, res, next) {
        res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
    });
    var invertOrientation = process.argv.includes('--invert');
    exports.display = new display_1.Display(NB_LED_1.NB_LED, DISPLAY_API_HOSTNAME, DISPLAY_API_PORT, invertOrientation);
    displayServerStarted();
}
function createSslServer(app) {
    var certDir = env.SSL_CERT_PATH;
    if (!certDir || !fs_1.default.existsSync(certDir)) {
        console.warn("Cannot find SSL certificates. Running in HTTP only.");
        return;
    }
    var sslPort = env.SSL_ORBITAL_PORT || 443;
    var httpsServer = https_1.default.createServer({
        key: fs_1.default.readFileSync(certDir + "/privkey.pem"),
        cert: fs_1.default.readFileSync(certDir + "/fullchain.pem"),
        ca: fs_1.default.readFileSync(certDir + "/chain.pem"),
    }, app).listen(sslPort);
    console.log("Server listening on port " + sslPort);
    var expressWs = express_ws_1.default(app, httpsServer);
    expressWs.app.ws('/', function (ws, req) {
        handleWs(ws, req);
    });
}
function handleWs(ws, data) {
    ws.on('message', function (data) {
        var msg = JSON.parse(data.toString());
        handleMessage(msg, ws);
    });
    ws.on('close', function () {
        players = players.filter(function (c) { return c.ws !== ws; });
        if (players.length === 0 || players.filter(function (c) { return c.ws.readyState === 1; }).length === 0) {
            exports.state = State.IDLE;
            players = [];
            game = null;
        }
    });
}
var gameOptions = {
    BattleRoyale: {
        type: "boolean",
        default: true,
        value: true,
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
var MINIMUM_PLAYERS = 2;
var DISPLAY_API_HOSTNAME = env.DISPLAY_API_HOSTNAME || 'localhost';
var DISPLAY_API_PORT = env.DISPLAY_API_PORT || 13334;
var WAITING_TIME = env.WAITING_TIME_SEC * 1000;
var GAME_FPS = env.GAME_FPS || 20;
var players = [];
var spectators = [];
var game = null;
var startTime = Date.now();
var currentDisplayAnim;
// States of the Art
function startWaiting() {
    exports.display.brightness = 100;
    startTime = Date.now();
    exports.state = State.WAITING;
    var diffTime = WAITING_TIME;
    stopCurrentAnimation();
    ledAnim = setInterval(function () {
        displayWaitingColor(1 - diffTime / WAITING_TIME);
    }, 15);
    cooldown = setInterval(function () {
        if (players.length === 0) {
            exports.state = State.IDLE;
            players = [];
        }
        var colors = color_1.Color.getRange(players.length);
        diffTime = (WAITING_TIME - (Date.now() - startTime));
        players.forEach(function (c, i) { return sendMsg(c.ws, { cmd: 'getReady', data: Math.round(diffTime / 1000), color: colors[i].toString() }); });
        if (players.length === 0) {
            exports.state = State.IDLE;
            players = [];
        }
        else {
            if (diffTime <= 0) {
                clearInterval(cooldown);
                clearInterval(ledAnim);
                startGame();
            }
        }
    }, 500);
}
function cancelWaiting(ws) {
    sendMsg(ws, { cmd: 'welcome' });
    players = [];
    stopCurrentAnimation();
    exports.state = State.IDLE;
    clearInterval(cooldown);
    clearInterval(ledAnim);
}
function onDeath(player) {
    var deceasedPlayer = players.find(function (c) { return c.character.id === player.id; });
    if (deceasedPlayer && deceasedPlayer.ws && deceasedPlayer.ws.readyState === 1) {
        sendMsg(deceasedPlayer.ws, { cmd: 'lost' });
        players = players.filter(function (p) { return p !== deceasedPlayer; });
    }
}
function onNewState(newState) {
    var _this = this;
    // Send to all clients
    spectators.forEach(function (ws) {
        if (ws.readyState === 1) {
            sendMsg(ws, {
                cmd: 'spectateData',
                data: __assign({ stageSize: _this.stageSize }, newState)
            });
        }
    });
}
function startGame() {
    exports.state = State.GAME;
    game = new game_1.Game(GAME_FPS, players.length, exports.display, gameOptions, onDeath, onNewState);
    players.forEach(function (c, i) { c.character = game.gameState.characters[i]; });
    players.forEach(function (c, i) {
        if (!game.newInputs[i]) {
            game.newInputs[i] = {};
        }
        c.inputs = game.newInputs[i];
    });
    players.forEach(function (c, i) { return sendMsg(c.ws, { cmd: 'play', color: game.gameState.characters[i].color.toString() }); });
    game.start().then(function (winner) {
        endGame(winner);
    });
}
function endGame(winner) {
    exports.state = State.END;
    var winnerPlayer = players.find(function (c) { var _a; return ((_a = c.character) === null || _a === void 0 ? void 0 : _a.id) === winner.id; });
    displayWinnerColor(winner.color);
    if (!winnerPlayer) {
        exports.state = State.IDLE;
        broadcastMsg({ cmd: 'lost' });
        players = [];
        return;
    }
    sendMsg(winnerPlayer.ws, { cmd: 'won' });
    spectators.forEach(function (s) {
        if (s.readyState === 1) {
            sendMsg(s, {
                cmd: 'spectateEnd',
                data: {
                    winner: winnerPlayer.character,
                },
            });
        }
    });
    players.filter(function (c) { var _a; return ((_a = c.character) === null || _a === void 0 ? void 0 : _a.id) !== winner.id; }).forEach(function (c) { return sendMsg(c.ws, { cmd: 'lost' }); });
    players = [];
    exports.state = State.IDLE;
}
function handleMessage(msg, ws) {
    switch (msg.cmd) {
        case 'join': {
            if (exports.state === State.IDLE) {
                players.push({ ws: ws });
                if (players.length > MINIMUM_PLAYERS - 1) {
                    startWaiting();
                }
                else {
                    broadcastMsg({ cmd: 'wait' });
                }
            }
            else if (exports.state === State.WAITING) {
                players.push({ ws: ws });
                startTime = Date.now();
            }
            else {
                sendMsg(ws, { cmd: 'gameInProgress' });
            }
            break;
        }
        case 'cancel': {
            if (players.length == 1) {
                players = [];
                cancelWaiting(ws);
            }
            break;
        }
        case 'press': {
            var player = players.find(function (c) { return c.ws === ws; });
            if (!player) {
                return;
            }
            player.inputs[msg.data] = true;
            break;
        }
        case 'release': {
            var player = players.find(function (c) { return c.ws === ws; });
            if (!player) {
                return;
            }
            player.inputs[msg.data] = false;
            break;
        }
        case 'spectate': {
            // FIXME this condition won't work with Vue without proper handling
            if (env.SPECTATE_MODE_ENABLED) {
                spectators.push(ws);
            }
            else {
                sendMsg(ws, { cmd: 'welcome' });
            }
            break;
        }
        case 'queryGameOptions': {
            sendMsg(ws, { cmd: 'readGameOptions', data: gameOptions });
            break;
        }
        case 'writeGameOptions': {
            Object.entries(msg.data).forEach(function (_a) {
                var _b = __read(_a, 2), optionName = _b[0], optionValue = _b[1];
                if (Object.keys(gameOptions).includes(optionName)) {
                    gameOptions[optionName].value = optionValue.value;
                }
            });
            break;
        }
        default: {
            console.warn("Unknown ws command: " + msg['cmd']);
            break;
        }
    }
}
function broadcastMsg(msg) {
    players.forEach(function (c) { return sendMsg(c.ws, msg); });
}
function sendMsg(player, msg) {
    if (player.readyState === 1) {
        player.send(JSON.stringify(msg));
    }
}
function displayServerStarted() {
    var colors = [
        htmlColors_1.HtmlColors.red,
        htmlColors_1.HtmlColors.green,
        htmlColors_1.HtmlColors.blue,
        new color_1.Color(0, 0, 0, 255),
        htmlColors_1.HtmlColors.black,
    ];
    colors.forEach(function (color, i) {
        setTimeout(function () {
            exports.display.drawAll(color);
            exports.display.render();
        }, i * 400);
    });
}
function displayWinnerColor(color) {
    stopCurrentAnimation();
    var nbLoops = 2;
    var it = 0;
    currentDisplayAnim = setInterval(function () {
        if (it <= 255) {
            exports.display.drawAll(color.withOpacity(1 - it / 255));
            exports.display.render();
        }
        else {
            exports.display.drawAll(color.withOpacity((it - 255) / 255));
            exports.display.render();
        }
        if (it > 512) {
            it = 0;
            nbLoops--;
        }
        if (it === 255 && nbLoops < 0) {
            exports.display.drawAll(color.withOpacity(0));
            exports.display.render();
            stopCurrentAnimation();
        }
        it += 5;
    }, 20);
}
function displayWaitingColor(percentage) {
    stopCurrentAnimation();
    var color = new color_1.Color(percentage * 255, 0, (1 - percentage) * 255);
    exports.display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, 0, Math.floor(NB_LED_1.NB_LED * percentage)), color);
    exports.display.render();
}
function stopCurrentAnimation() {
    if (currentDisplayAnim) {
        clearInterval(currentDisplayAnim);
    }
}
