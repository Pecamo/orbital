import type {GameOptions} from "../../../../server/types/GameOptions";

export type Setting = {
  name: string,
  option: GameOptions[keyof GameOptions];
};
