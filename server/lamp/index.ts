import * as path from 'path';
import express from 'express';
import { State, state, display } from '../server';
import { Color } from '../color';
import { Characteristic, SmartColor } from '../types/LampAnimation';
import { HtmlColors } from '../htmlColors';
import * as env from '../env';
import cors from 'cors';

import StarsAnimation from "./stars";
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
import RainbowSlidingWindowAnimation from './rainbowSlidingWindow';
import FlashingApertureAnimation from './flashingAperture';
import BlueFireAnimation from './blueFire';
import FlashingSegmentsAnimation from './flashingSegments';
import ParticleWaveAnimation from "./particleWave";
import { LampAnimation } from '../types/LampAnimation';

export const lamp = express();

lamp.use(cors());
lamp.use(express.json());

export function initLamp() {
    const LAMP_FPS: number = env.LAMP_FPS;

    const animations: LampAnimation[] = [
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

    const animationStore: { [key: string]: LampAnimation } = {};
    for (const animation of animations) {
        animationStore[animation.name] = animation;
    }
    let currentAnimation = animations[0].name;

    let isLampRunning = false;
    let lampShouldStop = false;
    const currentCharacteristics: { [key: string]: Characteristic[] } = {};

    // Hacky: we need to send index.html because Vue manages routes
    lamp.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'static', 'index.html'));
    });

    lamp.get('/animationNames', (req, res) => {
        res.send({ animationNames: ["Off", ...animations.map(anim => anim.name)] });
    })

    lamp.get('/options/:animationName', (req, res) => {
        if (!req.params.animationName) {
            return;
        }

        const animationName = req.params.animationName;
        if (animationName.toLowerCase() === "off") {
            return res.send({ options: [] });
        }

        const animation = animations.find(a => a.name === animationName);
        if (animation) {
            const options = animation.options;

            // We set the default value to the current one to sync clients
            if (currentCharacteristics[animationName]) {
                for (let i = 0; i < options.length; i++) {
                    options[i].currentCharacteristicValue = currentCharacteristics[animationName][i].value;
                }
            } else {
                options.forEach(option => {
                    if (option.type === "color") {
                        option.currentCharacteristicValue = {
                            type: "static",
                            color: option.default,
                        } as SmartColor;
                    } else {
                        option.currentCharacteristicValue = option.default;
                    }
                });
            }

            res.send({ options });
        } else {
            res.sendStatus(404);
        }
    });

    lamp.post('/characteristics', (req, res) => {
        const characteristics: Characteristic[] = req.body;
        characteristics
            .forEach(c => {
                if (c.type === "color") {
                    if (c.value.type === "static") {
                        c.value.color = Color.fromObject(c.value.color);
                    } else if (c.value.type === "gradient") {
                        c.value.parameters.colorFrom = Color.fromObject(c.value.parameters.colorFrom);
                        c.value.parameters.colorTo = Color.fromObject(c.value.parameters.colorTo);
                    }
                }
            });
        currentCharacteristics[currentAnimation] = characteristics;

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

    function startLamp() {
        if (!isLampRunning && state === State.IDLE) {
            isLampRunning = true;
            tick(0);
        }

        function tick(t: number) {
            // Loop timing, keep at the beginning
            const tickStart = Date.now();

            // Get the current animation
            const animation: LampAnimation = animationStore[currentAnimation];
            if (!currentCharacteristics[animation.name]) {
                currentCharacteristics[animation.name] = animation.options.map(o => {
                    let characteristic: Characteristic;
                    if (o.type === "color") {
                        characteristic = { type: "color", value: { type: "static", color: o.default } };
                    } else if (o.type === "number") {
                        characteristic = { type: "number", value: o.default };
                    } else if (o.type === "select") {
                        characteristic = { type: "select", value: o.default };
                    }

                    return characteristic;
                });
            }

            const characteristics = currentCharacteristics[animation.name];

            const parameters = characteristics.map(c => {
                switch (c.type) {
                    case "number":
                        return c.value;
                    case "select":
                        return c.value;
                    case "color":
                        if (c.value.type === "static") {
                            return c.value.color;
                        } else if (c.value.type === "gradient") {
                            return c.value.parameters.colorFrom; // TODO
                        } else if (c.value.type === "rainbow") {
                            return new Color(0, 0, 255, 0); // TODO
                        }
                }
            });

            animation.animate(t, display, parameters);

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
