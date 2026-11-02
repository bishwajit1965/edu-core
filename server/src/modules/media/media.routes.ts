import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import upload from "./media.middleware.js";
import { uploadModuleMedia } from "./media.controller.js";

const router = Router();

router.post(
  "/upload/:moduleName",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  upload.array("files", 10),
  uploadModuleMedia,
);

export default router;
