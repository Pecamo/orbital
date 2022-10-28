"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NB_LED_1 = require("../NB_LED");
var utils_1 = require("../utils");
var htmlColors_1 = require("../htmlColors");
var Line_1 = require("../types/Line");
var ParticleWaveAnimation = /** @class */ (function () {
    function ParticleWaveAnimation(particlesPos) {
        if (particlesPos === void 0) { particlesPos = []; }
        this.particlesPos = particlesPos;
        this.name = "Particle Wave";
        this.options = [
            { name: "Color 1", type: "color", default: htmlColors_1.HtmlColors.white },
            { name: "Color 2", type: "color", default: htmlColors_1.HtmlColors.cyan },
        ];
        // Parameters
        this.SPEED_INCREMENT = NB_LED_1.NB_LED / 500;
        this.PARTICLE_COUNT = NB_LED_1.NB_LED / 50;
        this.PARTICLE_SIZE = NB_LED_1.NB_LED / 30;
        // Runtime variables
        this.speed = 0;
        this.spaceBetweenParticles = NB_LED_1.NB_LED / this.PARTICLE_COUNT;
        for (var n = 0; n < this.PARTICLE_COUNT; n++) {
            this.particlesPos.push(Math.floor(n * this.spaceBetweenParticles));
        }
    }
    ParticleWaveAnimation.prototype.animate = function (t, display, options) {
        this.speed += this.SPEED_INCREMENT;
        for (var n = 0; n < this.PARTICLE_COUNT; n++) {
            var particleStart = this.particlesPos[n];
            display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, particleStart, particleStart + this.PARTICLE_SIZE), options[1]);
        }
        for (var n = 0; n < this.PARTICLE_COUNT; n++) {
            this.particlesPos[n] = utils_1.normalize(Math.floor(this.particlesPos[n] + this.speed));
            var particleStart = this.particlesPos[n];
            display.drawLine(new Line_1.Line(NB_LED_1.NB_LED, particleStart, particleStart + this.PARTICLE_SIZE), options[0]);
        }
    };
    return ParticleWaveAnimation;
}());
exports.default = ParticleWaveAnimation;
