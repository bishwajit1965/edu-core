import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import validateRequest from "../../middlewares/validateRequest.js";

import { USER_ROLE } from "../auth/auth.constant.js";
import { RoleController } from "./role.controller.js";
import { RoleValidation } from "./role.validation.js";

const router = Router();

// Authentication and authorization for all role routes
router.use(authMiddleware, authorize(USER_ROLE.ADMIN));

// Validation middleware
const validateCreateRole = validateRequest(
  RoleValidation.createRoleValidationSchema,
);

const validateUpdateRole = validateRequest(
  RoleValidation.updateRoleValidationSchema,
);

const validateRoleStatus = validateRequest(
  RoleValidation.updateRoleStatusValidationSchema,
);

// Routes
router.post("/", validateCreateRole, RoleController.createRole);

router.get("/", RoleController.getAllRoles);

router.get("/:id", RoleController.getRoleById);

router.patch("/:id", validateUpdateRole, RoleController.updateRole);

router.patch(
  "/:id/status",
  validateRoleStatus,
  RoleController.updateRoleStatus,
);

router.patch("/:id/soft-delete", RoleController.softDeleteRole);

export const RoleRouter = router;
