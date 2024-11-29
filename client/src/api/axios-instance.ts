import Axios, { type AxiosRequestConfig } from "axios";

import { useMeStore } from "components/stores/MeStore";

export const axiosInstanceBase = Axios.create({
  baseURL: `${import.meta.env.REACT_APP_API_URL}/api/`,
});

axiosInstanceBase.interceptors.request.use(
  (config) => {
    const token = useMeStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = axiosInstanceBase({
    ...config,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel("Query was cancelled by React Query");
  };

  return promise;
};

export default axiosInstance;
