import dgram from 'dgram-as-promised';
import {Color} from "./color";

export class DisplayAPI {
    constructor(public size: number, public rootHost: string, public rootPort) {}

    private lastFrameRendered: boolean = true;

    private socket = dgram.createSocket('udp4');

    public set(colors: Color[]): void {
        if (this.lastFrameRendered) {
            this.lastFrameRendered = false;

            this.sendColors(colors)
            .then(response => {
                this.lastFrameRendered = true;
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    private sendColors(colors: Color[]): Promise<any> {
        const sendData = { colors };

        const header = 0x04; // 0x03 for RGB, 0x04 for RGBW
        const message = [header];

        sendData.colors.forEach(color => {
            message.push(color.w);
            message.push(color.r);
            message.push(color.g);
            message.push(color.b);
        });

        const messageBuffer = Buffer.from(message);

        return this.socket.send(messageBuffer, 0, messageBuffer.length, this.rootPort, this.rootHost);
    }
}
