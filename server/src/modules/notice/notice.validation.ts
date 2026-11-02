import { z } from "zod";
import { NOTICE_AUDIENCE, NOTICE_CATEGORY } from "./notice.constant.js";

const noticeTargetSchema = z.object({
  academicSession: z.string().trim().optional(),
  className: z.string().trim().optional(),
  group: z.string().trim().optional(),
  section: z.string().trim().optional(),
});

const mediaReferenceSchema = z
  .object({
    url: z.string().trim().url("Invalid attachment URL."),
    publicId: z.string().trim().min(1, "Public ID is required."),
    resourceType: z.enum(["image", "raw", "video"]),
    format: z.string().trim().optional(),
    bytes: z.number().nonnegative().optional(),
  })
  .strict();

const createNoticeSchema = z.object({
  body: z
    .object({
      title: z.string().trim().min(3).max(200),
      content: z.string().trim().min(1),
      category: z
        .enum(Object.values(NOTICE_CATEGORY) as [string, ...string[]])
        .default(NOTICE_CATEGORY.GENERAL),
      audience: z.enum(Object.values(NOTICE_AUDIENCE) as [string, ...string[]]),
      target: noticeTargetSchema.optional(),
      attachments: z.array(mediaReferenceSchema).default([]),
      expiresAt: z.coerce.date().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        data.audience === NOTICE_AUDIENCE.CLASS &&
        (!data.target?.academicSession || !data.target?.className)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Academic session and class are required for class notices.",
          path: ["target"],
        });
      }
    }),
});

const updateNoticeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid notice ID."),
  }),

  body: z
    .object({
      title: z.string().trim().min(3).max(200).optional(),
      content: z.string().trim().min(1).optional(),
      category: z
        .enum(Object.values(NOTICE_CATEGORY) as [string, ...string[]])
        .optional(),
      audience: z
        .enum(Object.values(NOTICE_AUDIENCE) as [string, ...string[]])
        .optional(),
      target: noticeTargetSchema.optional(),
      attachments: z.array(mediaReferenceSchema).optional(),
      expiresAt: z.coerce.date().optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update.",
    }),
});

const noticeIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid notice ID."),
  }),
});

export const createNoticeValidationSchema = createNoticeSchema;
export const updateNoticeValidationSchema = updateNoticeSchema;
export const noticeIdValidationSchema = noticeIdSchema;
