import * as dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

export const LAMP_FPS: number = parseInt(process.env.LAMP_FPS);
export const ORBITAL_NB_LED: number = parseInt(process.env.ORBITAL_NB_LED);
export const DISPLAY_API_HOSTNAME: string = process.env.DISPLAY_API_HOSTNAME;
export const DISPLAY_API_PORT: number = parseInt(process.env.DISPLAY_API_PORT);
export const WAITING_TIME_SEC: number = parseInt(process.env.WAITING_TIME_SEC);
export const GAME_FPS: number = parseInt(process.env.GAME_FPS);
export const ORBITAL_PORT: number = parseInt(process.env.ORBITAL_PORT);
