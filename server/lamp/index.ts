import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';
import FireAnimation from './fire';
import { OldSchoolSegments } from './OldSchoolSegments';
import { GameOfLife } from './gameOfLife';
import * as convert from 'color-convert';
import * as env from '../env';
import animateMatrix from './matrix';
import StarsAnimation from "./stars";
import { normalize } from '../utils';
import { NB_LED } from '../NB_LED';
import cors from 'cors';
import RainbowAnimation from "./rainbow";
import NoneAnimation from "./none";
import StrobeAnimation from "./strobe";
import AlternatingAnimation from "./alternating";
import MatrixAnimation from "./matrix";

export const lamp = express();
let TOP_LED_NB = env.TOP_LED_NB;

lamp.use(cors());

lamp.use(express.json());

const LAMP_FPS: number = env.LAMP_FPS;
enum Animation {
    NONE = "none",
    STROBE = "strobe",
    ALTERNATING = "alternating",
    RAINBOW = "rainbow",
    FIRE = "fire",
    FIRE_WHEEL = "fire_wheel",
    STARS = "stars",
    MATRIX_WHEEL = "matrix_wheel",
    SLIDING_WINDOW = "sliding_window",
    OLD_SCHOOL_SEGMENTS = "old_school_segments",
    GAME_OF_LIFE = "game_of_life",
}

let currentAnimation: Animation = Animation.NONE;
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
    const stars = new StarsAnimation();
    const fire = new FireAnimation(false);
    const fireWheel = new FireAnimation(true);
    const rainbow = new RainbowAnimation();
    const none = new NoneAnimation();
    const strobe = new StrobeAnimation();
    const alternating = new AlternatingAnimation();
    const matrix = new MatrixAnimation();

    if (!isLampRunning && state === State.IDLE) {
        isLampRunning = true;
        tick(0);
    }

    function tick(t: number) {
        // Loop timing, keep at the beginning
        const tickStart = Date.now();

        // Animations
        switch (currentAnimation) {
            case Animation.NONE:
                none.animate(t, display, [getColor(0)]);
                break;
            case Animation.STROBE:
                strobe.animate(t, display, [getColor(0), getColor(1), LAMP_FPS]);
                break;
            case Animation.ALTERNATING:
                alternating.animate(t, display, [getColor(0), getColor(1), 20]);
                break;
            case Animation.RAINBOW:
                rainbow.animate(t, display, []);
                break;
            case Animation.FIRE:
                fire.animate(t, display, [TOP_LED_NB]);
                break;
            case Animation.FIRE_WHEEL:
                fireWheel.animate(t, display, [TOP_LED_NB]);
                break;
            case Animation.STARS:
                stars.animate(t, display, [getColor(0), getColor(1), 120]);
                break;
            case Animation.MATRIX_WHEEL:
                matrix.animate(display, getColor(0), getColor(1));
                break;
            case Animation.GAME_OF_LIFE:
                GameOfLife.animate(t, display, getColor(0));
                break;
            case Animation.SLIDING_WINDOW:
                const speed = NB_LED / 30;
                for (let n = 0; n < NB_LED / 3; n++) {
                    const rgb = convert.hsv.rgb([(n + Math.floor(t * speed)) * 360 / NB_LED, 100, 100]);
                    const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
                    display.drawDot(normalize(n + Math.floor(t * speed)), color);
                }
                break;
            case Animation.OLD_SCHOOL_SEGMENTS:
                OldSchoolSegments.animate(t, display, getColor(0), TOP_LED_NB);
                break;
        }

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
