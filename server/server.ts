import express from 'express';
import expressWsWrapper from 'express-ws';
import { Message } from './types/Message';
import * as path from "path";
import {Game} from "./game";

let app = express();
const expressWs = expressWsWrapper(app);

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

const game = new Game(4);



function handleMessage(msg: Message) {
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
