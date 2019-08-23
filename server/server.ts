import express from 'express';
import expressWsWrapper from 'express-ws';
import { CSMessage } from './types/Message';
import * as path from "path";
import { Game } from "./game";
import { Display } from './display';
import { fork } from 'child_process';

let app = express();
const expressWs = expressWsWrapper(app);
const NB_LED = 300;
const MINIMUM_PLAYERS = 2;
const WAITING_TIME = 15 * 1000;
let clients = [];
let game = null;

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
    if (state === State.IDLE) {
        clients.push(ws);

        if (clients.length > MINIMUM_PLAYERS - 1) {
            startWaiting();
        }
    } else if (state === State.WAITING) {
        clients.push(ws);
    }

    ws.on('message', (data) => {
        console.log(data);
        const msg: CSMessage = JSON.parse(data.toString());
        console.log(msg);
        handleMessage(msg as CSMessage, ws);
    });

    ws.on('close', () => {
        console.log('client close');
        clients.splice(clients.indexOf(ws));
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

    setInterval(() => {
        if (clients.length === 0) {
            state = State.IDLE;
        } else {
            startGame();
        }
    }, WAITING_TIME);
}

function startGame() {
    state = State.GAME;

    game = new Game(clients.length, display);
    game.start().then(winner => {
        endGame(winner);
    });   
}

function endGame(winner: string) {
    state = State.END;

    setInterval(() => {
        state = State.IDLE;
    }, 10000);
}

function handleMessage(msg: CSMessage, ws) {
    // game.gameState.players[clients.indexOf(ws)].color;

    // TODO this.game.newInputs = ???
    /*
    switch (msg.cmd) {
        case :
            break;
        case 'shoot':
            break;
        case 'clear':
            break;
        default:
            console.warn(`Unknown ws command: ${msg.cmd}`);
            break;
    }
    */
}
