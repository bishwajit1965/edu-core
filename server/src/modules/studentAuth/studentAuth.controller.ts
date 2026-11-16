import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as StudentAuthService from "./studentAuth.service";

// STUDENT COOKIE CONFIGURATION
const isProduction = process.env.NODE_ENV === "production";

const studentCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/api/v1/student-auth",
};

// REQUEST STUDENT OTP
const requestStudentOTP = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.body;

  const result = await StudentAuthService.requestStudentOTPService(studentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

// VERIFY STUDENT OTP AND LOGIN
const verifyStudentOTP = catchAsync(async (req: Request, res: Response) => {
  const { studentId, otp } = req.body;

  const result = await StudentAuthService.verifyStudentOTPService(
    studentId,
    otp,
  );

  const refreshMaxAge =
    Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN) * 1000;

  res.cookie("studentAccessToken", result.accessToken, {
    ...studentCookieOptions,
  });

  res.cookie("studentRefreshToken", result.refreshToken, {
    ...studentCookieOptions,
    maxAge: refreshMaxAge,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student login successful.",
    data: {
      student: result.student,
    },
  });
});

// REFRESH STUDENT TOKENS
const refreshStudentToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.studentRefreshToken;

  const result =
    await StudentAuthService.refreshStudentTokenService(refreshToken);

  const refreshMaxAge =
    Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN) * 1000;

  res.cookie("studentAccessToken", result.accessToken, {
    ...studentCookieOptions,
  });

  res.cookie("studentRefreshToken", result.refreshToken, {
    ...studentCookieOptions,
    maxAge: refreshMaxAge,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student session refreshed successfully.",
    data: null,
  });
});

// GET STUDENT PROFILE
const getStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const studentId =
    typeof req.user === "object" && req.user !== null
      ? (req.user["studentId"] as string | undefined)
      : undefined;

  if (!studentId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Student authentication required.",
      data: null,
    });
  }

  const result = await StudentAuthService.getStudentProfileService(studentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student profile retrieved successfully.",
    data: result,
  });
});

// STUDENT LOGOUT
const logoutStudent = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.studentRefreshToken;

  await StudentAuthService.logoutStudentService(refreshToken);

  res.clearCookie("studentAccessToken", studentCookieOptions);

  res.clearCookie("studentRefreshToken", studentCookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student logged out successfully.",
    data: null,
  });
});

export const StudentAuthController = {
  requestStudentOTP,
  verifyStudentOTP,
  refreshStudentToken,
  getStudentProfile,
  logoutStudent,
};
