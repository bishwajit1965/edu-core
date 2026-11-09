import type { MediaModuleConfig } from "./media.interface.js";

const MB = 1024 * 1024;

export const MEDIA_MODULES = {
  notices: {
    folder: "educore/notices",
    allowedMimeTypes: {
      "image/jpeg": "image",
      "image/png": "image",
      "image/webp": "image",
      "application/pdf": "raw",
    },
    maxFileSizeBytes: 5 * MB,
    maxFiles: 10,
  },

  themes: {
    folder: "educore/themes",
    allowedMimeTypes: {
      "image/jpeg": "image",
      "image/png": "image",
      "image/webp": "image",
      "application/pdf": "raw",
    },
    maxFileSizeBytes: 5 * MB,
    maxFiles: 10,
  },
} satisfies Record<string, MediaModuleConfig>;

export type MediaModule = keyof typeof MEDIA_MODULES;

/**
 * Returns the server-controlled upload configuration.
 * Unknown modules are rejected.
 */
export const getMediaModuleConfig = (
  moduleName: string,
): MediaModuleConfig | undefined => {
  if (!Object.prototype.hasOwnProperty.call(MEDIA_MODULES, moduleName)) {
    return undefined;
  }

  return MEDIA_MODULES[moduleName as MediaModule];
};
