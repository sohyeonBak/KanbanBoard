import Axios, { AxiosRequestConfig } from "axios";
// import { API_BASE_URL } from "../../app/config/config"

export const config: AxiosRequestConfig = {
  baseURL: "http://localhost:4001/api",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 60000,
  responseType: 'json',
}

export const axios = Axios.create(config);
