import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";
import { GameOptions } from "./types/GameOptions";
import _ from "lodash";
import { BattleRoyale, BattleRoyaleState } from "./mods/BattleRoyale";

const MAX_SHOT_RANGE = 18;
const MIN_SHOT_RANGE = 2;

export type Character = {
  id: number;
  x: number;
  color: Color;
  shotCooldown: number;
  shotRange: number;
  facesRight: boolean;
  alive: boolean;
};

export type Shot = {
  owner: string;
  x: number;
  facesRight: boolean;
  age: number;
  range: number;
};

export interface GameState {
  turnNb: number;
  startDate: Date;
  characters: Character[];
  shots: Shot[];
  winner?: Character;
  battleRoyale?: BattleRoyaleState;
}

type inputKeys = "right" | "left" | "fire";

export type Inputs = {
  [key in inputKeys]: boolean;
};

type InputsState = Array<Partial<Inputs>>;

export class Game {
  public stageSize: number;
  public gameState: GameState;
  public heldInputs: InputsState;
  public newInputs: Partial<InputsState>;

  constructor(
    public fps: number,
    public numberOfPlayers: number,
    public display: Display,
    public gameOptions: GameOptions,
    public onCharacterDeathCallback?: (player: Character) => void,
    public onNewStateCallback?: (state: GameState) => void
  ) {
    this.display = display;
    this.stageSize = display.size;
    this.newInputs = [];
    this.gameState = this.startingGameState(numberOfPlayers);
    this.heldInputs = Game.startingInputsState(numberOfPlayers);
  }

  public start(): Promise<Character> {
    return this.tick();
  }

  public move = (from, toAdd) => {
    return (from + toAdd + this.stageSize) % this.stageSize;
  };

  public startingGameState = (nbCharacters: number): GameState => {
    const characters: Character[] = [];

    const colors = Color.getRange(nbCharacters);

    for (let i = 0; i < nbCharacters; i++) {
      characters.push({
        id: i,
        x: Math.floor((this.stageSize / nbCharacters) * i),
        color: colors[i],
        shotCooldown: 0,
        facesRight: true,
        alive: true,
        shotRange: MAX_SHOT_RANGE,
      });
    }

    if (this.gameOptions.BattleRoyale.value) {
      return {
        startDate: new Date(),
        turnNb: 0,
        characters,
        shots: [],
        battleRoyale: BattleRoyale.startingGameState,
      };
    } else {
      return {
        startDate: new Date(),
        turnNb: 0,
        characters,
        shots: [],
      };
    }
  };

  public static startingInputsState(nbPlayer: number) {
    const inputs = [];

    for (let i = 0; i < nbPlayer; i++) {
      inputs.push({
        left: false,
        right: false,
        fire: false,
      });
    }

    return inputs;
  }

  public toString() {
    let world = "";
    if (this.gameState.winner) {
      return `Winner : ${this.gameState.winner}`;
    }

    for (let x = 0; x < this.stageSize; x++) {
      let char = "_";
      for (const characterId in this.gameState.characters) {
        const character = this.gameState.characters[characterId];
        if (character.x === x && character.alive) {
          char = "" + characterId;
        }
      }
      for (const shotId in this.gameState.shots) {
        const shot = this.gameState.shots[shotId];
        if (shot.x === x) {
          char = shot.facesRight ? "⯈" : "⯇";
        }
        if (shot.x === this.move(x, 1) && shot.facesRight) {
          char = "⬩";
        }
        if (shot.x === this.move(x, -1) && !shot.facesRight) {
          char = "⬩";
        }
      }
      world += char;
    }
    return world;
  }

  public tick(): Promise<Character> {
    return new Promise<Character>((resolve) => {
      // Loop timing, keep at the beginning
      const tickStart = Date.now();

      if (this.gameOptions.BattleRoyale.value) {
        BattleRoyale.tick(this.gameState, this.display);
      }

      // draw characters
      Object.keys(this.gameState.characters).forEach((key) => {
        const character = this.gameState.characters[key];
        if (character.alive) {
          this.display.drawDot(character.x, character.color);
        }
      });

      // draw shots
      this.gameState.shots.forEach((shot) => {
        this.display.drawDot(
          shot.x,
          Color.overlap(
            Color.overlap(
              HtmlColors.darkgrey,
              this.gameState.characters[shot.owner].color,
              0.3
            ),
            HtmlColors.black,
            shot.age / 24
          )
        );
      });

      this.display.render();

      this.heldInputs = Game.nextInputs(this.heldInputs, this.newInputs);
      this.gameState = this.nextState(this.gameState, this.heldInputs);

      if (this.gameState.winner) {
        resolve(this.gameState.winner);
        return;
      }

      // Loop timing, keep at the end
      const tickEnd = Date.now();
      const diff = tickStart - tickEnd;
      const waitingTime = (1 / this.fps) * 1000 + diff;
      setTimeout(() => resolve(this.tick()), waitingTime);
    });
  }

  public static nextInputs(
    heldInputs: InputsState,
    newInputs: Partial<InputsState>
  ): InputsState {
    const result = Object.assign({}, heldInputs);
    for (const key in newInputs) {
      result[key] = Object.assign({}, heldInputs[key], newInputs[key]);
    }
    return result;
  }

  public nextState = (
    gameState: GameState,
    heldInputs: InputsState
  ): GameState => {
    // End condition
    let alive = 0;
    let lastAlive: Character = null;
    for (let i = 0; i < this.gameState.characters.length; i++) {
      const character = this.gameState.characters[i];
      if (character.alive) {
        alive += 1;
        lastAlive = character;
      }
    }

    if (alive === 1) {
      return Object.assign({}, gameState, { winner: lastAlive }) as GameState;
    }

    // Usual handle
    const nextState = _.cloneDeep(gameState) as GameState;

    // Frame characters
    for (const characterId in nextState.characters) {
      const character = nextState.characters[characterId];
      // Skip if character is dead
      if (!character.alive) {
        continue;
      }
      // Decrease shot cooldown
      character.shotCooldown = Math.max(0, character.shotCooldown - 1);
      // Recover shot range
      if (character.shotCooldown === 0) {
        character.shotRange = Math.min(
          MAX_SHOT_RANGE,
          character.shotRange + 0.2
        );
      }
      // Update movement or direction if any move characterId is pressed
      if (heldInputs[characterId].left || heldInputs[characterId].right) {
        const wantedMove =
          (heldInputs[characterId].left ? -1 : 0) +
          (heldInputs[characterId].right ? 1 : 0);
        character.facesRight = wantedMove > 0;
        const wantedPos = this.move(character.x, wantedMove);
        // Check if any other character is already here
        let free = true;
        const alives = nextState.characters.filter((p) => p.alive);
        for (const otherId in alives) {
          if (alives[otherId].x === wantedPos) {
            free = false;
          }
        }
        if (free) {
          character.x = this.move(character.x, wantedMove);
        }
      }
      if (heldInputs[characterId].fire && character.shotCooldown == 0) {
        const newShot: Shot = {
          owner: characterId,
          x: character.x,
          facesRight: character.facesRight,
          age: 0,
          range: character.shotRange,
        };
        nextState.shots.push(newShot);
        nextState.characters[characterId].shotCooldown =
          this.gameOptions.ShotCooldown.value;
        nextState.characters[characterId].shotRange = MIN_SHOT_RANGE;
      }
    }

    // Frame Shots
    const nextShots = [];
    for (const key in nextState.shots) {
      const shot = nextState.shots[key];
      // Loop on characters
      for (const characterId in nextState.characters) {
        const character = nextState.characters[characterId];
        if (!character.alive) {
          continue;
        }
        if (
          (character.x === shot.x ||
            character.x === this.move(shot.x, shot.facesRight ? -1 : 1)) &&
          shot.owner !== characterId
        ) {
          character.alive = false;
          if (this.onCharacterDeathCallback) {
            setTimeout(() => {
              this.onCharacterDeathCallback(character);
            }, 1);
          }
        }
      }
      // Loop on other shots
      for (const skey in nextState.shots) {
        const other = nextState.shots[skey];

        const shot_0 = shot.x;
        const shot_1 = this.move(shot.x, shot.facesRight ? 1 : -1);
        const shot_2 = this.move(shot.x, shot.facesRight ? 2 : -2);

        const other_0 = other.x;
        const other_1 = this.move(other.x, other.facesRight ? 1 : -1);
        const other_2 = this.move(other.x, other.facesRight ? 2 : -2);

        if (
          (shot_0 === other_0 ||
            shot_0 === other_1 ||
            shot_0 === other_2 ||
            shot_1 === other_0 ||
            shot_1 === other_1 ||
            shot_1 === other_2 ||
            shot_2 === other_0 ||
            shot_2 === other_1 ||
            shot_2 === other_2) &&
          other.owner !== shot.owner
        ) {
          shot.age = 1000;
          other.age = 1000;
        }
      }
    }

    for (const key in nextState.shots) {
      const shot = nextState.shots[key];
      if (shot.age <= shot.range) {
        const newShot = {
          ...shot,
          x: this.move(shot.x, shot.facesRight ? 2 : -2),
          age: shot.age + 1,
        };
        nextShots.push(newShot);
      }
    }

    nextState.shots = nextShots;

    // Mods
    if (this.gameOptions.BattleRoyale.value) {
      nextState.battleRoyale = BattleRoyale.nextState(
        gameState,
        nextState,
        this.stageSize
      );

      nextState.characters.forEach((character) => {
        if (
          nextState.battleRoyale.deathLines.some((line) =>
            line.includes(character.x)
          )
        ) {
          character.alive = false;
        }
      });
    }

    nextState.turnNb++;

    if (this.onNewStateCallback) {
      setTimeout(() => {
        this.onNewStateCallback(nextState);
      }, 1);
    }
    return nextState;
  };
}
