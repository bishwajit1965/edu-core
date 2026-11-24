import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { SubjectConfigurationControllers } from "./subject-configurations.controller.js";
import { SubjectConfigurationValidation } from "./subject-configurations.validation.js";

const router = express.Router();

// Create Subject Configuration
router.post(
  "/",
  validateRequest(
    SubjectConfigurationValidation.createSubjectConfigurationValidationSchema,
  ),
  SubjectConfigurationControllers.createSubjectConfiguration,
);

// Get All Subject Configurations
router.get("/", SubjectConfigurationControllers.getAllSubjectConfigurations);

// Get Single Subject Configuration
router.get(
  "/:id",
  SubjectConfigurationControllers.getSingleSubjectConfiguration,
);

// Update Subject Configuration
router.patch(
  "/:id",
  validateRequest(
    SubjectConfigurationValidation.updateSubjectConfigurationValidationSchema,
  ),
  SubjectConfigurationControllers.updateSubjectConfiguration,
);

// Delete Subject Configuration
router.delete(
  "/:id",
  SubjectConfigurationControllers.deleteSubjectConfiguration,
);

export const SubjectConfigurationRoutes = router;
