import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';
import * as env from '../env';
import StarsAnimation from "./stars";
import cors from 'cors';

import FireAnimation from './fire';
import OldSchoolSegmentsAnimation from './oldSchoolSegments';
import GameOfLifeAnimation from './gameOfLife';
import RainbowAnimation from "./rainbow";
import NoneAnimation from "./none";
import StrobeAnimation from "./strobe";
import Strobe2Animation from './strobe2';
import AlternatingAnimation from "./alternating";
import MatrixAnimation from "./matrix";
import SlidingWindowAnimation from "./slidingWindow";
import RainbowSlidingWindowAnimation from './rainboxSlidingWindow';
import FlashingApertureAnimation from './flashingAperture';
import BlueFireAnimation from './blueFire';
import FlashingSegmentsAnimation from './flashingSegments';
import ParticleWaveAnimation from "./particleWave";

export const lamp = express();

lamp.use(cors());
lamp.use(express.json());

export function initLamp() {
    const LAMP_FPS: number = env.LAMP_FPS;
    let TOP_LED_NB: number = env.TOP_LED_NB;

    const animations = [
        new NoneAnimation(),
        new StarsAnimation(120),
        new FireAnimation(false),
        new FireAnimation(true),
        new BlueFireAnimation(true),
        new RainbowAnimation(),
        new StrobeAnimation(LAMP_FPS),
        new Strobe2Animation(),
        new AlternatingAnimation(20),
        new MatrixAnimation(),
        new GameOfLifeAnimation(),
        new SlidingWindowAnimation(),
        new RainbowSlidingWindowAnimation(),
        new OldSchoolSegmentsAnimation(),
        new FlashingApertureAnimation(),
        new FlashingSegmentsAnimation(),
        new ParticleWaveAnimation(),
    ];

    const animationStore = {};
    for (const animation of animations) {
        animationStore[animation.name] = animation;
    }
    let currentAnimation = animations[0].name;

    let isLampRunning = false;
    let lampShouldStop = false;
    let currentColors: Color[] = [];

    // Hacky: we need to send index.html because Vue manages routes
    lamp.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));;
    });

    lamp.post('/colors', (req, res) => {
        const colors = req.body;
        currentColors = colors.map(color => {
            const { r, g, b, w } = color;
            return new Color(r, g, b, w);
        });

        startLamp();
        res.send("OK");
    });

    lamp.post('/animation', (req, res) => {
        const animation: string = req.body.animation;

        if (animation.toLowerCase() === "off") {
            lampShouldStop = true;
            res.send("OK");
            return;
        }

        if (typeof animationStore[animation] === "undefined") {
            res.status(400).send(`Animation "${animation}" not found.`);
            return;
        }

        currentAnimation = animation;
        startLamp();
        res.send("OK");
    });

    lamp.post('/brightness', (req, res) => {
        // TODO Overall brightness
        res.send("OK");
    });

    lamp.post('/set-top-led', (req, res) => {
        TOP_LED_NB = req.body.topLedNb;
        res.send("OK");
    });

    // Getter to avoid trying to read an undefined value
    function getColor(i): Color {
        if (i < currentColors.length) {
            return currentColors[i];
        } else {
            return HtmlColors.black;
        }
    }

    function startLamp() {
        if (!isLampRunning && state === State.IDLE) {
            isLampRunning = true;
            tick(0);
        }

        function tick(t: number) {
            // Loop timing, keep at the beginning
            const tickStart = Date.now();

            // Get the current animation
            const animation = animationStore[currentAnimation];
            const options = [getColor(0), getColor(1), TOP_LED_NB];
            animation.animate(t, display, options);

            // Loop timing, keep at the end
            if (state === State.IDLE && !lampShouldStop) {
                display.render();

                const tickEnd = Date.now();
                const diff = tickStart - tickEnd;
                const waitingTime = 1 / LAMP_FPS * 1000 + diff;
                setTimeout(() => tick(t + 1), waitingTime);
            } else {
                isLampRunning = false;
                lampShouldStop = false;
                display.drawAll(HtmlColors.black);
                display.render();
            }
        }
    }
}
