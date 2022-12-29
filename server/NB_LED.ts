import axios from "axios";
import { env } from "process";

export let NB_LED: number = null;

export async function fetchNB_LED(): Promise<void> {
  const res = await axios.get(
    `http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_PORT}/config`
  );
  NB_LED = parseInt(res.data.NB_LED);

  if (typeof NB_LED !== "number" || isNaN(NB_LED)) {
    throw new Error(
      `NB_LED fetched from http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_PORT}/config is not a number`
    );
  }
}
