import axios from "axios";
import * as env from "./env";

export let NB_LED: number = null;

export async function fetchNB_LED(): Promise<void> {
  const endpoint = env.USE_WLED ? 'json' : 'config';
  try {
    const res = await axios.get(
      `http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_INFO_PORT}/${endpoint}`
    );
    NB_LED = env.USE_WLED ? parseInt(res.data.info.leds.count) : parseInt(res.data.NB_LED);

    if (typeof NB_LED !== "number" || isNaN(NB_LED)) {
      throw new Error(
        `NB_LED fetched from http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_INFO_PORT}/${endpoint} is not a number`
      );
    }
  } catch (e) {
    console.error("Error while fetching NB_LED. Please make sure the display API is running.");
    console.error(e);
    console.log("Falling back to default value");
    NB_LED = 60;
  }
}
