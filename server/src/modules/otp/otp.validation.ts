import { z } from "zod";
import { OTP_CONFIG, OTP_PURPOSE } from "./otp.constant.js";

// Send OTP validation
const sendOTPBodySchema = z.object({
  purpose: z.enum(Object.values(OTP_PURPOSE) as [string, ...string[]]),
  identity: z.string().trim().min(1, "Identity is required."),
  email: z.string().trim().email("A valid email address is required."),
});

// Verify OTP validation
const verifyOTPBodySchema = z.object({
  purpose: z.enum(Object.values(OTP_PURPOSE) as [string, ...string[]]),
  identity: z.string().trim().min(1, "Identity is required."),
  otp: z
    .string()
    .trim()
    .length(
      OTP_CONFIG.LENGTH,
      `OTP must be exactly ${OTP_CONFIG.LENGTH} digits.`,
    )
    .regex(/^\d{6}$/, "OTP must contain only numbers."),
});

// Export validation schemas
export const sendOTPValidationSchema = z.object({
  body: sendOTPBodySchema,
});

export const verifyOTPValidationSchema = z.object({
  body: verifyOTPBodySchema,
});
