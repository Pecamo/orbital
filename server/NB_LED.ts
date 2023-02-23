import axios from "axios";
import * as env from "./env";

export let NB_LED: number = null;

export async function fetchNB_LED(): Promise<void> {
  const endpoint = env.USE_WLED ? 'json' : 'config';
  const res = await axios.get(
    `http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_INFO_PORT}/${endpoint}`
  );
  NB_LED = env.USE_WLED ? parseInt(res.data.info.leds.count) : parseInt(res.data.NB_LED);

  if (typeof NB_LED !== "number" || isNaN(NB_LED)) {
    throw new Error(
      `NB_LED fetched from http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_INFO_PORT}/${endpoint} is not a number`
    );
  }
}
