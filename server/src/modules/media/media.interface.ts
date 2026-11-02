export type MediaResourceType = "image" | "raw" | "video";
export interface UploadedMedia {
  url: string;
  publicId: string;
  resourceType: MediaResourceType;
  format?: string;
  bytes?: number;
}

export interface UploadMediaOptions {
  folder: string;
  resourceType?: MediaResourceType;
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
}

/**
 * Reference to an uploaded media asset stored by a consuming module.
 * Optional metadata supports backward compatibility.
 */
export interface MediaReference {
  url: string;
  publicId: string;
  resourceType?: MediaResourceType;
  format?: string;
  bytes?: number;
}

/**
 * Server-controlled upload policy for a consuming module.
 * Maps allowed MIME types to Cloudinary resource types.
 */
export interface MediaModuleConfig {
  folder: string;
  allowedMimeTypes: Record<string, MediaResourceType>;
  maxFileSizeBytes: number;
  maxFiles: number;
}
