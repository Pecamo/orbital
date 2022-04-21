import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';
import FireAnimation from './fire';
import * as convert from 'color-convert';
import * as env from '../env';
import animateMatrix from './matrix';
import StarsAnimation from "./stars";
import { normalize } from '../utils';
import { NB_LED } from '../NB_LED';

export const lamp = express();
let TOP_LED_NB = env.TOP_LED_NB;

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

const stars = new StarsAnimation();
const fire = new FireAnimation(false);
const fireWheel = new FireAnimation(true);

function startLamp() {
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
                display.drawAll(getColor(0));
                break;
            case Animation.STROBE:
                display.drawAll(getColor(Math.floor(t * 10 / LAMP_FPS) % 2)); // Yeah!
                break;
            case Animation.ALTERNATING:
                const ALTERNATE_EACH = 20;
                const offset = Math.floor(t / ALTERNATE_EACH) % 2;
                for (let n = 0; n < NB_LED; n++) {
                    const colorParam = (Math.floor(n / 2) + offset) % 2;
                    display.drawDot(n, getColor(colorParam));
                }
                break;
            case Animation.RAINBOW:
                for (let n = 0; n < NB_LED; n++) {
                    const rgb = convert.hsv.rgb([(n + t) * 360 / NB_LED, 100, 100]);
                    const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
                    display.drawDot(n, color);
                }
                break;
            case Animation.FIRE:
                fire.animate(t, display, [TOP_LED_NB]);
                break;
            case Animation.FIRE_WHEEL:
                fireWheel.animate(t, display, [TOP_LED_NB]);
                break;
            case Animation.STARS:
                stars.animate(t, display, [getColor(0), getColor(1)]);
                break;
            case Animation.MATRIX_WHEEL:
                animateMatrix(display, getColor(0), getColor(1));
                break;
            case Animation.SLIDING_WINDOW:
                const speed = NB_LED / 30;
                for (let n = 0; n < NB_LED / 3; n++) {
                    const rgb = convert.hsv.rgb([(n + Math.floor(t * speed)) * 360 / NB_LED, 100, 100]);
                    const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
                    display.drawDot(normalize(n + Math.floor(t * speed)), color);
                }
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
