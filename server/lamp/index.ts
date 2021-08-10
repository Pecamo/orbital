import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { HtmlColors } from '../htmlColors';

export const lamp = express();
lamp.use(express.json());

const LAMP_FPS = 20;

lamp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'static', 'lamp.html'));
});

lamp.post('/color', (req, res) => {
    const { r, g, b, w } = req.body;
    currentColor = new Color(r, g, b, w);
    startLamp();
    res.send("OK");
});

let isLampRunning = false;
let currentColor: Color = HtmlColors.black;

function startLamp() {
    if (!isLampRunning && state === State.IDLE) {
        isLampRunning = true;
        tick();
    }

    function tick() {
        // Loop timing, keep at the beginning
        const tickStart = Date.now();

        display.drawAll(currentColor);
        display.render();

        if (!display.isDisplay) {
            console.log(currentColor);
        }

        // Loop timing, keep at the end
        if (state === State.IDLE) {
            const tickEnd = Date.now();
            const diff = tickStart - tickEnd;
            const waitingTime = 1 / LAMP_FPS * 1000 + diff;
            setTimeout(() => tick(), waitingTime);
        } else {
            isLampRunning = false;
        }
    }
}
