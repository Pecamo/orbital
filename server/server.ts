import express from 'express';
import expressWsWrapper from 'express-ws';
import { CSMessage, SCMessage } from './types/Message';
import * as path from "path";
import { Game } from "./game";
import { Display } from './display';

let app = express();
const expressWs = expressWsWrapper(app);
const NB_LED = 300;
const MINIMUM_PLAYERS = 2;
const WAITING_TIME = 3 * 1000;
const END_SCREEN_TIME = 5 * 1000;
let clients: WebSocket[] = [];
let game: Game = null;

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

app.use('/static', express.static('public'));

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

console.log(process.argv);
const invertOrientation = process.argv.includes('--invert');
const display: Display = new Display(NB_LED, isDisplay, invertOrientation);

// States of the Art
function startWaiting() {
    state = State.WAITING;
    const startTime = (new Date()).getTime();

    game = new Game(clients.length, display);

    const cooldown = setInterval(() => {
        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
            clearInterval(wait);
        }

        const diffTime = Math.round((WAITING_TIME - ((new Date()).getTime() - startTime)) / 1000);
        clients.forEach((c, i) => sendMsg(c, { cmd: 'getReady', data: diffTime, color: game.gameState.players[i].color.toString() }));
    }, 500);

    const wait = setTimeout(() => {
        clearInterval(cooldown);

        if (clients.length === 0) {
            state = State.IDLE;
            clients = [];
        } else {
            startGame();
        }
    }, WAITING_TIME);
}

function startGame() {
    state = State.GAME;

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


    setTimeout(() => {
        state = State.IDLE;
        broadcastMsg({ cmd: 'welcome' });
        clients = [];
    }, END_SCREEN_TIME);
}

function handleMessage(msg: CSMessage, ws) {
    // game.gameState.players[clients.indexOf(ws)].color;

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
