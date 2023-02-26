import dgram from "dgram-as-promised";
import { Color } from "./color";
import { DisplayAPIAbstract } from "./display-api-abstract";

export class DisplayAPI_WLED extends DisplayAPIAbstract {
  constructor(public size: number, public rootHost: string, public rootPort: number) {
    super();
  }

  private socket = dgram.createSocket("udp4");

  protected sendColors(colors: Color[]): Promise<any> {
    const sendData = { colors };

    const protocol = 0x03; // 0x00: WLED Notifier, 0x01: WARLS, 0x02: DRGB, 0x03: DRGBW, 0x04: DNRGB
    const timeToNormalMode = 0xFF; // Use 0xFF to avoid getting back to WLED normal mode at any time
    const message = [protocol, timeToNormalMode];

    sendData.colors.forEach((color) => {
      message.push(color.r);
      message.push(color.g);
      message.push(color.b);
      message.push(color.w);
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
