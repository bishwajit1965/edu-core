import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { NoticeService } from "./notice.service.js";
import { ZipArchive } from "archiver";

const createNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.createNoticeService(
    req.body,
    (req.files ?? []) as Express.Multer.File[],
    typeof req.user === "object" ? req.user?.userId : undefined,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Notice created successfully.",
    data: result,
  });
});

const getAllNotices = catchAsync(async (_req: Request, res: Response) => {
  const result = await NoticeService.getAllNoticesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notices retrieved successfully.",
    data: result,
  });
});

const getAllPublicNotices = catchAsync(async (_req: Request, res: Response) => {
  const result = await NoticeService.getAllPublishedNoticesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Public notices fetched",
    data: result,
  });
});

const getSingleNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getSingleNoticeService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice retrieved successfully.",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.updateNoticeService(
    req.params.id as string,
    req.body,
    (req.files ?? []) as Express.Multer.File[],
    typeof req.user === "object" ? req.user?.userId : undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice updated successfully.",
    data: result,
  });
});

const publishNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.publishNoticeService(
    req.params.id as string,
    typeof req.user === "object" ? req.user?.userId : undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice published successfully.",
    data: result,
  });
});

const archiveNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.archiveNoticeService(
    req.params.id as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice archived successfully.",
    data: result,
  });
});

const withdrawNotice = catchAsync(async (req: Request, res: Response) => {
  const { withdrawalReason } = req.body;

  const result = await NoticeService.withdrawNoticeService(
    req.params.id as string,
    typeof req.user === "object" ? req.user?.userId : undefined,
    withdrawalReason,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice withdrawn successfully.",
    data: result,
  });
});

const downloadAllAttachments = catchAsync(
  async (req: Request, res: Response) => {
    const files =
      await NoticeService.getPublicNoticeAttachmentsForDownloadService(
        req.params.id as string,
      );

    const archive = new ZipArchive({
      zlib: { level: 6 },
    });

    archive.on("error", (error) => {
      res.destroy(error);
    });

    res.setHeader("Content-Type", "application/zip");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="notice-${req.params.id}-attachments.zip"`,
    );

    archive.pipe(res);

    for (const file of files) {
      archive.append(file.buffer, {
        name: file.filename,
      });
    }

    archive.finalize().catch((error) => {
      res.destroy(error);
    });
  },
);

const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.deleteNoticeService(
    req.params.id as string,
    typeof req.user === "object" ? req.user?.userId : undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notice deleted successfully.",
    data: result,
  });
});

export const NoticeController = {
  createNotice,
  getAllNotices,
  getAllPublicNotices,
  getSingleNotice,
  updateNotice,
  publishNotice,
  archiveNotice,
  withdrawNotice,
  downloadAllAttachments,
  deleteNotice,
};
