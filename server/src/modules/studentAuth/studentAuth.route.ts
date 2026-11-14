import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import {
  studentLoginValidationSchema,
  studentOTPValidationSchema,
} from "./studentAuth.validation";

import { StudentAuthController } from "./studentAuth.controller";

const router = express.Router();

router.post(
  "/request-otp",
  validateRequest(studentLoginValidationSchema),
  StudentAuthController.requestStudentOTP,
);

router.post(
  "/verify-otp",
  validateRequest(studentOTPValidationSchema),
  StudentAuthController.verifyStudentOTP,
);

export const StudentAuthRoutes = router;
