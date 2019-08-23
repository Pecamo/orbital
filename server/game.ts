import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";
import _ from 'lodash';

interface GameState {
    players: {
        [player: string]: {
            x: number,
            color: Color
            shotCooldown: number,
            facesRight: boolean,
            alive: boolean,
        }
    }
    shots: {
        owner: string,
        x: number,
        facesRight: boolean,
        age: number
    }[],
    winner?: string
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
        if (this.gameState.winner) {
            return `Winner : ${this.gameState.winner}`;
        }
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
            '0': {
                [pressedKey]: !!Math.round(Math.random())
            },
            '1': {
                [pressedKey]: !!Math.round(Math.random())
            },
            '2': {
                [pressedKey]: !!Math.round(Math.random())
            },
            '3': {
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
        let alive = 0;
        let lastAlive = '';
        for (const playerId in this.gameState.players) {
            const player = this.gameState.players[playerId];
            if (player.alive) {
                alive += 1;
                lastAlive = playerId;
            }
        }
        if (alive === 1) {
            return Object.assign({}, gameState, {winner: lastAlive}) as GameState;
        }

        // Usual handle
        const nextState = _.cloneDeep(gameState) as GameState;

        // Frame Players
        for (let playerId in nextState.players) {
            const player = nextState.players[playerId];
            // Skip if player is dead
            if (!player.alive) {
                continue;
            }
            // Decrease show cooldown
            player.shotCooldown = Math.max(0, player.shotCooldown - 1);
            // Update movement or direction if any move playerId is pressed
            if (heldInputs[playerId].left || heldInputs[playerId].right) {
                const wantedMove = (heldInputs[playerId].left ? -1 : 0) + (heldInputs[playerId].right ? 1 : 0);
                player.facesRight = wantedMove > 0;
                const wantedPos = this.move(player.x, wantedMove);
                // Check if any other player is already here
                let free = true;
                for (let otherId in nextState.players) {
                    if (nextState.players[otherId].x === wantedPos) {
                        free = false;
                    }
                }
                if (free) {
                    player.x = this.move(player.x, wantedMove);
                }
            }
            if (heldInputs[playerId].fire && player.shotCooldown == 0) {
                const newShot = {
                    owner: playerId,
                    x: player.x + (player.facesRight ? 0 : -0),
                    facesRight: player.facesRight,
                    age: 0
                };
                nextState.shots.push(newShot);
                nextState.players[playerId].shotCooldown = 8;
            }
        }

        // Frame Shots
        const nextShots = [];
        for (let key in nextState.shots) {
            const shot = nextState.shots[key];
            // Detect if it hits anything
            let hit = false;
            // Loop on players
            for (let playerId in nextState.players) {
                const player = nextState.players[playerId];
                if (!player.alive) {
                    continue;
                }
                if ((player.x === shot.x || player.x === this.move(shot.x, shot.facesRight ? -1 : 1)) && shot.owner !== playerId) {
                    player.alive = false;
                    hit = true;
                }
            }
            // Loop on other shots
            /*
            for (let skey in gameState.shots) {
                const other = gameState.shots[skey];
                if (other.x === shot.x || other.x === shot.x + (shot.facesRight ? -1 : 1) && shot.owner !== other.owner) {
                    hit = true;
                }
            }
            */
            if (!hit && shot.age <= 14) {
                const newShot = {
                    ...shot,
                    x: this.move(shot.x, shot.facesRight ? 2 : -2),
                    age: shot.age + 1
                };
                nextShots.push(newShot);
            }
        }
        nextState.shots = nextShots;
        return nextState;
    }
}
