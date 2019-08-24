import express from 'express';
import expressWsWrapper from 'express-ws';
import { CSMessage, SCMessage } from './types/Message';
import * as path from "path";
import { Game } from "./game";
import { Display } from './display';
import { Color } from './color';

let app = express();
const expressWs = expressWsWrapper(app);
const NB_LED = 300;
const MINIMUM_PLAYERS = 2;
const WAITING_TIME = 20 * 1000;
let clients: WebSocket[] = [];
let game: Game = null;
let startTime = (new Date()).getTime();

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

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

expressWs.app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
        const msg: CSMessage = JSON.parse(data.toString());
        handleMessage(msg as CSMessage, ws);
    });

    ws.on('close', () => {
        clients.splice(clients.indexOf(ws as any as string as any as number as any as boolean as any as WebSocket));

        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
            game = null;
        }
    });
});

app.listen(3000);
console.log(`Server listening on port 3000`);

let isDisplay: boolean = true;
console.log(process.argv[2]);

if (process.argv.includes('--no-display')) {
    isDisplay = false;
}

const invertOrientation = process.argv.includes('--invert');
const display: Display = new Display(NB_LED, isDisplay, invertOrientation);

function startWaiting() {
// States of the Art
    startTime = (new Date()).getTime();
    state = State.WAITING;

    const cooldown = setInterval(() => {
        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
        }
        const colors = Color.getRange(clients.length);
        const diffTime = (WAITING_TIME - ((new Date()).getTime() - startTime)) / 1000;
        clients.forEach((c, i) => sendMsg(c, { cmd: 'getReady', data: Math.round(diffTime), color: colors[i].toString() }));


        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
        } else {
            if (diffTime <= 0) {
                clearInterval(cooldown);
                startGame();
            }
        }
    }, 500);
}

function startGame() {
    state = State.GAME;

    game = new Game(clients.length, display);

    clients.forEach((c, i) => sendMsg(c, { cmd: 'play', color: game.gameState.players[i].color.toString() }));

    game.start().then(winner => {
        endGame(winner);
    });
}

function endGame(winnerIndex: number) {
    state = State.END;

    const winner: WebSocket = clients[winnerIndex];
    sendMsg(winner, { cmd: 'won' });
    clients.filter(c => c !== winner).forEach(c => sendMsg(c, { cmd: 'lost' }));
    clients = [];

    state = State.IDLE;
}

function handleMessage(msg: CSMessage, ws) {
    console.log(JSON.stringify(msg));
    // TODO this.game.newInputs = ???
    switch (msg.cmd) {
        case 'join':
            if (state === State.IDLE) {
                clients.push(ws);

                if (clients.length > MINIMUM_PLAYERS - 1) {
                    startWaiting();
                } else {
                    broadcastMsg({ cmd: 'wait' });
                }
            } else if (state === State.WAITING) {
                clients.push(ws);
                startTime = (new Date()).getTime();
            } else {
                sendMsg(ws, { cmd: 'gameInProgress' });
            }
            break;
        case 'press':
            if (!game.newInputs[clients.indexOf(ws)]) {
                game.newInputs[clients.indexOf(ws)] = {};
            }

            game.newInputs[clients.indexOf(ws)][msg.data] = true;
            break;
        case 'release':
            if (!game.newInputs[clients.indexOf(ws)]) {
                game.newInputs[clients.indexOf(ws)] = {};
            }

            game.newInputs[clients.indexOf(ws)][msg.data] = false;
            break;
        default:
            console.warn(`Unknown ws command: ${msg}`);
            break;
    }
}

function broadcastMsg(msg: SCMessage) {
    clients.forEach(c => sendMsg(c, msg));
}

function sendMsg(client: WebSocket, msg: SCMessage) {
    client.send(JSON.stringify(msg));
}
