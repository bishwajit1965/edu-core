import mongoose from "mongoose";
import AppError from "../../errors/AppError.js";
import { Theme } from "./theme.model.js";
import type { ITheme, IThemeImage } from "./theme.interface.js";
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

const getThemeMediaConfig = () => {
  const config = getMediaModuleConfig("themes");

  if (!config) {
    throw new AppError(500, "Theme media configuration not found");
  }

  return config;
};

const validateThemeImage = (file: Express.Multer.File) => {
  const config = getThemeMediaConfig();

  if (!config.allowedMimeTypes[file.mimetype]) {
    throw new AppError(400, "Unsupported theme image format");
  }

  if (file.size > config.maxFileSizeBytes) {
    throw new AppError(400, "Theme image exceeds the maximum file size");
  }

  return config;
};

const uploadThemeImage = async (
  file: Express.Multer.File,
): Promise<UploadedMedia> => {
  const config = validateThemeImage(file);

  const resourceType = config.allowedMimeTypes[file.mimetype];

  if (resourceType !== "image") {
    throw new AppError(400, "Only image files are allowed for themes");
  }

  return uploadMedia(file, {
    folder: config.folder,
    resourceType,
    allowedMimeTypes: [file.mimetype],
    maxFileSizeBytes: config.maxFileSizeBytes,
  });
};

const toThemeImage = (media: UploadedMedia, alt = ""): IThemeImage => ({
  url: media.url,
  publicId: media.publicId,
  resourceType: "image",
  format: media.format ?? "",
  alt,
});

const cleanupUploadedMedia = async (media: UploadedMedia[]): Promise<void> => {
  const results = await Promise.allSettled(
    media.map((item) => deleteMedia(item.publicId, item.resourceType)),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Failed to clean up uploaded theme media:", result.reason);
    }
  });
};

const collectThemeImages = (theme: ITheme): MediaReference[] => {
  const references: MediaReference[] = [];

  if (theme.preview?.publicId) {
    references.push({
      url: theme.preview.url,
      publicId: theme.preview.publicId,
      resourceType: "image",
      format: theme.preview.format,
    });
  }

  theme.config.layout.slider.slides.forEach((slide) => {
    if (slide.image?.publicId) {
      references.push({
        url: slide.image.url,
        publicId: slide.image.publicId,
        resourceType: "image",
        format: slide.image.format,
      });
    }
  });

  return references;
};

// CREATE THEME
const createThemeService = async (
  payload: Partial<ITheme>,
  previewFile?: Express.Multer.File,
  slideFiles: Express.Multer.File[] = [],
) => {
  const uploadedMedia: UploadedMedia[] = [];

  try {
    const existingTheme = payload.slug
      ? await Theme.findOne({
          slug: payload.slug,
          isDeleted: false,
        })
      : null;

    if (existingTheme) {
      throw new AppError(409, "A theme with this slug already exists");
    }

    if (previewFile) {
      const preview = await uploadThemeImage(previewFile);
      uploadedMedia.push(preview);

      payload.preview = {
        url: preview.url,
        publicId: preview.publicId,
        resourceType: preview.resourceType,
        format: preview.format ?? "",
      };
    }

    const slides = payload.config?.layout.slider.slides ?? [];

    if (slideFiles.length > slides.length) {
      throw new AppError(
        400,
        "More slider images were uploaded than configured slides",
      );
    }

    for (let index = 0; index < slideFiles.length; index++) {
      const uploaded = await uploadThemeImage(slideFiles[index]!);
      uploadedMedia.push(uploaded);

      slides[index]!.image = toThemeImage(
        uploaded,
        slides[index]!.image?.alt ?? "",
      );
    }

    if (payload.config?.layout.slider) {
      payload.config.layout.slider.slides = slides;
    }

    const theme = await Theme.create(payload);

    return theme;
  } catch (error) {
    await cleanupUploadedMedia(uploadedMedia);
    throw error;
  }
};

// GET ALL THEMES
const getAllThemesService = async () => {
  return Theme.find({ isDeleted: false }).sort({ createdAt: -1 });
};

// GET ACTIVE THEMES
const getActiveThemesService = async () => {
  return Theme.find({
    isActive: true,
    isDeleted: false,
  }).select("name slug description preview");
};

// GET THEME BY ID
const getThemeByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid theme ID");
  }

  const theme = await Theme.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!theme) {
    throw new AppError(404, "Theme not found");
  }

  return theme;
};

// GET THEME BY SLUG
const getThemeBySlugService = async (slug: string) => {
  const theme = await Theme.findOne({
    slug: slug.toLowerCase().trim(),
    isActive: true,
    isDeleted: false,
  });

  if (!theme) {
    throw new AppError(404, "Theme not found");
  }

  return theme;
};

// UPDATE THEME
const updateThemeService = async (
  id: string,
  payload: Partial<ITheme>,
  previewFile?: Express.Multer.File,
  slideFiles: Express.Multer.File[] = [],
) => {
  const uploadedMedia: UploadedMedia[] = [];

  try {
    const theme = await getThemeByIdService(id);

    if (
      payload.slug &&
      payload.slug !== theme.slug &&
      (await Theme.exists({
        slug: payload.slug,
        isDeleted: false,
        _id: { $ne: id },
      }))
    ) {
      throw new AppError(409, "A theme with this slug already exists");
    }

    const oldMedia = collectThemeImages(theme);

    if (previewFile) {
      const uploaded = await uploadThemeImage(previewFile);
      uploadedMedia.push(uploaded);

      payload.preview = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        format: uploaded.format ?? "",
      };
    }

    if (payload.config) {
      const existingSlides = theme.config.layout.slider.slides;
      const incomingSlides = payload.config.layout.slider.slides;

      if (incomingSlides) {
        if (slideFiles.length > incomingSlides.length) {
          throw new AppError(
            400,
            "More slider images were uploaded than configured slides",
          );
        }

        for (let index = 0; index < slideFiles.length; index++) {
          const slideFile = slideFiles[index];
          if (!slideFile) continue;

          const uploaded = await uploadThemeImage(slideFile);
          uploadedMedia.push(uploaded);

          const incomingSlide = incomingSlides[index];
          if (!incomingSlide) continue;

          incomingSlide.image = toThemeImage(
            uploaded,
            incomingSlide.image?.alt ?? "",
          );
        }

        // Preserve existing images when no replacement is uploaded.
        incomingSlides.forEach((slide, index) => {
          if (!slide.image?.publicId && existingSlides[index]?.image) {
            slide.image = existingSlides[index].image;
          }
        });
      }
    }

    Object.assign(theme, {
      ...payload,
      preview: payload.preview ?? theme.preview,
    });

    if (payload.config) {
      theme.config = payload.config as ITheme["config"];
    }

    const updatedTheme = await theme.save();

    await replaceMedia(oldMedia, collectThemeImages(updatedTheme));

    return updatedTheme;
  } catch (error) {
    await cleanupUploadedMedia(uploadedMedia);
    throw error;
  }
};

// TOGGLE THEME AVAILABILITY (NOT NEEDED - THEME IS SELECTED FROM SETTINGS MODULE)
const updateThemeStatusService = async (id: string, isActive: boolean) => {
  const theme = await getThemeByIdService(id);

  theme.isActive = isActive;

  await theme.save();

  return theme;
};

// SOFT DELETE THEME
const deleteThemeService = async (id: string) => {
  const theme = await getThemeByIdService(id);

  theme.isDeleted = true;

  theme.isActive = false;

  await theme.save();

  return theme;
};

export const ThemeService = {
  createThemeService,
  getAllThemesService,
  getActiveThemesService,
  getThemeByIdService,
  getThemeBySlugService,
  updateThemeService,
  updateThemeStatusService,
  deleteThemeService,
};
