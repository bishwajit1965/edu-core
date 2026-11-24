import { z } from "zod";

const createRoleValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Role name is required"),

    key: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z][A-Z0-9_]*$/,
        "Role key must contain uppercase letters, numbers and underscores",
      ),

    description: z.string().trim().optional(),
  }),
});

const updateRoleValidationSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required for update",
    }),
});

const updateRoleStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const RoleValidation = {
  createRoleValidationSchema,
  updateRoleValidationSchema,
  updateRoleStatusValidationSchema,
};
