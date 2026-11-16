import axiosInstance from "../../../../../lib/axios.js";

// STUDENT OTP REQUEST
export const requestStudentOTP = async (studentId: string) => {
  const response = await axiosInstance.post("/student-auth/request-otp", {
    studentId,
  });

  return response.data;
};

// STUDENT OTP VERIFICATION
export const verifyStudentOTP = async (studentId: string, otp: string) => {
  const response = await axiosInstance.post("/student-auth/verify-otp", {
    studentId,
    otp,
  });

  return response.data;
};

// REFRESH STUDENT SESSION
export const refreshStudentToken = async () => {
  const response = await axiosInstance.post("/student-auth/refresh-token");

  return response.data;
};

// STUDENT PROFILE
export const getStudentMe = async () => {
  const response = await axiosInstance.get("/student-auth/me");

  return response.data;
};

// STUDENT LOGOUT
export const logoutStudent = async () => {
  const response = await axiosInstance.post("/student-auth/logout");

  return response.data;
};
