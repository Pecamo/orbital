import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const LAMP_FPS: number = parseInt(process.env.LAMP_FPS);
export const DISPLAY_API_HOSTNAME: string = process.env.DISPLAY_API_HOSTNAME;
export const DISPLAY_API_PORT: number = parseInt(process.env.DISPLAY_API_PORT);
export const DISPLAY_API_INFO_PORT: number = parseInt(process.env.DISPLAY_API_INFO_PORT);
export const WAITING_TIME_SEC: number = parseInt(process.env.WAITING_TIME_SEC);
export const GAME_FPS: number = parseInt(process.env.GAME_FPS);
export const ORBITAL_PORT: number = parseInt(process.env.ORBITAL_PORT);
export const SSL_ORBITAL_PORT: number = parseInt(process.env.SSL_ORBITAL_PORT);
export const SSL_CERT_PATH: string = process.env.SSL_CERT_PATH;
export const TOP_LED_NB: number = parseInt(process.env.TOP_LED_NB);
export const SPECTATE_MODE_ENABLED: boolean =
  process.env.SPECTATE_MODE_ENABLED.toLowerCase() === "true";
export const LAMP_MODE_ENABLED: boolean =
  process.env.LAMP_MODE_ENABLED.toLowerCase() === "true";
export const USE_WLED: boolean =
  process.env.USE_WLED.toLowerCase() === "true";
