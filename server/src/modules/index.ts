import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import InstitutionSettingsRoutes from "./institution-settings";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/institution-settings", InstitutionSettingsRoutes);

export default router;
