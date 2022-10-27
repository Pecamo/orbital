import {ColorOption, LampAnimation} from "../types/LampAnimation";
import {NB_LED} from "../NB_LED";
import {normalize} from "../utils";
import { HtmlColors } from "../htmlColors";
import {Line} from "../types/Line";

export default class ParticleWaveAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    public name = "Particle Wave";
    public options: [ColorOption, ColorOption] = [
        { name: "Color 1", type: "color", default: HtmlColors.white },
        { name: "Color 2", type: "color", default: HtmlColors.cyan },
    ];

    // Parameters
    private SPEED_INCREMENT = NB_LED / 500;
    private PARTICLE_COUNT = NB_LED / 50;
    private PARTICLE_SIZE = NB_LED / 30;

    // Runtime variables
    private speed = 0;
    private spaceBetweenParticles = NB_LED / this.PARTICLE_COUNT;

    constructor(private particlesPos = []) {
        for (let n = 0; n < this.PARTICLE_COUNT; n++) {
            this.particlesPos.push(Math.floor(n * this.spaceBetweenParticles));
        }
    }

    public animate(t, display, options) {
        this.speed += this.SPEED_INCREMENT;

        for (let n = 0; n < this.PARTICLE_COUNT; n++) {
            const particleStart = this.particlesPos[n];
            display.drawLine(new Line(NB_LED, particleStart, particleStart + this.PARTICLE_SIZE), options[1]);
        }

        for (let n = 0; n < this.PARTICLE_COUNT; n++) {
            this.particlesPos[n] = normalize(Math.floor(this.particlesPos[n] + this.speed));
            const particleStart = this.particlesPos[n];
            display.drawLine(new Line(NB_LED, particleStart, particleStart + this.PARTICLE_SIZE), options[0]);
        }
    }
}
