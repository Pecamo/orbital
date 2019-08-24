import { Color } from "./color";
import { Display } from "./display";
import { HtmlColors } from "./htmlColors";
import _ from 'lodash';

interface GameState {
    players: {
        [player: string]: {
            x: number,
            color: Color,
            shotCooldown: number,
            facesRight: boolean,
            alive: boolean,
        }
    }
    shots: {
        owner: string,
        x: number,
        facesRight: boolean,
        age: number,
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
    public fps: number = 15;
    public stageSize: number = 300;
    public gameState: GameState;
    public heldInputs: InputsState;
    public playerColors = [HtmlColors.red, HtmlColors.blue, HtmlColors.green, HtmlColors.yellow];
    public newInputs: Partial<InputsState>;

    constructor(public numberOfPlayers: number, public display: Display) {
        this.display = display;
        this.gameState = this.startingGameState(numberOfPlayers);
        this.heldInputs = Game.startingInputsState(numberOfPlayers);
        // console.log(this.gameState);
    }

    public start(): Promise<string> {
        return this.tick();
    }

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
                  color: this.playerColors.shift(),
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

    public tick(): Promise<string> {
        return new Promise<string>((resolve, ) => {
            // Loop timing, keep at the beginning
            const tickStart: Date = new Date();

            // draw players
            Object.keys(this.gameState.players).forEach(key => {
                const player = this.gameState.players[key];
                if (player.alive) {
                    this.display.drawDot(player.x, player.color);
                }
            });

            // draw shots
            this.gameState.shots.forEach(shot => {
                this.display.drawDot(shot.x, Color.overlap(Color.overlap(HtmlColors.darkgrey, this.gameState.players[shot.owner].color, 0.3), HtmlColors.black, shot.age / 15));
            });

            this.display.render();

            const pressedKey = ['right', 'left', 'fire'][Math.floor(Math.random()*3)];

            // demo mode
            this.newInputs = {
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

            this.heldInputs = Game.nextInputs(this.heldInputs, this.newInputs);
            this.gameState = this.nextState(this.gameState, this.heldInputs);

            if (this.gameState.winner) {
                resolve(this.gameState.winner);
            }

            // console.log(this.gameState);
            if (!this.display.isDisplay) {
                console.log(this.toString());
            }

            // Loop timing, keep at the end
            const tickEnd: Date = new Date();
            const diff = tickStart.getTime() - tickEnd.getTime();
            const waitingTime = 1 / this.fps * 1000 + diff;
            setTimeout(() => this.tick(), waitingTime);
        });
    }

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
            for (let skey in nextState.shots) {
                const other = nextState.shots[skey];

                const shot_0 = shot.x;
                const shot_1 = this.move(shot.x, shot.facesRight ? 1 : -1);
                const shot_2 = this.move(shot.x, shot.facesRight ? 2 : -2);

                const other_0 = other.x;
                const other_1 = this.move(other.x, other.facesRight ? 1 : -1);
                const other_2 = this.move(other.x, other.facesRight ? 2 : -2);

                if ((
                  shot_0 === other_0 ||
                  shot_0 === other_1 ||
                  shot_0 === other_2 ||
                  shot_1 === other_0 ||
                  shot_1 === other_1 ||
                  shot_1 === other_2 ||
                  shot_2 === other_0 ||
                  shot_2 === other_1 ||
                  shot_2 === other_2
                ) && other.owner !== shot.owner) {
                    shot.age = 1000;
                    other.age = 1000;
                }
            }
        }
        for (let key in nextState.shots) {
            const shot = nextState.shots[key];
            if (shot.age <= 14) {
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
