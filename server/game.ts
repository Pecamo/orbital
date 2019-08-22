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
    [player: number]: Partial<Inputs>
}

export class Game {
    public fps: number = 14;
    public stageSize: number = 180;
    public display: Display = new Display(this.stageSize);
    public gameState: GameState;
    public heldInputs: InputsState;
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];

    public move = (from, toAdd) => {
        return ((from + toAdd) + this.stageSize) % this.stageSize;
    };

    public startingGameState = (nbPlayers: number) => {
        console.log(nbPlayers);
        console.log([...Array(nbPlayers).keys()]);
        const players = [...Array(nbPlayers).keys()]
          .map((e, i) => i)
          .reduce((acc, curr, i) => {
              acc[curr] = {
                  x: Math.floor((this.stageSize / nbPlayers) * i),
                  color: Color.getRandom(),
                  shotCooldown: 0,
                  facesRight: 1,
                  alive: true
              };
              return acc;
          }, {});
        return {
            players,
            shots: []
        }
    };

    public static startingInputsState(nbPlayers: number) {
        return [...Array(nbPlayers).keys()]
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

    constructor(public numberOfPlayers: number) {
        this.gameState = this.startingGameState(numberOfPlayers);
        this.heldInputs = Game.startingInputsState(numberOfPlayers);
        // console.log(this.gameState);
        this.tick();
    }

    public toString() {
        let world = '';
        for (let x = 0; x < this.stageSize; x++) {
            let char = '_';
            for (let playerId in this.gameState.players) {
                const player = this.gameState.players[playerId];
                if (player.x === x && player.alive) {
                    char = '' + playerId;
                }
            }
            for (let shotId in this.gameState.shots) {
                const shot = this.gameState.shots[shotId];
                if (shot.x === x) {
                    char = shot.facesRight ? '⯈' : '⯇';
                }
                if (shot.x === this.move(x, 1) && shot.facesRight) {
                    char = '⬩'
                }
                if (shot.x === this.move(x, -1) && !shot.facesRight) {
                    char = '⬩'
                }
            }
            world += char;
        }
        return world;
    }

    public tick() {
        // Loop timing, keep at the beginning
        const tickStart: Date = new Date();

        this.display.render();
        const pressedKey = ['right', 'left', 'fire'][Math.floor(Math.random()*3)];
        const newInputs = {
            0: {
                [pressedKey]: !!Math.round(Math.random())
            },
            1: {
                [pressedKey]: !!Math.round(Math.random())
            },
            2: {
                [pressedKey]: !!Math.round(Math.random())
            },
            3: {
                [pressedKey]: !!Math.round(Math.random())
            }
        };
        this.frame(newInputs);
        // console.log(this.gameState);
        console.log(this.toString());

        // Loop timing, keep at the end
        const tickEnd: Date = new Date();
        const diff = tickStart.getTime() - tickEnd.getTime();
        const waitingTime = 1 / this.fps * 1000 + diff;
        setTimeout(() => this.tick(), waitingTime);
    }

    public frame = (newInputs: Partial<InputsState>) => {
        this.heldInputs = Game.nextInputs(this.heldInputs, newInputs);
        // console.log('NEWINPUTS');
        // console.log(this.heldInputs);
        this.gameState = this.nextState(this.gameState, this.heldInputs);
    };

    public static nextInputs(heldInputs: InputsState, newInputs: Partial<InputsState>): InputsState {
        const result = Object.assign({}, heldInputs);
        for (let key in newInputs) {
            result[key] = Object.assign({}, heldInputs[key], newInputs[key]);
        }
        return result;
    }

    public nextState = (gameState: GameState, heldInputs: InputsState): GameState => {
        // End condition
        if (Object.values(gameState.players).filter(p => p.alive) === 1) {

        }

        const nextState = Object.assign({}, gameState) as GameState;

        // Frame Players
        for (let key in nextState.players) {
            const player = nextState.players[key];
            if (player.alive) {
                if (player.shotCooldown > 0) {
                    player.shotCooldown -= 1;
                }
                if (heldInputs[key].left) {
                    player.x = this.move(player.x, -1);
                    player.facesRight = false;
                }
                if (heldInputs[key].right) {
                    player.x = this.move(player.x, 1);
                    player.facesRight = true;
                }
                if (heldInputs[key].fire && player.shotCooldown == 0) {
                    const newShot = {
                        owner: parseInt(key),
                        x: player.x + (player.facesRight ? 2 : -2),
                        facesRight: player.facesRight,
                        age: 0
                    };
                    nextState.shots.push(newShot);
                    nextState.players[key].shotCooldown = 8;
                }
            }
        }

        // Frame Shots
        const newShots = [];
        for (let key in gameState.shots) {
            const shot = gameState.shots[key];
            // Detect if it hits anything
            let hit = false;
            // Loop on players
            for (let pkey in nextState.players) {
                const player = nextState.players[pkey];
                if (!player.alive) {
                    continue;
                }
                if (player.x === shot.x || player.x === this.move(shot.x, shot.facesRight ? -1 : 1) && `${shot.owner}` !== `${pkey}`) {
                    player.alive = false;
                    hit = true;
                }
            }
            // Loop on other shots
            /*for (let skey in nextState.shots) {
                const other = nextState.shots[skey];
                if (other.x === shot.x || other.x === shot.x + (shot.facesRight ? -1 : 1) && shot.owner !== other.owner) {
                    hit = true;
                }
            }*/
            if (!hit && shot.age <= 14) {
                const newShot = {
                    ...shot,
                    x: this.move(shot.x, shot.facesRight ? 2 : -2),
                    age: shot.age + 1
                };
                newShots.push(newShot);
            }
        }
        nextState.shots = newShots;
        return nextState;
    }
}
