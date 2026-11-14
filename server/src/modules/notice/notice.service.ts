import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { Notice } from "./notice.model.js";
import type { INotice } from "./notice.interface.js";
import { NOTICE_STATUS } from "./notice.constant.js";
import type {
  MediaReference,
  UploadedMedia,
} from "../media/media.interface.js";
import {
  getMediaModuleConfig,
  uploadMedia,
  deleteMedia,
  replaceMedia,
} from "../media/index.js";

const createNoticeService = async (
  payload: Partial<INotice>,
  files: Express.Multer.File[] = [],
  createdBy?: string,
) => {
  const mediaConfig = getMediaModuleConfig("notices");

  if (!mediaConfig) {
    throw new AppError(500, "Notice media configuration not found.");
  }

  if (!createdBy) {
    throw new AppError(
      401,
      "Authenticated user is required to create a notice.",
    );
  }

  if (files.length > mediaConfig.maxFiles) {
    throw new AppError(400, "Too many attachment files.");
  }

  const uploadedMedia: UploadedMedia[] = [];

  try {
    for (const file of files) {
      const resourceType = mediaConfig.allowedMimeTypes[file.mimetype];

      if (!resourceType) {
        throw new AppError(400, `File type ${file.mimetype} is not allowed.`);
      }

      const media = await uploadMedia(file, {
        folder: mediaConfig.folder,
        resourceType,
        allowedMimeTypes: [file.mimetype],
        maxFileSizeBytes: mediaConfig.maxFileSizeBytes,
      });

      uploadedMedia.push(media);
    }

    const notice = await Notice.create({
      ...payload,
      attachments: uploadedMedia,
      createdBy,
      status: NOTICE_STATUS.DRAFT,
    });

    return notice;
  } catch (error) {
    const cleanupResults = await Promise.allSettled(
      uploadedMedia.map((media) =>
        deleteMedia(media.publicId, media.resourceType),
      ),
    );

    cleanupResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Failed to clean up uploaded Notice media:",
          result.reason,
        );
      }
    });

    throw error;
  }
};

const getAllNoticesService = async () => {
  const notices = await Notice.find({ isDeleted: false }).sort({
    createdAt: -1,
  });

  return notices;
};

// Fetching notices for public view
const getAllPublishedNoticesService = async () => {
  const notices = await Notice.find({
    status: "PUBLISHED",
    isDeleted: false,
    withdrawnAt: null,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  }).sort({ publishedAt: -1 });
  return notices;
};

const getSingleNoticeService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email")
    .populate("approvedBy", "name email")
    .populate("withdrawnBy", "name email")
    .populate("deletedBy", "name email");

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  return notice;
};

const updateNoticeService = async (
  id: string,
  payload: Partial<INotice>,
  files: Express.Multer.File[] = [],
  updatedBy?: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  if (notice.status === NOTICE_STATUS.PUBLISHED) {
    throw new AppError(
      400,
      "Published notices cannot be edited through this operation.",
    );
  }

  const mediaConfig = getMediaModuleConfig("notices");

  if (!mediaConfig) {
    throw new AppError(500, "Notice media configuration not found.");
  }

  if (files.length > mediaConfig.maxFiles) {
    throw new AppError(400, "Too many attachment files.");
  }

  const oldAttachments: MediaReference[] = notice.attachments.map(
    (attachment) => {
      if (attachment.resourceType === undefined) {
        throw new AppError(500, "Existing notice attachment is invalid.");
      }

      const mediaReference: MediaReference = {
        url: attachment.url,
        publicId: attachment.publicId,
        resourceType: attachment.resourceType,
      };

      if (attachment.format !== undefined) {
        mediaReference.format = attachment.format;
      }

      if (attachment.bytes !== undefined) {
        mediaReference.bytes = attachment.bytes;
      }

      return mediaReference;
    },
  );

  const {
    status,
    createdBy,
    updatedBy: _updatedBy,
    approvedBy,
    approvedAt,
    attachments,
    ...updates
  } = payload;

  const uploadedMedia: UploadedMedia[] = [];

  try {
    // Upload newly submitted files.
    for (const file of files) {
      const resourceType = mediaConfig.allowedMimeTypes[file.mimetype];

      if (!resourceType) {
        throw new AppError(400, `File type ${file.mimetype} is not allowed.`);
      }

      const media = await uploadMedia(file, {
        folder: mediaConfig.folder,
        resourceType,
        allowedMimeTypes: [file.mimetype],
        maxFileSizeBytes: mediaConfig.maxFileSizeBytes,
      });

      uploadedMedia.push(media);
    }

    // Omitted attachments = retain existing references.
    // Supplied attachments = use the supplied references.
    const retainedAttachments =
      attachments !== undefined
        ? attachments
        : files.length > 0
          ? []
          : oldAttachments;

    // Newly uploaded files are appended to the retained references.
    const finalAttachments: MediaReference[] = [
      ...retainedAttachments,
      ...uploadedMedia,
    ];

    Object.assign(notice, updates);

    notice.attachments = finalAttachments;

    if (updatedBy !== undefined) {
      notice.updatedBy = updatedBy;
    }

    await notice.save();

    // Delete old assets only after the database update succeeds.
    await replaceMedia(oldAttachments, finalAttachments);

    return notice;
  } catch (error) {
    // Roll back newly uploaded files if the update fails.
    const cleanupResults = await Promise.allSettled(
      uploadedMedia.map((media) =>
        deleteMedia(media.publicId, media.resourceType),
      ),
    );

    cleanupResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Failed to clean up newly uploaded Notice media:",
          result.reason,
        );
      }
    });

    throw error;
  }
};

const publishNoticeService = async (id: string, approvedBy: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  if (
    notice.status !== NOTICE_STATUS.DRAFT &&
    notice.status !== NOTICE_STATUS.APPROVED &&
    notice.status !== NOTICE_STATUS.WITHDRAWN
  ) {
    throw new AppError(400, "This notice cannot be published.");
  }

  notice.status = NOTICE_STATUS.PUBLISHED;
  notice.approvedBy = approvedBy;
  notice.approvedAt = new Date();
  notice.publishedAt = new Date();
  await notice.save();

  return notice;
};

const archiveNoticeService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  notice.status = NOTICE_STATUS.ARCHIVED;
  await notice.save();

  return notice;
};

const withdrawNoticeService = async (
  id: string,
  withdrawnBy: string,
  withdrawalReason: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  if (!withdrawalReason?.trim()) {
    throw new AppError(400, "Withdrawal reason is required.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  if (notice.status !== NOTICE_STATUS.PUBLISHED) {
    throw new AppError(400, "Only published notices can be withdrawn.");
  }

  notice.status = NOTICE_STATUS.WITHDRAWN;
  notice.withdrawnAt = new Date();
  notice.withdrawnBy = withdrawnBy;
  notice.withdrawalReason = withdrawalReason.trim();

  await notice.save();

  return notice;
};

const getPublicNoticeAttachmentsForDownloadService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    status: NOTICE_STATUS.PUBLISHED,
    isDeleted: false,
    withdrawnAt: null,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  }).select("attachments");

  if (!notice) {
    throw new AppError(404, "Public notice not found.");
  }

  if (!notice.attachments.length) {
    throw new AppError(404, "This notice has no attachments.");
  }

  const mediaConfig = getMediaModuleConfig("notices");

  if (!mediaConfig) {
    throw new AppError(500, "Notice media configuration not found.");
  }

  const usedFilenames = new Set<string>();

  const files: { filename: string; buffer: Buffer }[] = [];

  for (const attachment of notice.attachments) {
    const url = new URL(attachment.url);

    // Only download assets from our Cloudinary delivery domain.
    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      throw new AppError(400, "Invalid attachment URL.");
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new AppError(502, "Unable to retrieve a notice attachment.");
    }

    const contentLength = Number(response.headers.get("content-length"));

    if (
      Number.isFinite(contentLength) &&
      contentLength > mediaConfig.maxFileSizeBytes
    ) {
      throw new AppError(413, "Attachment exceeds the allowed size.");
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length > mediaConfig.maxFileSizeBytes) {
      throw new AppError(413, "Attachment exceeds the allowed size.");
    }

    const publicIdFilename =
      attachment.publicId.split("/").pop() || "attachment";

    const filename = /\.[a-z0-9]{1,10}$/i.test(publicIdFilename)
      ? publicIdFilename
      : attachment.format
        ? `${publicIdFilename}.${attachment.format}`
        : publicIdFilename;

    // Prevent duplicate filenames inside the ZIP.
    const lastDot = filename.lastIndexOf(".");
    const hasExtension = lastDot > 0;

    const baseName = hasExtension ? filename.slice(0, lastDot) : filename;

    const extension = hasExtension ? filename.slice(lastDot) : "";

    let uniqueFilename = filename;
    let counter = 2;

    while (usedFilenames.has(uniqueFilename.toLowerCase())) {
      uniqueFilename = `${baseName}-${counter}${extension}`;
      counter++;
    }

    usedFilenames.add(uniqueFilename.toLowerCase());

    files.push({
      filename: uniqueFilename,
      buffer,
    });
  }

  return files;
};

const deleteNoticeService = async (id: string, deletedBy: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid notice ID.");
  }

  const notice = await Notice.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!notice) {
    throw new AppError(404, "Notice not found.");
  }

  notice.isDeleted = true;
  notice.deletedAt = new Date();
  notice.deletedBy = deletedBy;

  await notice.save();

  return notice;
};

export const NoticeService = {
  createNoticeService,
  getAllNoticesService,
  getAllPublishedNoticesService,
  getSingleNoticeService,
  updateNoticeService,
  publishNoticeService,
  archiveNoticeService,
  withdrawNoticeService,
  getPublicNoticeAttachmentsForDownloadService,
  deleteNoticeService,
};
