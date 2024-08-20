import { Axios } from "axios";

console.log(import.meta.env.DEV);
console.log(import.meta.env.VITE_ORBITAL_SERVER_URL);

export const axiosInstance = new Axios({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_ORBITAL_SERVER_URL ?? "" : window.location.origin,
  transformRequest: (data) => JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});
