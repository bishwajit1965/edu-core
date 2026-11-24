import { z } from "zod";

const createPermissionValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Permission name is required"),
    key: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z][A-Z0-9_]*$/,
        "Permission key must contain uppercase letters, numbers and underscores",
      ),
    module: z.string().trim().min(1, "Module is required").toUpperCase(),
    description: z.string().trim().optional(),
  }),
});

const updatePermissionValidationSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      module: z.string().trim().min(1).toUpperCase().optional(),
      description: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

const updatePermissionStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const PermissionValidation = {
  createPermissionValidationSchema,
  updatePermissionValidationSchema,
  updatePermissionStatusValidationSchema,
};
