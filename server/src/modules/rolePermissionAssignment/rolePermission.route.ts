import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { RolePermissionController } from "./rolePermission.controller.js";
import { RolePermissionValidation } from "./rolePermission.validation.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import authorize from "../../middlewares/authorize.js";

const router = express.Router();

// Authentication and authorization for all role routes
router.use(authMiddleware, authorize(USER_ROLE.ADMIN));

// Validation middleware
const validateCreateRolePermission = validateRequest(
  RolePermissionValidation.createRolePermissionValidationSchema,
);

const validateUpdateRolePermission = validateRequest(
  RolePermissionValidation.updateRolePermissionStatusValidationSchema,
);

// Assign permission to role
router.post(
  "/",
  validateCreateRolePermission,
  RolePermissionController.createRolePermission,
);

// Get all role-permission assignments
router.get("/", RolePermissionController.getAllRolePermissions);

// Get permissions assigned to a specific role
router.get(
  "/role/:roleId",

  RolePermissionController.getRolePermissions,
);

// Activate / Deactivate assignment
router.patch(
  "/:id/status",
  validateUpdateRolePermission,
  RolePermissionController.updateRolePermissionStatus,
);

// Remove assignment (soft delete)
router.patch(
  "/:id/soft-delete",

  RolePermissionController.softDeleteRolePermission,
);

export const RolePermissionRouter = router;
