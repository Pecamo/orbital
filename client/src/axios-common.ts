import { Axios } from "axios";

export const axiosInstance = new Axios({
  baseURL: import.meta.env.VITE_ORBITAL_SERVER_BASE_URL ?? "",
  transformRequest: (data) => JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});
