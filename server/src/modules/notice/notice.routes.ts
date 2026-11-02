import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorize from "../../middlewares/authorize.js";
import { USER_ROLE } from "../auth/auth.constant.js";
import { NoticeController } from "./notice.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import validateMultipart from "../../middlewares/validateMultipart.js";
import {
  createNoticeValidationSchema,
  updateNoticeValidationSchema,
  noticeIdValidationSchema,
} from "./notice.validation.js";

const router = Router();

// Notice management: Principal (ADMIN) only.
router.use(authMiddleware, authorize(USER_ROLE.ADMIN));

router.post(
  "/",
  validateMultipart(createNoticeValidationSchema),
  NoticeController.createNotice,
);

router.get("/", NoticeController.getAllNotices);

router.get("/:id", NoticeController.getSingleNotice);

router.patch(
  "/:id",
  validateMultipart(updateNoticeValidationSchema),
  NoticeController.updateNotice,
);

router.patch(
  "/:id/publish",
  validateRequest(noticeIdValidationSchema),
  NoticeController.publishNotice,
);

router.patch(
  "/:id/archive",
  validateRequest(noticeIdValidationSchema),
  NoticeController.archiveNotice,
);

router.patch(
  "/:id/withdraw",
  validateRequest(noticeIdValidationSchema),
  NoticeController.withdrawNotice,
);

router.delete(
  "/:id",
  validateRequest(noticeIdValidationSchema),
  NoticeController.deleteNotice,
);

export default router;
