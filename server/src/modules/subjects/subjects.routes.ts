import express from "express";
import validateRequest from "../../middlewares/validateRequest.js";
import { SubjectControllers } from "./subjects.controller.js";
import { SubjectValidation } from "./subjects.validation.js";

const router = express.Router();

router.post(
  "/",
  validateRequest(SubjectValidation.createSubjectValidationSchema),
  SubjectControllers.createSubject,
);

router.get("/", SubjectControllers.getAllSubjects);

router.get("/:id", SubjectControllers.getSingleSubject);

router.patch(
  "/:id",
  validateRequest(SubjectValidation.updateSubjectValidationSchema),
  SubjectControllers.updateSubject,
);

router.delete("/:id", SubjectControllers.deleteSubject);

export const SubjectRoutes = router;
