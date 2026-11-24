import { z } from "zod";

const configuredSubjectValidationSchema = z
  .object({
    subject: z.string().min(1, "Subject ID is required"),

    subjectType: z.enum([
      "COMPULSORY",
      "GROUP_MANDATORY",
      "REQUIRED_SELECTION",
      "CHOICE",
    ]),

    isMainSubjectEligible: z.boolean().default(false),
    isFourthSubjectEligible: z.boolean().default(false),

    selectionGroup: z.string().trim().optional(),
  })
  .superRefine((subject, ctx) => {
    const hasEligibility =
      subject.isMainSubjectEligible || subject.isFourthSubjectEligible;

    if (["COMPULSORY", "GROUP_MANDATORY"].includes(subject.subjectType)) {
      if (hasEligibility || subject.selectionGroup) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Compulsory and group-mandatory subjects cannot have selection options",
          path: ["subjectType"],
        });
      }
    }

    if (
      subject.subjectType === "REQUIRED_SELECTION" &&
      !subject.selectionGroup
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required-selection subjects must belong to a selection group",
        path: ["selectionGroup"],
      });
    }

    if (subject.subjectType === "CHOICE" && !hasEligibility) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "A choice subject must be eligible as a main subject or fourth subject",
        path: ["isMainSubjectEligible"],
      });
    }
  });

const selectionGroupValidationSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Selection group code is required")
      .transform((value) => value.toUpperCase()),

    label: z.string().trim().min(1, "Selection group label is required"),

    minSelections: z.number().int().min(0),

    maxSelections: z.number().int().min(1),
  })
  .refine((group) => group.minSelections <= group.maxSelections, {
    message: "Minimum selections cannot exceed maximum selections",
    path: ["minSelections"],
  });

const createSubjectConfigurationValidationSchema = z.object({
  body: z.object({
    programme: z.string().trim().min(1, "Programme is required"),

    academicSession: z.string().trim().min(1, "Academic session is required"),

    className: z.string().trim().min(1, "Class is required"),

    group: z.string().trim().optional(),

    subjects: z
      .array(configuredSubjectValidationSchema)
      .min(1, "At least one subject is required"),

    selectionGroups: z.array(selectionGroupValidationSchema).default([]),
  }),
});

const updateSubjectConfigurationValidationSchema = z.object({
  body: z.object({
    programme: z.string().trim().min(1).optional(),

    academicSession: z.string().trim().min(1).optional(),

    className: z.string().trim().min(1).optional(),

    group: z.string().trim().optional(),

    subjects: z.array(configuredSubjectValidationSchema).min(1).optional(),

    selectionGroups: z.array(selectionGroupValidationSchema).optional(),
  }),
});

export const SubjectConfigurationValidation = {
  createSubjectConfigurationValidationSchema,
  updateSubjectConfigurationValidationSchema,
};
