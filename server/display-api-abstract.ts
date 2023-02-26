import dgram from "dgram-as-promised";
import { Color } from "./color";

export abstract class DisplayAPIAbstract {
  public size: number;
  public rootHost: string;
  public rootPort: number;

  protected lastFrameRendered = true;

  public set(colors: Color[]): void {
    if (this.lastFrameRendered) {
      this.lastFrameRendered = false;

      this.sendColors(colors)
        .then(() => {
          this.lastFrameRendered = true;
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  protected abstract sendColors(colors: Color[]): Promise<any>;
}
