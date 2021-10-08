import * as dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

export const ORBITAL_NB_LED = process.env.ORBITAL_NB_LED
export const DISPLAY_API_HOSTNAME = process.env.DISPLAY_API_HOSTNAME
export const DISPLAY_API_PORT = process.env.DISPLAY_API_PORT
export const WAITING_TIME_SEC = process.env.WAITING_TIME_SEC
export const GAME_FPS = process.env.GAME_FPS
export const ORBITAL_PORT = process.env.ORBITAL_PORT
