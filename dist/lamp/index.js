"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initLamp = exports.lamp = void 0;
var path = __importStar(require("path"));
var express_1 = __importDefault(require("express"));
var server_1 = require("../server");
var color_1 = require("../color");
var htmlColors_1 = require("../htmlColors");
var env = __importStar(require("../env"));
var cors_1 = __importDefault(require("cors"));
var convert = __importStar(require("color-convert"));
var stars_1 = __importDefault(require("./stars"));
var fire_1 = __importDefault(require("./fire"));
var oldSchoolSegments_1 = __importDefault(require("./oldSchoolSegments"));
var gameOfLife_1 = __importDefault(require("./gameOfLife"));
var rainbow_1 = __importDefault(require("./rainbow"));
var none_1 = __importDefault(require("./none"));
var strobe_1 = __importDefault(require("./strobe"));
var strobe2_1 = __importDefault(require("./strobe2"));
var alternating_1 = __importDefault(require("./alternating"));
var matrix_1 = __importDefault(require("./matrix"));
var slidingWindow_1 = __importDefault(require("./slidingWindow"));
var rainbowSlidingWindow_1 = __importDefault(require("./rainbowSlidingWindow"));
var flashingAperture_1 = __importDefault(require("./flashingAperture"));
var blueFire_1 = __importDefault(require("./blueFire"));
var flashingSegments_1 = __importDefault(require("./flashingSegments"));
var particleWave_1 = __importDefault(require("./particleWave"));
exports.lamp = express_1.default();
exports.lamp.use(cors_1.default());
exports.lamp.use(express_1.default.json());
function initLamp() {
    var e_1, _a;
    var LAMP_FPS = env.LAMP_FPS;
    var GRADIENT_DURATION = 1000;
    var animations = [
        new none_1.default(),
        new stars_1.default(120),
        new fire_1.default(false),
        new fire_1.default(true),
        new blueFire_1.default(true),
        new rainbow_1.default(),
        new strobe_1.default(LAMP_FPS),
        new strobe2_1.default(),
        new alternating_1.default(20),
        new matrix_1.default(),
        new gameOfLife_1.default(),
        new slidingWindow_1.default(),
        new rainbowSlidingWindow_1.default(),
        new oldSchoolSegments_1.default(),
        new flashingAperture_1.default(),
        new flashingSegments_1.default(),
        new particleWave_1.default(),
    ];
    var animationStore = {};
    try {
        for (var animations_1 = __values(animations), animations_1_1 = animations_1.next(); !animations_1_1.done; animations_1_1 = animations_1.next()) {
            var animation = animations_1_1.value;
            animationStore[animation.name] = animation;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (animations_1_1 && !animations_1_1.done && (_a = animations_1.return)) _a.call(animations_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var currentAnimation = animations[0].name;
    var isLampRunning = false;
    var lampShouldStop = false;
    var currentCharacteristics = {};
    // Hacky: we need to send index.html because Vue manages routes
    exports.lamp.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
    });
    exports.lamp.get('/animationNames', function (req, res) {
        res.send({ animationNames: __spreadArray(["Off"], __read(animations.map(function (anim) { return anim.name; }))) });
    });
    exports.lamp.get('/options/:animationName', function (req, res) {
        if (!req.params.animationName) {
            return;
        }
        var animationName = req.params.animationName;
        if (animationName.toLowerCase() === "off") {
            return res.send({ options: [] });
        }
        var animation = animations.find(function (a) { return a.name === animationName; });
        if (animation) {
            var options = animation.options;
            // We set the default value to the current one to sync clients
            if (currentCharacteristics[animationName]) {
                for (var i = 0; i < options.length; i++) {
                    options[i].currentCharacteristicValue = currentCharacteristics[animationName][i].value;
                }
            }
            else {
                options.forEach(function (option) {
                    if (option.type === "color") {
                        option.currentCharacteristicValue = {
                            type: "static",
                            color: option.default,
                        };
                    }
                    else {
                        option.currentCharacteristicValue = option.default;
                    }
                });
            }
            res.send({ options: options });
        }
        else {
            res.send(404);
        }
    });
    exports.lamp.post('/characteristics', function (req, res) {
        var characteristics = req.body;
        characteristics
            .forEach(function (c) {
            if (c.type === "color") {
                if (c.value.type === "static") {
                    c.value.color = color_1.Color.fromObject(c.value.color);
                }
                else if (c.value.type === "gradient") {
                    c.value.parameters.colorFrom = color_1.Color.fromObject(c.value.parameters.colorFrom);
                    c.value.parameters.colorTo = color_1.Color.fromObject(c.value.parameters.colorTo);
                }
            }
        });
        currentCharacteristics[currentAnimation] = characteristics;
        startLamp();
        res.send("OK");
    });
    exports.lamp.post('/animation', function (req, res) {
        var animation = req.body.animation;
        if (animation.toLowerCase() === "off") {
            lampShouldStop = true;
            res.send("OK");
            return;
        }
        if (typeof animationStore[animation] === "undefined") {
            res.status(400).send("Animation \"" + animation + "\" not found.");
            return;
        }
        currentAnimation = animation;
        startLamp();
        res.send("OK");
    });
    exports.lamp.get('/brightness', function (req, res) {
        res.send({ brightness: server_1.display.brightness });
    });
    exports.lamp.post('/brightness', function (req, res) {
        if (!req.body.brightness) {
            return;
        }
        server_1.display.brightness = req.body.brightness;
        res.send("OK");
    });
    function startLamp() {
        if (!isLampRunning && server_1.state === server_1.State.IDLE) {
            isLampRunning = true;
            tick(0);
        }
        function tick(t) {
            // Loop timing, keep at the beginning
            var tickStart = Date.now();
            // Get the current animation
            var animation = animationStore[currentAnimation];
            if (!currentCharacteristics[animation.name]) {
                currentCharacteristics[animation.name] = animation.options.map(function (o) {
                    var characteristic;
                    if (o.type === "color") {
                        characteristic = { type: "color", value: { type: "static", color: o.default } };
                    }
                    else if (o.type === "number") {
                        characteristic = { type: "number", value: o.default };
                    }
                    else if (o.type === "select") {
                        characteristic = { type: "select", value: o.default };
                    }
                    return characteristic;
                });
            }
            var characteristics = currentCharacteristics[animation.name];
            var parameters = characteristics.map(function (c) {
                switch (c.type) {
                    case "number":
                        return c.value;
                    case "select":
                        return c.value;
                    case "color":
                        if (c.value.type === "static") {
                            return c.value.color;
                        }
                        else if (c.value.type === "gradient") {
                            return computeGradient(c.value.parameters.colorFrom, c.value.parameters.colorTo, t, GRADIENT_DURATION);
                        }
                        else if (c.value.type === "rainbow") {
                            return computeRainbow(t, GRADIENT_DURATION);
                        }
                }
            });
            animation.animate(t, server_1.display, parameters);
            // Loop timing, keep at the end
            if (server_1.state === server_1.State.IDLE && !lampShouldStop) {
                server_1.display.render();
                var tickEnd = Date.now();
                var diff = tickStart - tickEnd;
                var waitingTime = 1 / LAMP_FPS * 1000 + diff;
                setTimeout(function () { return tick(t + 1); }, waitingTime);
            }
            else {
                isLampRunning = false;
                lampShouldStop = false;
                server_1.display.drawAll(htmlColors_1.HtmlColors.black);
                server_1.display.render();
            }
        }
    }
}
exports.initLamp = initLamp;
function computeGradient(colorFrom, colorTo, t, duration) {
    var tMod = t % duration;
    if (tMod < duration / 2) {
        return color_1.Color.overlap(colorFrom, colorTo, tMod / duration);
    }
    else {
        return color_1.Color.overlap(colorTo, colorFrom, tMod / duration);
    }
}
function computeRainbow(t, duration) {
    var tMod = t % duration;
    var rgb = convert.hsv.rgb([(tMod / duration) * 360, 100, 100]);
    return new color_1.Color(rgb[0], rgb[1], rgb[2]);
}
