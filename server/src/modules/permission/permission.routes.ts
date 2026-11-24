import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import { PermissionController } from "./permission.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { PermissionValidation } from "./permission.validation.js";

const router = Router();

const adminOnly = [authMiddleware, authorize(USER_ROLE.ADMIN)];

const validateCreatePermission = validateRequest(
  PermissionValidation.createPermissionValidationSchema,
);

const validateUpdatePermission = validateRequest(
  PermissionValidation.updatePermissionValidationSchema,
);

const validatePermissionStatus = validateRequest(
  PermissionValidation.updatePermissionStatusValidationSchema,
);

// Create permission
router.post(
  "/",
  ...adminOnly,
  validateCreatePermission,
  PermissionController.createPermission,
);

// Get all permissions
router.get("/", ...adminOnly, PermissionController.getAllPermissions);

// Get permission by ID
router.get("/:id", ...adminOnly, PermissionController.getPermissionById);

// Update permission
router.patch(
  "/:id",
  ...adminOnly,
  validateUpdatePermission,
  PermissionController.updatePermission,
);

// Activate / Deactivate permission
router.patch(
  "/:id/status",
  ...adminOnly,
  validatePermissionStatus,
  PermissionController.updatePermissionStatus,
);

// Soft delete permission
router.patch(
  "/:id/soft-delete",
  ...adminOnly,
  PermissionController.softDeletePermission,
);

export const PermissionRouter = router;
