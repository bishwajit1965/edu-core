import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface AxiosAuthConfig {
  baseURL?: string;
  refreshEndpoint: string;

  getAccessToken?: () => string | null;

  onRefreshSuccess?: (response: AxiosResponse) => void;

  onRefreshFailure?: () => void;

  excludedRefreshUrls?: string[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export const createAxiosInstance = (
  authConfig: AxiosAuthConfig,
): AxiosInstance => {
  const {
    refreshEndpoint,
    getAccessToken,
    onRefreshSuccess,
    onRefreshFailure,
    excludedRefreshUrls = [],
  } = authConfig;

  const instance = axios.create({
    baseURL: authConfig.baseURL || API_BASE_URL,
    withCredentials: true,
  });

  // Separate client: refresh requests must not
  // trigger this instance's response interceptor.
  const refreshClient = axios.create({
    baseURL: authConfig.baseURL || API_BASE_URL,
    withCredentials: true,
  });

  let isRefreshing = false;

  let failedQueue: {
    resolve: () => void;
    reject: (error: unknown) => void;
  }[] = [];

  const processQueue = (error?: unknown) => {
    failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    failedQueue = [];
  };

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken?.();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as RetryRequestConfig | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        excludedRefreshUrls.some((url) => originalRequest.url?.includes(url)) ||
        originalRequest.url?.includes(refreshEndpoint)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(instance(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await refreshClient.post(refreshEndpoint);

        // Portal-specific token handling.
        onRefreshSuccess?.(response);

        processQueue();

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        try {
          onRefreshFailure?.();
        } catch (callbackError) {
          console.error("Refresh failure callback error:", callbackError);
        }

        return Promise.reject(refreshError);
        // onRefreshFailure?.();

        // return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );

  return instance;
};
