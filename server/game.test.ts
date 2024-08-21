import {Game} from "./game";
import {Display} from "./display";
import {GameOptions} from "./types/GameOptions";
import {Color} from "./color";

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

const INITIAL_STATE = {
  characters: [
    {
      alive: true,
      color: new Color(255, 0, 0, 0),
      facesRight: true,
      id: 0,
      shotCooldown: 0,
      shotRange: 18,
      x: 0,
    },
    {
      alive: true,
      color: new Color(0, 255, 255, 0),
      facesRight: true,
      id: 1,
      shotCooldown: 0,
      shotRange: 18,
      x: 50,
    }
  ],
  shots: [],
  turnNb: 0,
};

function generateTestDisplayAndGame() {
  const display = new Display(100, "", 13335, false);
  const game = new Game(20, 2, display, gameOptions);
  return {display, game};
}

const FAKE_DATE = new Date('2020-01-01');

describe('Game', () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(FAKE_DATE);
  });

  test("is created correctly", () => {
    const {game} = generateTestDisplayAndGame();
    expect(game.newInputs.length).toBe(0);
    expect(game.gameState).toStrictEqual({
      ...INITIAL_STATE, startDate: FAKE_DATE,
    });
  });
})
