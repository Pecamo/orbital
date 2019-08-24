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
const WAITING_TIME = 15 * 1000;
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
        console.log(data);
        const msg: CSMessage = JSON.parse(data.toString());
        console.log(msg);
        handleMessage(msg as CSMessage, ws);
    });

    ws.on('close', () => {
        console.log('client close');
        clients.splice(clients.indexOf(ws as any as string as any as number as any as boolean as any as WebSocket));

        if (clients.length === 0) {
            state = State.IDLE;
            game = null;
        }
    });

    console.log('socket');
});

app.listen(3000);
console.log(`Server listening on port 3000`);

let isDisplay: boolean = true;
console.log(process.argv[2]);

if (process.argv[2] === '--no-display') {
    isDisplay = false;
}

const display: Display = new Display(NB_LED, isDisplay);

// States of the Art
function startWaiting() {
    state = State.WAITING;
    const startTime = (new Date()).getTime();

    game = new Game(clients.length, display);

    const cooldown = setInterval(() => {
        if (clients.length === 0) {
            state = State.IDLE;
            clearInterval(wait);
        }

        const diffTime = (new Date()).getTime() - startTime;
        clients.forEach((c, i) => sendMsg(c, { cmd: 'getReady', data: diffTime, color: game.gameState.players[i].color.toString() }));
    }, 500)

    const wait = setTimeout(() => {
        clearInterval(cooldown);

        if (clients.length === 0) {
            state = State.IDLE;
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

function endGame(winnerIndex: string) {
    state = State.END;

    const winner: WebSocket = clients[winnerIndex];
    sendMsg(winner, { cmd: 'won' });
    clients.filter(c => c !== winner).forEach(c => sendMsg(c, { cmd: 'lost' }));

    setInterval(() => {
        state = State.IDLE;
        broadcastMsg({ cmd: 'welcome' });
    }, 10000);
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
            game.newInputs[clients.indexOf(ws)][msg.data] = true;
            break;
        case 'release':
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
