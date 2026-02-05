import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true,
});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url, // baseURL is automatically prepended
    data: bodyData ?? null,
    headers: headers ?? null,
    params: params ?? null,
  });
};
