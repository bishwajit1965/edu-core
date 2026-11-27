import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const createRolePermissionValidationSchema = z.object({
  body: z.object({
    role: objectIdSchema,
    permission: z.array(objectIdSchema),
  }),
});

const updateRolePermissionStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const RolePermissionValidation = {
  createRolePermissionValidationSchema,
  updateRolePermissionStatusValidationSchema,
};
