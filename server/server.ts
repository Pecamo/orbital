import express from 'express';
import expressWsWrapper from 'express-ws';
import { CSMessage, SCMessage } from './types/Message';
import * as path from "path";
import * as env from "./env";
import { Character, Game, GameState, Inputs } from "./game";
import { Display } from './display';
import { Color } from './color';
import { HtmlColors } from './htmlColors';
import { GameOptions } from "./types/GameOptions";
import { Line } from './types/Line';
import { lamp } from './lamp';
import { NB_LED, fetchNB_LED } from './NB_LED';

export enum State {
    IDLE,
    WAITING,
    GAME,
    END,
}

export let state: State = State.IDLE;
let cooldown;
let ledAnim;
export let display: Display;

fetchNB_LED().then(() => init());

function init() {
    const app = express();
    const expressWs = expressWsWrapper(app);

    app.use('/lamp', lamp);

    app.use('/static', express.static(__dirname + '/../static'));

    app.get('/', (req, res, next) => {
        res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
    });

    app.use('/', express.static(__dirname + '/../staticRoot'));


    expressWs.app.ws('/', (ws, req) => {
        ws.on('message', (data) => {
            const msg: CSMessage = JSON.parse(data.toString());
            handleMessage(msg as CSMessage, ws as any as WebSocket);
        });

        ws.on('close', () => {
            players = players.filter(c => c.ws !== ws as any as WebSocket);

            if (players.length === 0 || players.filter(c => c.ws.readyState === 1).length === 0) {
                state = State.IDLE;
                players = [];
                game = null;
            }
        });
    });

    const port: number = parseInt(process.argv[2]) || env.ORBITAL_PORT;
    app.listen(port);
    console.log(`Server listening on port ${port}`);

    const invertOrientation = process.argv.includes('--invert');
    display = new Display(NB_LED, DISPLAY_API_HOSTNAME, DISPLAY_API_PORT, invertOrientation);

    displayServerStarted();
}

let gameOptions: GameOptions = {
    BattleRoyale: {
        type: "boolean",
        default: true,
        value: true,
    },
    MissileCollision: {
        type: "enum",
        default: "on",
        value: "on",
        options: ["on", "off", "stronger"]
    },
    ShotCooldown: {
        type: "number",
        default: 12,
        value: 12,
        min: 1,
        max: 20
    }
};

const MINIMUM_PLAYERS = 2;
const DISPLAY_API_HOSTNAME = env.DISPLAY_API_HOSTNAME || 'localhost';
const DISPLAY_API_PORT = env.DISPLAY_API_PORT || 13334;
const WAITING_TIME = env.WAITING_TIME_SEC * 1000;
const GAME_FPS = env.GAME_FPS || 20;

let players: {ws: WebSocket, character?: Character, inputs?: Partial<Inputs>}[] = [];
let spectators: WebSocket[] = [];
let game: Game = null;
let startTime = Date.now();
let currentDisplayAnim;

// States of the Art
function startWaiting() {
    startTime = Date.now();
    state = State.WAITING;
    let diffTime: number = WAITING_TIME;

    stopCurrentAnimation();

    ledAnim = setInterval(() => {
        displayWaitingColor(1 - diffTime / WAITING_TIME);
    }, 15);

    cooldown = setInterval(() => {
        if (players.length === 0) {
            state = State.IDLE;
            players = [];
        }

        const colors = Color.getRange(players.length);
        diffTime = (WAITING_TIME - (Date.now() - startTime));
        players.forEach((c, i) => sendMsg(c.ws, { cmd: 'getReady', data: Math.round(diffTime / 1000), color: colors[i].toString() }));

        if (players.length === 0) {
            state = State.IDLE;
            players = [];
        } else {
            if (diffTime <= 0) {
                clearInterval(cooldown);
                clearInterval(ledAnim);
                startGame();
            }
        }
    }, 500);
}

function cancelWaiting(ws) {
    sendMsg(ws, { cmd: 'welcome' });
    players = [];
    stopCurrentAnimation();
    state = State.IDLE;
    clearInterval(cooldown);
    clearInterval(ledAnim);
}

function onDeath(player: Character) {
    const deceasedPlayer = players.find(c => c.character.id === player.id);

    if (deceasedPlayer && deceasedPlayer.ws && deceasedPlayer.ws.readyState === 1) {
        sendMsg(deceasedPlayer.ws, { cmd: 'lost' });
        players = players.filter(p => p !== deceasedPlayer);
    }
}

function onNewState(newState: GameState) {
    // Send to all clients
    spectators.forEach(ws => {
        if (ws.readyState === 1) {
            sendMsg(ws, {
                cmd: 'spectateData',
                data: {
                    stageSize: this.stageSize,
                    ...newState
                }
            });
        }
    })
}

function startGame() {
    state = State.GAME;

    game = new Game(GAME_FPS, players.length, display, gameOptions, onDeath, onNewState);

    players.forEach((c, i) => {c.character = game.gameState.characters[i];});
    players.forEach((c, i) => {
        if (!game.newInputs[i]) {
            game.newInputs[i] = {};
        }

        c.inputs = game.newInputs[i];

    });
    players.forEach((c, i) => sendMsg(c.ws, { cmd: 'play', color: game.gameState.characters[i].color.toString() }));

    game.start().then(winner => {
        endGame(winner);
    });
}

function endGame(winner: Character) {
    state = State.END;

    const winnerPlayer = players.find(c => c.character.id === winner.id);

    displayWinnerColor(winner.color);

    if (!winnerPlayer) {
        state = State.IDLE;
        broadcastMsg({ cmd: 'lost' });
        players = [];
        return;
    }

    sendMsg(winnerPlayer.ws, { cmd: 'won' });
    spectators.forEach(s => sendMsg(s, { cmd: 'won' })); // TODO Change that for "Blue won".

    players.filter(c => c.character.id !== winner.id).forEach(c => sendMsg(c.ws, { cmd: 'lost' }));
    players = [];

    state = State.IDLE;
}

function handleMessage(msg: CSMessage, ws: WebSocket) {
    switch (msg.cmd) {
        case 'join': {
            if (state === State.IDLE) {
                players.push({ws});
                if (players.length > MINIMUM_PLAYERS - 1) {
                    startWaiting();
                } else {
                    broadcastMsg({ cmd: 'wait' });
                }
            } else if (state === State.WAITING) {
                players.push({ws});
                startTime = Date.now();
            } else {
                sendMsg(ws, { cmd: 'gameInProgress' });
            }
            break;
        }
        case 'cancel': {
            if (players.length == 1) {
                players = [];
                cancelWaiting(ws);
            }
            break;
        }
        case 'press': {
            const player = players.find(c => c.ws === ws);
            if (!player) {
                return;
            }
            player.inputs[msg.data] = true;
            break;
        }
        case 'release': {
            const player = players.find(c => c.ws === ws);
            if (!player) {
                return;
            }
            player.inputs[msg.data] = false;
            break;
        }
        case 'spectate': {
            spectators.push(ws);
            break;
        }
        case 'queryGameOptions': {
            sendMsg(ws, { cmd: 'readGameOptions', data: gameOptions });
            break;
        }
        case 'writeGameOptions': {
            // TODO we may want to validate this
            gameOptions = msg.data;
            break;
        }
        default: {
            console.warn(`Unknown ws command: ${msg['cmd']}`);
            break;
        }
    }
}

function broadcastMsg(msg: SCMessage) {
    players.forEach(c => sendMsg(c.ws, msg));
}

function sendMsg(player: WebSocket, msg: SCMessage) {
    if (player.readyState === 1) {
        player.send(JSON.stringify(msg));
    }
}

function displayServerStarted() {
    const colors: Color[] = [
        HtmlColors.red,
        HtmlColors.green,
        HtmlColors.blue,
        new Color(0, 0, 0, 255),
        HtmlColors.black,
    ];

    colors.forEach((color, i) => {
        setTimeout(() => {
            display.drawAll(color);
            display.render();
        }, i * 400);
    });
}

function displayWinnerColor(color: Color) {
    stopCurrentAnimation();

    let nbLoops = 2;
    let it = 0;
    currentDisplayAnim = setInterval(() => {
        if (it <= 255) {
            display.drawAll(color.withOpacitiy(1 - it / 255));
            display.render();
        } else {
            display.drawAll(color.withOpacitiy((it - 255) / 255));
            display.render();
        }
        if (it > 512) {
            it = 0;
            nbLoops--;
        }
        if (it === 255 && nbLoops < 0) {
            display.drawAll(color.withOpacitiy(0));
            display.render();
            stopCurrentAnimation();
        }
        it += 5;
    }, 20);
}

function displayWaitingColor(percentage: number) {
    stopCurrentAnimation();

    const color: Color = new Color(percentage * 255, 0, (1 - percentage) * 255);

    display.drawLine(new Line(NB_LED, 0, Math.floor(NB_LED * percentage)), color);
    display.render();
}

function stopCurrentAnimation() {
    if (currentDisplayAnim) {
        clearInterval(currentDisplayAnim);
    }
}
