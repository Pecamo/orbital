import * as path from 'path';
import express from 'express';
import { NB_LED, State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';
import { Fire } from './fire';
import * as convert from 'color-convert';
import * as env from '../env';

export const lamp = express();
let TOP_LED_NB = env.TOP_LED_NB;

lamp.use(express.json());

const LAMP_FPS: number = env.LAMP_FPS;
enum Animation {
    NONE = "none",
    STROBE = "strobe",
    RAINBOW = "rainbow",
    FIRE = "fire",
    FIRE_WHEEL = "fire_wheel",
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
                display.drawAll(getColor(t % 2)); // Yeah!
                break;
            case Animation.RAINBOW:
                for (let n = 0; n < NB_LED; n++) {
                    const rgb = convert.hsv.rgb([(n + t) * 360 / NB_LED, 100, 100]);
                    const color: Color = new Color(rgb[0], rgb[1], rgb[2]);
                    display.drawDot(n, color);
                }
                break;
            case Animation.FIRE:
                Fire.animate(t, display, false, TOP_LED_NB);
                break;
            case Animation.FIRE_WHEEL:
                Fire.animate(t, display, true, TOP_LED_NB);
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
