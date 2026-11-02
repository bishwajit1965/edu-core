import routes from "./media.routes.js";

export { default as upload } from "./media.middleware.js";

export {
  uploadMedia,
  deleteMedia,
  replaceMedia,
  deleteRecordMedia,
} from "./media.service.js";

export { MEDIA_MODULES, getMediaModuleConfig } from "./media.config.js";

export type {
  UploadedMedia,
  UploadMediaOptions,
  MediaReference,
  MediaResourceType,
  MediaModuleConfig,
} from "./media.interface.js";

export type { MediaModule } from "./media.config.js";

export default routes;
