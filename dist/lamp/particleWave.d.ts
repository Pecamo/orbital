import { ColorOption, LampAnimation } from "../types/LampAnimation";
export default class ParticleWaveAnimation implements LampAnimation<[ColorOption, ColorOption]> {
    private particlesPos;
    name: string;
    options: [ColorOption, ColorOption];
    private SPEED_INCREMENT;
    private PARTICLE_COUNT;
    private PARTICLE_SIZE;
    private speed;
    private spaceBetweenParticles;
    constructor(particlesPos?: any[]);
    animate(t: any, display: any, options: any): void;
}
