import os from 'os';
import axios from 'axios';

export function connectToPortal(url: string) {
    setTimeout(() => sendHeartbeat(url), 5000);
}

function sendHeartbeat(url: string) {
    axios.post(url, {
        ip: getLocalIp(),
        password: "Orbital42"
    })
    .catch(e => {})
}

export function getLocalIp(): string {
    return Object.values(os.networkInterfaces()).reduce((a, b) => [...a, ...b]).filter(itf => !itf.internal && itf.family === 'IPv4')[0].address;
}
