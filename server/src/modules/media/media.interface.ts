export interface UploadedMedia {
  url: string;
  publicId: string;
  resourceType: "image" | "raw" | "video";
  format?: string;
  bytes?: number;
}

export interface UploadMediaOptions {
  folder: string;
  resourceType?: "image" | "raw" | "video";
  allowedMimeTypes?: string[];
  maxFileSizeBytes?: number;
}

export interface MediaReference {
  url: string;
  publicId: string;
}
