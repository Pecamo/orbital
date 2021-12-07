import axios from 'axios';
import { env } from 'process';

export let NB_LED: number = null;

export async function fetchNB_LED(): Promise<void> {
    NB_LED = await axios.get(`http://${env.DISPLAY_API_HOSTNAME}:${env.DISPLAY_API_PORT}/config`);
}
