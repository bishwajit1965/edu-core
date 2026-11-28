import express from "express";
import { AdmissionInstructionsController } from "./admissionInstructions.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { AdmissionInstructionsValidation } from "./admissionInstructions.validation.js";

// Replace these imports with your project's actual auth and permission middleware paths.
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";

const router = express.Router();

const adminOnly = [authMiddleware, authorize(USER_ROLE.ADMIN)];

// Public route
router.get(
  "/public/:academicSession",
  AdmissionInstructionsController.getPublicAdmissionInstructions,
);

// Admin routes
router.post(
  "/",
  ...adminOnly,
  validateRequest(
    AdmissionInstructionsValidation.createAdmissionInstructionsValidationSchema,
  ),
  AdmissionInstructionsController.createAdmissionInstructions,
);

router.get(
  "/",
  ...adminOnly,
  AdmissionInstructionsController.getAllAdmissionInstructions,
);

router.get(
  "/:id",
  ...adminOnly,
  AdmissionInstructionsController.getAdmissionInstructionsById,
);

router.patch(
  "/:id",
  ...adminOnly,
  validateRequest(
    AdmissionInstructionsValidation.updateAdmissionInstructionsValidationSchema,
  ),
  AdmissionInstructionsController.updateAdmissionInstructions,
);

router.patch(
  "/:id/status",
  ...adminOnly,
  validateRequest(
    AdmissionInstructionsValidation.updateAdmissionInstructionsStatusValidationSchema,
  ),
  AdmissionInstructionsController.updateAdmissionInstructionsStatus,
);

router.delete(
  "/:id",
  ...adminOnly,
  AdmissionInstructionsController.softDeleteAdmissionInstructions,
);

router.patch(
  "/:id/restore",
  ...adminOnly,
  validateRequest(
    AdmissionInstructionsValidation.updateAdmissionInstructionsStatusValidationSchema,
  ),
  AdmissionInstructionsController.restoreInstructionService,
);

export const AdmissionInstructionsRoutes = router;
