import { Student } from "../students/students.model.js";
import { OTP_PURPOSE } from "../otp/otp.constant.js";
import { sendPurposeOTP, verifyPurposeOTP } from "../otp/otp.service.js";
import ApiError from "../../errors/AppError.js";
import createToken from "../../utils/createToken.js";
import { redisClient } from "../../database/redis.js";
import jwt from "jsonwebtoken";

// Request Student Login OTP
export const requestStudentOTPService = async (studentId: string) => {
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

export const verifyStudentOTPService = async (
  studentId: string,
  otp: string,
) => {
  const student = await Student.findOne({
    studentId,
    status: "active",
    isDeleted: false,
  }).select("_id studentId name");

  if (!student) {
    throw new ApiError(401, "Invalid or expired OTP.");
  }

  // Verify OTP using the shared OTP engine
  const result = await verifyPurposeOTP({
    purpose: OTP_PURPOSE.STUDENT_LOGIN,
    identity: student.studentId,
    otp,
  });

  if (!result.success) {
    throw new ApiError(401, result.message);
  }

  // Student JWT payload
  const jwtPayload = {
    studentId: student._id.toString(),
    admissionId: student.studentId,
    name: student.name,
    role: "STUDENT",
  };

  // Generate access token
  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  // Generate refresh token
  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  // Store refresh token in a separate Student namespace
  await redisClient.set(
    `student:refresh:${student._id.toString()}`,
    refreshToken,
    {
      EX: Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN),
    },
  );

  return {
    student,
    accessToken,
    refreshToken,
  };
};

// Refresh Student Access Token
export const refreshStudentTokenService = async (token: string) => {
  if (!token) {
    throw new ApiError(401, "Unauthorized! Refresh token is required.");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
  ) as jwt.JwtPayload & {
    studentId: string;
    admissionId: string;
    name: string;
    role: string;
  };

  if (decoded.role !== "STUDENT" || !decoded.studentId) {
    throw new ApiError(401, "Invalid student refresh token.");
  }

  const storedRefreshToken = await redisClient.get(
    `student:refresh:${decoded.studentId}`,
  );

  if (!storedRefreshToken || storedRefreshToken !== token) {
    throw new ApiError(401, "Invalid refresh token.");
  }

  // Confirm the student is still active
  const student = await Student.findOne({
    _id: decoded.studentId,
    status: "active",
    isDeleted: false,
  }).select("_id studentId name");

  if (!student) {
    await redisClient.del(`student:refresh:${decoded.studentId}`);
    throw new ApiError(401, "Student account is unavailable.");
  }

  const jwtPayload = {
    studentId: student._id.toString(),
    admissionId: student.studentId,
    name: student.name,
    role: "STUDENT",
  };

  const accessToken = createToken(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  const refreshToken = createToken(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    process.env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  );

  await redisClient.set(
    `student:refresh:${student._id.toString()}`,
    refreshToken,
    {
      EX: Number(process.env.REDIS_REFRESH_TOKEN_EXPIRES_IN),
    },
  );

  return { accessToken, refreshToken };
};

// GET AUTHENTICATED STUDENT PROFILE
export const getStudentProfileService = async (studentId: string) => {
  const student = await Student.findOne({
    _id: studentId,
    status: "active",
    isDeleted: false,
  }).select("-yearlyFamilyIncome");

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  return student;
};

// STUDENT LOGOUT
export const logoutStudentService = async (refreshToken?: string) => {
  if (!refreshToken) return null;

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
      { ignoreExpiration: true },
    ) as jwt.JwtPayload;

    if (decoded.role !== "STUDENT" || !decoded.studentId) {
      return null;
    }

    const redisKey = `student:refresh:${decoded.studentId}`;

    const storedToken = await redisClient.get(redisKey);

    // Delete only if this exact token belongs to the session.
    if (storedToken === refreshToken) {
      await redisClient.del(redisKey);
    }
  } catch {
    // Invalid token: nothing to revoke.
  }

  return null;
};

export const StudentAuthService = {
  requestStudentOTPService,
  verifyStudentOTPService,
  refreshStudentTokenService,
  getStudentProfileService,
  logoutStudentService,
};
