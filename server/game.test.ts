import { Game } from "./game";
import { Display } from "./display";
import { GameOptions } from "./types/GameOptions";

const gameOptions: GameOptions = {
  BattleRoyale: {
    type: "boolean",
    default: false,
    value: false,
  },
  MissileCollision: {
    type: "enum",
    default: "on",
    value: "on",
    options: ["on", "off", "stronger"],
  },
  ShotCooldown: {
    type: "number",
    default: 12,
    value: 12,
    min: 1,
    max: 20,
  },
};

test("Game is created correctly", () => {
  const display: Display = new Display(100, "", 13335, false);
  const game = new Game(20, 2, display, gameOptions);
  expect(game.newInputs.length).toBe(0);
});
