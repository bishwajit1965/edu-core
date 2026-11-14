import { z } from "zod";

export const studentLoginValidationSchema = z.object({
  body: z.object({
    studentId: z.string().trim().min(1, "Student ID is required."),
  }),
});

export const studentOTPValidationSchema = z.object({
  body: z.object({
    studentId: z.string().trim().min(1, "Student ID is required."),
    otp: z
      .string()
      .trim()
      .length(6)
      .regex(/^\d{6}$/),
  }),
});
