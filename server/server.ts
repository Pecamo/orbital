import express from 'express';
import expressWsWrapper from 'express-ws';
import { CSMessage, SCMessage } from './types/Message';
import * as path from "path";
import {Character, Game, Inputs} from "./game";
import { Display } from './display';
import { Color } from './color';

let app = express();
const expressWs = expressWsWrapper(app);
const NB_LED = 300;
const MINIMUM_PLAYERS = 2;
const WAITING_TIME = 20 * 1000;
let clients: {ws: WebSocket, character?: Character, inputs?: Partial<Inputs>}[] = [];
let game: Game = null;
let startTime = (new Date()).getTime();
let currentDisplayAnim;

enum State {
    IDLE,
    WAITING,
    GAME,
    END,
}

let state: State = State.IDLE;

app.use((req, res, next) => {
    return next();
});

app.use('/static', express.static(__dirname + '/../static'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

expressWs.app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
        const msg: CSMessage = JSON.parse(data.toString());
        handleMessage(msg as CSMessage, ws as any as WebSocket);
    });

    ws.on('close', () => {
        const index = clients.map(c => c.ws).indexOf(ws as any as WebSocket);
        const client = clients[index];

        /*
        if (client && 'character' in client && client.character) {
            return;
        }*/

        clients.splice(index, 1);

        if (clients.length === 0 || clients.filter(c => c.ws.readyState === 1).length === 0) {
            state = State.IDLE;
            clients = [];
            game = null;
        }
    });
});

app.listen(3000);
console.log(`Server listening on port 3000`);

let isDisplay: boolean = true;

if (process.argv.includes('--no-display')) {
    isDisplay = false;
}

const invertOrientation = process.argv.includes('--invert');
const display: Display = new Display(NB_LED, isDisplay, invertOrientation);

// States of the Art
function startWaiting() {
    startTime = (new Date()).getTime();
    state = State.WAITING;
    stopCurrentAnimation();

    const cooldown = setInterval(() => {
        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
        }

        const colors = Color.getRange(clients.length);
        const diffTime = (WAITING_TIME - ((new Date()).getTime() - startTime)) / 1000;
        clients.forEach((c, i) => sendMsg(c.ws, { cmd: 'getReady', data: Math.round(diffTime), color: colors[i].toString() }));

        displayWaitingColor(1 - diffTime / (WAITING_TIME / 1000));

        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
        } else {
            if (diffTime <= 0) {
                clearInterval(cooldown);
                startGame();
            }
        }
    }, 15);
}

function startGame() {
    state = State.GAME;

    game = new Game(clients.length, display);

    clients.forEach((c, i) => {c.character = game.gameState.players[i];});
    clients.forEach((c, i) => {
        if (!game.newInputs[i]) {
            game.newInputs[i] = {};
        }

        c.inputs = game.newInputs[i];
    });

    clients.forEach((c, i) => sendMsg(c.ws, { cmd: 'play', color: game.gameState.players[i].color.toString() }));

    game.start().then(winner => {
        endGame(winner);
    });
}

function endGame(winner: Character) {
    state = State.END;

    const winnerClient = clients.find(c => c.character.id === winner.id);

    displayWinnerColor(winner.color);

    if (!winnerClient) {
        console.log('NOT FOUND');
        state = State.IDLE;
        broadcastMsg({ cmd: 'lost' });
        clients = [];
        return;
    }
    console.log('FOUND');

    sendMsg(winnerClient.ws, { cmd: 'won' });

    clients.filter(c => c.character.id !== winner.id).forEach(c => sendMsg(c.ws, { cmd: 'lost' }));
    clients = [];

    state = State.IDLE;
}

function handleMessage(msg: CSMessage, ws: WebSocket) {
    // TODO this.game.newInputs = ???
    switch (msg.cmd) {
        case 'join':
            if (state === State.IDLE) {
                clients.push({ws});
                if (clients.length > MINIMUM_PLAYERS - 1) {
                    startWaiting();
                } else {
                    broadcastMsg({ cmd: 'wait' });
                }
            } else if (state === State.WAITING) {
                clients.push({ws});
                startTime = (new Date()).getTime();
            } else {
                sendMsg(ws, { cmd: 'gameInProgress' });
            }
            break;
        case 'press': {
            const client = clients.find(c => c.ws === ws);
            if (!client) {
                return;
            }
            client.inputs[msg.data] = true;
            break;}
        case 'release':{
            const client = clients.find(c => c.ws === ws);
            if (!client) {
                return;
            }
            client.inputs[msg.data] = false;
            break;}
        default:
            console.warn(`Unknown ws command: ${msg}`);
            break;
    }
}

function broadcastMsg(msg: SCMessage) {
    clients.forEach(c => sendMsg(c.ws, msg));
}

function sendMsg(client: WebSocket, msg: SCMessage) {
    if (client.readyState === 1) {
        client.send(JSON.stringify(msg));
    }
}

function displayWinnerColor(color: Color) {
    stopCurrentAnimation();

    let it = 0;
    currentDisplayAnim = setInterval(() => {
        if (it <= 255) {
            display.drawAll(color.withOpactiy(1 - it / 255));
            display.render();
        } else {
            display.drawAll(color.withOpactiy((it - 255) / 255));
            display.render();
        }
        if (it > 512) {
            it = 0;
        }
        it += 5;
    }, 20);
}

function displayWaitingColor(percentage: number) {
    stopCurrentAnimation();

    const color: Color = new Color(percentage * 255, 0, (1 - percentage) * 255);

    display.drawLine(0, Math.floor(NB_LED * percentage), color);
    display.render();
}

function stopCurrentAnimation() {
    if (currentDisplayAnim) {
        clearInterval(currentDisplayAnim);
    }
}
