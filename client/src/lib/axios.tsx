import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Attach access token to every outgoing request.
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (!config.headers["Content-Type"]) {
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Automatically refresh expired access tokens.
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Queue concurrent requests while refreshing.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response = await axiosInstance.post("/auth/refresh-token");

      const newAccessToken = response.data.data;

      if (!newAccessToken) {
        throw new Error("Access token missing from refresh response");
      }

      setAccessToken(newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      clearAccessToken();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;

// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
//   withCredentials: true,
// });

// let accessToken: string | null = null;

// export const setAccessToken = (token: string | null) => {
//   accessToken = token;
// };

// export const clearAccessToken = () => {
//   accessToken = null;
// };

// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     if (!config.headers["Content-Type"]) {
//       // set Content-type to JSON if not already specified
//       if (config.data instanceof FormData) {
//         delete config.headers["Content-Type"];
//       } else {
//         config.headers["Content-Type"] = "application/json";
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// export default axiosInstance;
