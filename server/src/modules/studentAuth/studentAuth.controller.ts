import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import * as StudentAuthService from "./studentAuth.service";

// Request Student OTP
const requestStudentOTP = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentAuthService.requestStudentOTP(req.body.studentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

// Verify Student OTP
const verifyStudentOTP = catchAsync(async (req: Request, res: Response) => {
  const { studentId, otp } = req.body;

  const result = await StudentAuthService.verifyStudentOTP(studentId, otp);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Student OTP verified successfully.",
    data: result,
  });
});

export const StudentAuthController = {
  requestStudentOTP,
  verifyStudentOTP,
};
