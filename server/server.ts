import express from 'express';
import expressWsWrapper from 'express-ws';
import { Message } from './types/Message';
import * as path from "path";
import {Game} from "./game";
import { Display } from './display';

let app = express();
const expressWs = expressWsWrapper(app);
const NB_LED = 300;

enum State {
    IDLE,
    WAITING,
    GAME,
    END,
};

let state: State = State.GAME;

app.use((req, res, next) => {
    console.log('middleware');

    return next();
});

app.use('/static', express.static('public'));

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, '..', 'static', 'index.html'));
});

expressWs.app.ws('/', (ws, req) => {
    ws.on('message', (data) => {
        console.log(data);
        const msg: Message = JSON.parse(data.toString());
        console.log(msg);
        handleMessage(msg as Message);
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

nextState();

function nextState() {
    switch (state) {
        case State.IDLE:
            state = State.WAITING;
            nextState();
            break;
        case State.WAITING:
            state = State.GAME;
            nextState();
            break;
            case State.GAME:
                const game = new Game(4, display);
                game.start().then(winner => {
                    state = State.END;
                    nextState();
                });
    
            break;
        case State.END:
            setInterval(() => {
                state = State.IDLE;
            }, 10000);

            break;
    }
}

function handleMessage(msg: Message) {
    // TODO this.game.newInputs = ???
    switch (msg.cmd) {
        case 'move':
            break;
        case 'shoot':
            break;
        case 'clear':
            break;
        default:
            console.warn(`Unknown ws command: ${msg.cmd}`);
            break;
    }
}
