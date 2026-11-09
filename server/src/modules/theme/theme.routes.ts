import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import { ThemeController } from "./theme.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import validateMultipart from "../../middlewares/validateMultipart.js";

import {
  createThemeValidationSchema,
  updateThemeValidationSchema,
} from "./theme.validation.js";

const router = Router();

// Publicly available themes for institution settings / website.
router.get("/active", ThemeController.getActiveThemes);

router.get("/slug/:slug", ThemeController.getThemeBySlug);

// Theme management: ADMIN only.
router.use(authMiddleware, authorize(USER_ROLE.ADMIN));

router.post(
  "/",
  validateMultipart(createThemeValidationSchema),
  ThemeController.createTheme,
);

router.get("/", ThemeController.getAllThemes);

router.get("/:id", ThemeController.getThemeById);

router.patch(
  "/:id",
  validateMultipart(updateThemeValidationSchema),
  ThemeController.updateTheme,
);

router.patch(
  "/:id/status",
  validateRequest(updateThemeValidationSchema),
  ThemeController.updateThemeStatus,
);

router.delete("/:id", ThemeController.deleteTheme);

export default router;
