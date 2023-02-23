import dgram from "dgram-as-promised";
import { Color } from "./color";
import { DisplayAPIAbstract } from "./display-api-abstract";

export class DisplayAPIRpi extends DisplayAPIAbstract {
  constructor(public size: number, public rootHost: string, public rootPort: number) {
    super();
  }

  private socket = dgram.createSocket("udp4");

  protected sendColors(colors: Color[]): Promise<any> {
    const sendData = { colors };

    const header = 0x04; // 0x03 for RGB, 0x04 for RGBW
    const message = [header];

    sendData.colors.forEach((color) => {
      message.push(color.w);
      message.push(color.r);
      message.push(color.g);
      message.push(color.b);
    });

    const messageBuffer = Buffer.from(message);

    return this.socket.send(
      messageBuffer,
      0,
      messageBuffer.length,
      this.rootPort,
      this.rootHost
    );
  }
}
