import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';
import FireAnimation from './fire';
import {OldSchoolSegmentsAnimation} from './oldSchoolSegments';
import { GameOfLifeAnimation} from './gameOfLife';
import * as env from '../env';
import StarsAnimation from "./stars";
import cors from 'cors';
import RainbowAnimation from "./rainbow";
import NoneAnimation from "./none";
import StrobeAnimation from "./strobe";
import AlternatingAnimation from "./alternating";
import MatrixAnimation from "./matrix";
import SlidingWindowAnimation from "./slidingWindow";

export const lamp = express();
let TOP_LED_NB = env.TOP_LED_NB;

lamp.use(cors());
lamp.use(express.json());

const LAMP_FPS: number = env.LAMP_FPS;

const animations = [
    new NoneAnimation(),
    new StarsAnimation(120, 100),
    new FireAnimation(false, TOP_LED_NB),
    new FireAnimation(true, TOP_LED_NB),
    new RainbowAnimation(),
    new StrobeAnimation(LAMP_FPS),
    new AlternatingAnimation(20),
    new MatrixAnimation(),
    new GameOfLifeAnimation(),
    new SlidingWindowAnimation(),
    new OldSchoolSegmentsAnimation(),
];

const animationStore = {};
for (const animation of animations) {
    animationStore[animation.name] = animation;
}
let currentAnimation = animations[0].name;

let isLampRunning = false;
let currentColors: Color[] = [];

lamp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'lamp.html'));
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
    const { animation } = req.body;
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
        const options = [getColor(0), getColor(1), LAMP_FPS];
        animation.animate(t, display, options);

        display.render();

        // Loop timing, keep at the end
        if (state === State.IDLE) {
            const tickEnd = Date.now();
            const diff = tickStart - tickEnd;
            const waitingTime = 1 / LAMP_FPS * 1000 + diff;
            setTimeout(() => tick(t + 1), waitingTime);
        } else {
            isLampRunning = false;
        }
    }
}
