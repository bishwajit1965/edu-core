import { z } from "zod";
import { SUBJECT_STATUS } from "./subjects.constant.js";

const subjectPaperValidationSchema = z.object({
  name: z.string().trim().min(1, "Paper name is required"),
  boardCode: z.string().trim().optional(),
});

const createSubjectValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Subject name is required"),
    code: z
      .string()
      .trim()
      .min(1, "Subject code is required")
      .transform((value) => value.toUpperCase()),
    papers: z.array(subjectPaperValidationSchema).optional(),
    description: z.string().trim().optional(),
    status: z
      .enum(Object.values(SUBJECT_STATUS) as [string, ...string[]])
      .optional(),
  }),
});

const updateSubjectValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    code: z
      .string()
      .trim()
      .min(1)
      .transform((value) => value.toUpperCase())
      .optional(),
    papers: z.array(subjectPaperValidationSchema).optional(),
    description: z.string().trim().optional(),
    status: z
      .enum(Object.values(SUBJECT_STATUS) as [string, ...string[]])
      .optional(),
  }),
});

export const SubjectValidation = {
  createSubjectValidationSchema,
  updateSubjectValidationSchema,
};
