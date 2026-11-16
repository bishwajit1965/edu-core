import express from "express";
import studentAuthMiddleware from "./studentAuth.middleware.js";
import validateRequest from "../../middlewares/validateRequest";
import {
  studentLoginValidationSchema,
  studentOTPValidationSchema,
} from "./studentAuth.validation";
import { StudentAuthController } from "./studentAuth.controller";

const router = express.Router();

// GENERATE OTP
router.post(
  "/request-otp",
  validateRequest(studentLoginValidationSchema),
  StudentAuthController.requestStudentOTP,
);

// VERIFY OTP
router.post(
  "/verify-otp",
  validateRequest(studentOTPValidationSchema),
  StudentAuthController.verifyStudentOTP,
);

// REFRESH TOKEN
router.post("/refresh-token", StudentAuthController.refreshStudentToken);

// PROTECTED ROUTES
router.get(
  "/me",
  studentAuthMiddleware,
  StudentAuthController.getStudentProfile,
);

// LOG OUT
router.post("/logout", StudentAuthController.logoutStudent);

export const StudentAuthRoutes = router;
