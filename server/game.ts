import { Character } from "./character";
import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";

interface GameState {
    players: {
        [player: number]: {
            x: number,
            color: Color
            shotCooldown: number,
            facesRight: boolean,
            alive: boolean,
        }
    }
    shots: {
        owner: number,
        x: number,
        facesRight: boolean,
        age: number
    }[],
}

type inputKeys = 'right' | 'left' | 'fire'

type Inputs = {
    [key in inputKeys]: boolean
}

interface InputsState {
    [player: number]: Inputs
}

export class Game {
    public fps: number = 10;
    public stageSize: number = 300;
    public display: Display = new Display(this.stageSize);
    public gameState: GameState;
    public heldInputs: InputsState;
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];

    public static startingGameState(nbPlayers: number) {
        const players = [...Array(nbPlayers)]
          .map((e, i) => i)
          .reduce((acc, curr, i) => {
              acc[curr] = {
                  x: (300 / nbPlayers) * i,
                  color: Color.getRandom(),
                  shotCooldown: 0,
                  facesRight: 1
              };
              return acc;
          }, {});
        return {
            players,
            shots: []
        }
    }

    public static startingInputsState(nbPlayers: number) {
        return [...Array(nbPlayers)]
            .map((e, i) => i)
            .reduce((acc, curr) => {
                acc[curr] = {
                    left: false,
                    right: false,
                    fire: false,
                };
                return acc;
            }, {});
    }

    constructor(public numberOfPlayer: number) {
        this.gameState = Game.startingGameState(numberOfPlayer);
        this.heldInputs = Game.startingInputsState(numberOfPlayer);
    }

    public tick(gameState: GameState) {
        // Loop timing, keep at the beginning
        const tickStart: Date = new Date();

        this.display.render();

        // Loop timing, keep at the end
        const tickEnd: Date = new Date();
        const diff = tickStart.getTime() - tickEnd.getTime();
        const waitingTime = this.fps - diff / 1000;
        setTimeout(() => this.tick, waitingTime);
    }

    public frame(newInputs) {
        this.heldInputs = Game.nextInputs(this.heldInputs, newInputs);
        this.gameState = Game.nextState(this.gameState, this.heldInputs);
    }

    public static nextInputs(heldInputs: InputsState, newInputs: Partial<InputsState>): InputsState {
        return Object.assign({}, heldInputs, newInputs);
    }

    public static nextState(gameState: GameState, heldInputs: InputsState): GameState {
        const nextState = Object.assign({}, gameState) as GameState;

        // Frame Players
        for (let key in nextState.players) {
            const player = nextState.players[key];
            if (player.alive) {
                if (heldInputs[key].left) {
                    player.x -= 1;
                    player.facesRight = false;
                }
                if (heldInputs[key].right) {
                    player.x += 1;
                    player.facesRight = true;
                }
                if (heldInputs[key].fire && player.shotCooldown == 0) {
                    const newShot = {
                        owner: parseInt(key),
                        x: player.x + (player.facesRight ? 1 : -1),
                        facesRight: player.facesRight,
                        age: 0
                    };
                    nextState.shots.push(newShot);
                    nextState.players[key].shotCooldown = 4;
                }
            }
        }

        // Frame Shots
        const newShots = [];
        for (let key in gameState.shots) {
            const shot = gameState.shots[key];
            let hit = false;
            for (let key in nextState.players) {
                const player = nextState.players[key];
                if (player.x === shot.x || player.x === shot.x + (shot.facesRight ? -1 : 1)) {
                    player.alive = false;
                    hit = true;
                }
            }
            if (!hit) {
                const newShot = {
                    ...shot,
                    x: shot.x + (shot.facesRight ? 2 : -2)
                };
                newShots.push(newShot);
            }
        }
        nextState.shots = newShots;
        return nextState;
    }
}
