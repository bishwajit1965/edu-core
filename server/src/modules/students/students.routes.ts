import { Router } from "express";
import { StudentsController } from "./students.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant";
import { upload } from "../media/index.js";
import {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} from "./students.validation";
import validateStudentMultipart from "../students/multipart-validation.js";

const router = Router();

// Read students: authenticated users
router.get("/", authMiddleware, StudentsController.getAllStudents);

// Read one student: authenticated users
router.get("/:id", authMiddleware, StudentsController.getStudentById);

// Admit a student: admin only
router.post(
  "/",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  upload.any(),
  validateStudentMultipart(createStudentValidationSchema),
  StudentsController.createStudent,
);

router.patch(
  "/:id",
  authMiddleware,
  authorize(USER_ROLE.ADMIN),
  (req, res, next) => {
    if (req.is("multipart/form-data")) {
      upload.any()(req, res, (err) => {
        if (err) return next(err);
        return validateStudentMultipart(updateStudentValidationSchema)(
          req,
          res,
          next,
        );
      });
      return;
    }

    next();
  },
  StudentsController.updateStudent,
);

// Update student: admin only (controller/service to be implemented)
// router.patch(
//   "/:id",
//   authMiddleware,
//   authorize(USER_ROLE.ADMIN),
//   upload.any(),
//   validateStudentMultipart(updateStudentValidationSchema),
//   StudentsController.updateStudent,
// );

export default router;
