import { Student } from "../students/students.model.js";
import { OTP_PURPOSE } from "../otp/otp.constant.js";
import { sendPurposeOTP, verifyPurposeOTP } from "../otp/otp.service.js";
import ApiError from "../../errors/AppError.js";

// Request Student Login OTP
export const requestStudentOTP = async (studentId: string) => {
  const student = await Student.findOne({
    studentId,
    status: "active",
    isDeleted: false,
  }).select("studentId studentEmail");

  // Use a generic response to avoid exposing student existence.
  if (!student || !student.studentEmail) {
    return {
      success: true,
      message:
        "If the student account is eligible, an OTP will be sent to the registered email.",
    };
  }

  const result = await sendPurposeOTP({
    purpose: OTP_PURPOSE.STUDENT_LOGIN,
    identity: student.studentId,
    email: student.studentEmail,
  });

  if (!result.success) {
    throw new ApiError(429, result.message);
  }

  return {
    success: true,
    message:
      "If the student account is eligible, an OTP will be sent to the registered email.",
  };
};

// Verify Student Login OTP
export const verifyStudentOTP = async (studentId: string, otp: string) => {
  const student = await Student.findOne({
    studentId,
    status: "active",
    isDeleted: false,
  }).select("_id studentId");

  if (!student) {
    throw new ApiError(401, "Invalid or expired OTP.");
  }

  const result = await verifyPurposeOTP({
    purpose: OTP_PURPOSE.STUDENT_LOGIN,
    identity: student.studentId,
    otp,
  });

  if (!result.success) {
    throw new ApiError(401, result.message);
  }

  return student;
};
