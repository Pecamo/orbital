import {
  GameOptionBoolean,
  GameOptionEnum,
  GameOptionNumber,
} from "./GameOptionTypes";

export type GameOptions = {
  BattleRoyale: GameOptionBoolean;
  MissileCollision: GameOptionEnum;
  ShotCooldown: GameOptionNumber;
};
