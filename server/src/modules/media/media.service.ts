import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../configs/cloudinary.js";
import type { UploadedMedia, UploadMediaOptions } from "./media.interface.js";
import { fileTypeFromBuffer } from "file-type";

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const uploadMedia = async (
  file: Express.Multer.File,
  options: UploadMediaOptions,
): Promise<UploadedMedia> => {
  const {
    folder,
    resourceType = "image",
    allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"],
    maxFileSizeBytes = DEFAULT_MAX_FILE_SIZE,
  } = options;

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("Uploaded file is empty.");
  }

  if (file.size > maxFileSizeBytes) {
    throw new Error("File size exceeds the allowed limit.");
  }

  const detectedType = await fileTypeFromBuffer(file.buffer);

  if (
    !detectedType ||
    !allowedMimeTypes.includes(detectedType.mime) ||
    detectedType.mime !== file.mimetype
  ) {
    throw new Error("Unsupported or invalid file content.");
  }

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, uploadedFile) => {
        if (error) {
          reject(error);
          return;
        }

        if (!uploadedFile) {
          reject(new Error("Cloudinary upload returned no result."));
          return;
        }

        resolve(uploadedFile);
      },
    );

    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType,
    format: result.format,
    bytes: result.bytes,
  };
};

export const deleteMedia = async (
  publicId: string,
  resourceType: UploadedMedia["resourceType"] = "image",
): Promise<void> => {
  if (!publicId.trim()) {
    throw new Error("A valid Cloudinary public ID is required.");
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary asset deletion failed: ${result.result}`);
  }
};
