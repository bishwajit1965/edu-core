import { Router } from "express";
import { InstitutionSettingsController } from "./institution-settings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import validateRequest from "../../middlewares/validateRequest.js";
import {
  createInstitutionSettingsValidationSchema,
  updateInstitutionSettingsValidationSchema,
} from "./institution-settings.validation.js";

const router = Router();

// Public fetchable settings data
router.get(
  "/public",
  InstitutionSettingsController.getPublicInstitutionSettings,
);

// Read settings: authenticated users admin panel
router.get(
  "/",
  authMiddleware,
  InstitutionSettingsController.getInstitutionSettings,
);

// Create Institution Settings
router.post(
  "/",
  authMiddleware,
  validateRequest(createInstitutionSettingsValidationSchema),
  InstitutionSettingsController.createInstitutionSettings,
);

// Update settings: admin only
router.patch(
  "/",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  validateRequest(updateInstitutionSettingsValidationSchema),
  InstitutionSettingsController.updateInstitutionSettings,
);

export default router;
