import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../../configs/cloudinary.js";
import type {
  UploadedMedia,
  UploadMediaOptions,
  MediaReference,
} from "./media.interface.js";
import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "node:crypto";

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// Helper type to normalize media input to an array of MediaReference
type MediaInput = MediaReference | MediaReference[] | undefined | null;

const normalizeMedia = (media: MediaInput): MediaReference[] => {
  if (!media) return [];

  return Array.isArray(media) ? media : [media];
};

// Function to replace media assets, deleting old ones not referenced by the updated record.
export const replaceMedia = async (
  oldMedia: MediaInput,
  newMedia: MediaInput,
): Promise<void> => {
  const oldItems = normalizeMedia(oldMedia);
  const newItems = normalizeMedia(newMedia);

  // Preserve assets still referenced by the updated record.
  const newPublicIds = new Set(newItems.map((item) => item.publicId));

  const mediaToDelete = oldItems.filter(
    (item) => !newPublicIds.has(item.publicId),
  );

  // Avoid duplicate deletion attempts.
  const uniqueMedia = new Map<string, MediaReference>();

  for (const item of mediaToDelete) {
    if (!item.resourceType) {
      throw new Error(
        `Cannot safely delete media "${item.publicId}": resource type is missing.`,
      );
    }

    const key = `${item.resourceType}:${item.publicId}`;

    uniqueMedia.set(key, item);
  }

  await Promise.all(
    Array.from(uniqueMedia.values()).map((item) =>
      deleteMedia(item.publicId, item.resourceType!),
    ),
  );
};

export const deleteRecordMedia = async (media: MediaInput): Promise<void> => {
  const items = normalizeMedia(media);

  const uniqueMedia = new Map<string, MediaReference>();

  for (const item of items) {
    if (!item.resourceType) {
      throw new Error(
        `Cannot safely delete media "${item.publicId}": resource type is missing.`,
      );
    }

    const key = `${item.resourceType}:${item.publicId}`;

    uniqueMedia.set(key, item);
  }

  await Promise.all(
    Array.from(uniqueMedia.values()).map((item) =>
      deleteMedia(item.publicId, item.resourceType!),
    ),
  );
};

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
        // Raw files must include their extension in public_id.
        ...(resourceType === "raw" && {
          public_id: `${randomUUID()}.${detectedType.ext}`,
        }),
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
