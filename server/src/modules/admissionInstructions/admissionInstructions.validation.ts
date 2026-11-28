import { z } from "zod";

const attachmentValidationSchema = z.object({
  name: z.string().trim().min(1, "File name is required"),
  url: z.string().url("Invalid attachment URL"),
  publicId: z.string().min(1, "Cloudinary public ID is required"),
  resourceType: z.enum(["image", "raw", "video"]),
  format: z.string().optional(),
  size: z.number().positive().optional(),
});

const instructionSectionValidationSchema = z.object({
  title: z.string().trim().min(1, "Section title is required"),
  content: z.string().trim().min(1, "Section content is required"),
  attachments: z.array(attachmentValidationSchema).optional(),
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

const faqValidationSchema = z.object({
  question: z.string().trim().min(1, "FAQ question is required"),
  answer: z.string().trim().min(1, "FAQ answer is required"),
  order: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
});

const createAdmissionInstructionsValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),

    academicSession: z.string().trim().min(1, "Academic session is required"),

    introduction: z.string().trim().optional(),

    sections: z.array(instructionSectionValidationSchema).optional(),

    faqs: z.array(faqValidationSchema).optional(),

    attachments: z.array(attachmentValidationSchema).optional(),
  }),
});

const updateAdmissionInstructionsValidationSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      academicSession: z.string().trim().min(1).optional(),
      introduction: z.string().trim().optional(),
      sections: z.array(instructionSectionValidationSchema).optional(),
      faqs: z.array(faqValidationSchema).optional(),
      attachments: z.array(attachmentValidationSchema).optional(),
      isPublished: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

const updateAdmissionInstructionsStatusValidationSchema = z.object({
  body: z.object({
    isPublished: z.boolean(),
  }),
});

export const AdmissionInstructionsValidation = {
  createAdmissionInstructionsValidationSchema,
  updateAdmissionInstructionsValidationSchema,
  updateAdmissionInstructionsStatusValidationSchema,
};
