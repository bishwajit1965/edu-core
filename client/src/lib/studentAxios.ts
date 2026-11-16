import { createAxiosInstance } from "./createAxiosInstance";

let handleRefreshFailure: (() => void) | undefined;

export const setStudentAuthFailureHandler = (handler: () => void) => {
  handleRefreshFailure = handler;
};

const studentAxios = createAxiosInstance({
  refreshEndpoint: "/student-auth/refresh-token",

  // Student authentication uses HttpOnly cookies.
  // No JavaScript access-token handling is needed.

  onRefreshFailure: () => {
    handleRefreshFailure?.();
  },

  excludedRefreshUrls: [
    "/student-auth/request-otp",
    "/student-auth/verify-otp",
    "/student-auth/logout",
  ],
});

export default studentAxios;
