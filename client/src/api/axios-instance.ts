import Axios, { type AxiosRequestConfig } from "axios";

import { useMeStore } from "components/stores/MeStore";

export const axiosInstanceBase = Axios.create({
  baseURL: `${import.meta.env.REACT_APP_API_URL}/api/`,
});

axiosInstanceBase.interceptors.request.use(
  (config) => {
    const token = useMeStore.getState().token;
    const workspace = useMeStore.getState().workspace;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (workspace) {
      config.headers["X-Workspace"] = workspace;
    }

    return config;
  },
  (error) => {
    console.log("Request error", error);
    Promise.reject(error);
  },
);

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstanceBase({
    ...config,
    signal: AbortSignal.timeout(5 * 60_000),
  }).then(({ data }) => data);

  // @ts-ignore
  // controller.abort();

  return promise;
};

export default axiosInstance;
