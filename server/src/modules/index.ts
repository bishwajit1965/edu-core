import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import InstitutionSettingsRoutes from "./institution-settings";
import StudentRoutes from "./students";
import noticeRoutes from "./notice";
import mediaRoutes from "./media";
import themeRoutes from "./theme";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/institution-settings", InstitutionSettingsRoutes);

router.use("/students", StudentRoutes);

router.use("/notices", noticeRoutes);

// INDEPENDENT MODULES: Media module is independent and can be used by other modules to manage media files upload.
router.use("/media", mediaRoutes);

router.use("/themes", themeRoutes);

export default router;
