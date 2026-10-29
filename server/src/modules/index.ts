import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import InstitutionSettingsRoutes from "./institution-settings";
import StudentRoutes from "./students";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/institution-settings", InstitutionSettingsRoutes);

router.use("/students", StudentRoutes);

export default router;
