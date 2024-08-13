import { Axios } from "axios";

export const axiosInstance = new Axios({
  baseURL: window.location.href ?? "",
  transformRequest: (data) => JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
});
