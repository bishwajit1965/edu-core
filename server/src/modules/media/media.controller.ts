import type { Request, Response, NextFunction } from "express";
import { fileTypeFromBuffer } from "file-type";
import { getMediaModuleConfig } from "./media.config.js";
import { uploadMedia, deleteMedia } from "./media.service.js";

export const uploadModuleMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const uploadedFiles: Awaited<ReturnType<typeof uploadMedia>>[] = [];

  try {
    const { moduleName } = req.params;
    const config =
      typeof moduleName === "string"
        ? getMediaModuleConfig(moduleName)
        : undefined;

    if (!config) {
      res.status(400).json({
        success: false,
        message: "Unsupported media module.",
      });
      return;
    }

    const files = req.files;

    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "Please provide at least one file.",
      });
      return;
    }

    if (files.length > config.maxFiles) {
      res.status(400).json({
        success: false,
        message: `Maximum ${config.maxFiles} files are allowed.`,
      });
      return;
    }

    // Validate every file before uploading any file.
    const validatedFiles: {
      file: Express.Multer.File;
      mimeType: string;
      resourceType: "image" | "raw";
    }[] = [];

    for (const file of files) {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error("An uploaded file is empty.");
      }

      if (file.size > config.maxFileSizeBytes) {
        throw new Error(
          `File "${file.originalname}" exceeds the allowed size limit.`,
        );
      }

      const detectedType = await fileTypeFromBuffer(file.buffer);

      if (
        !detectedType ||
        detectedType.mime !== file.mimetype ||
        !Object.prototype.hasOwnProperty.call(
          config.allowedMimeTypes,
          detectedType.mime,
        )
      ) {
        throw new Error(
          `File "${file.originalname}" has an unsupported or invalid file type.`,
        );
      }

      const resourceType = config.allowedMimeTypes[detectedType.mime];

      if (resourceType !== "image" && resourceType !== "raw") {
        throw new Error("Unsupported Cloudinary resource type.");
      }

      validatedFiles.push({
        file,
        mimeType: detectedType.mime,
        resourceType,
      });
    }

    // Upload files using server-controlled configuration.
    for (const item of validatedFiles) {
      const uploaded = await uploadMedia(item.file, {
        folder: config.folder,
        resourceType: item.resourceType,
        allowedMimeTypes: [item.mimeType],
        maxFileSizeBytes: config.maxFileSizeBytes,
      });

      uploadedFiles.push(uploaded);
    }

    res.status(201).json({
      success: true,
      message: "Media uploaded successfully.",
      data: uploadedFiles,
    });
  } catch (error) {
    // Roll back only assets created by this request.
    await Promise.allSettled(
      uploadedFiles.map((media) =>
        deleteMedia(media.publicId, media.resourceType),
      ),
    );

    next(error);
  }
};
