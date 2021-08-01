import * as path from "path";
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';

export const lamp = express();
lamp.use(express.json());

const LAMP_FPS = 20;
enum Animation {
    NONE = "None",
    STROBE = "Strobe",
    RAINBOW = "Rainbow",
}

let currentAnimation: Animation = Animation.NONE;

lamp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'lamp.html'));
});

lamp.post('/color', (req, res) => {
    const { r, g, b, w } = req.body;
    currentColor = new Color(r, g, b, w);
    startLamp();
    res.send("OK");
});

lamp.post('/animation', (req, res) => {
    const { animation } = req.body;
    currentAnimation = animation;
    startLamp();
    res.send("OK");
});

let isLampRunning = false;
let currentColor: Color = HtmlColors.black;

function startLamp() {
    if (!isLampRunning && state === State.IDLE) {
        isLampRunning = true;
        tick(0);
    }

    function tick(t: number) {
        // Loop timing, keep at the beginning
        const tickStart = Date.now();
        let nextColor = HtmlColors.black;

        // Animations
        switch (currentAnimation) {
            case Animation.NONE:
                nextColor = currentColor;
                break;
            case Animation.STROBE:
                if (t % 2 === 0) {
                    nextColor = currentColor;
                } else {
                    nextColor = HtmlColors.black;
                }
                break;
            case Animation.RAINBOW:
                // TODO
                break;
        }

        display.drawAll(nextColor);
        display.render();

        if (!display.isDisplay) {
            console.log(t, nextColor);
        }

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
