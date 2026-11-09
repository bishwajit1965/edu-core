import { Schema, model } from "mongoose";
import { ITheme, ThemeModel } from "./theme.interface.js";

import {
  THEME_DEFAULTS,
  THEME_FOOTER_LAYOUT,
  THEME_HEADER_LAYOUT,
  THEME_HERO_LAYOUT,
  THEME_SLIDER_DEFAULTS,
} from "./theme.constant.js";

const themePreviewSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    resourceType: { type: String, default: "image" },
    format: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const themeImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      enum: ["image"],
      default: "image",
    },
    format: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const themeSlideSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    image: { type: themeImageSchema, required: true },
    primaryButtonText: { type: String, default: "", trim: true },
    primaryButtonLink: { type: String, default: "", trim: true },
    secondaryButtonText: { type: String, default: "", trim: true },
    secondaryButtonLink: { type: String, default: "", trim: true },
    order: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const themeSliderSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: THEME_SLIDER_DEFAULTS.ENABLED,
    },
    autoplay: {
      type: Boolean,
      default: THEME_SLIDER_DEFAULTS.AUTOPLAY,
    },
    interval: {
      type: Number,
      min: 1000,
      default: THEME_SLIDER_DEFAULTS.INTERVAL,
    },
    slides: {
      type: [themeSlideSchema],
      default: [],
      validate: {
        validator: (slides: unknown[]) =>
          slides.length <= THEME_SLIDER_DEFAULTS.MAX_SLIDES,
        message: `A theme can have at most ${THEME_SLIDER_DEFAULTS.MAX_SLIDES} slides.`,
      },
    },
  },
  { _id: false },
);

const themeColorsSchema = new Schema(
  {
    primary: { type: String, required: true, trim: true },
    secondary: { type: String, required: true, trim: true },
    accent: { type: String, required: true, trim: true },
    background: { type: String, required: true, trim: true },
    surface: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    muted: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const themeTypographySchema = new Schema(
  {
    headingFont: { type: String, required: true, trim: true },
    bodyFont: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const themeHeaderSchema = new Schema(
  {
    layout: {
      type: String,
      enum: Object.values(THEME_HEADER_LAYOUT),
      default: THEME_HEADER_LAYOUT.CLASSIC,
    },
    sticky: { type: Boolean, default: true },
    showTopBar: { type: Boolean, default: true },
    showLogo: { type: Boolean, default: true },
    showInstitutionName: { type: Boolean, default: true },
  },
  { _id: false },
);

const themeHeroSchema = new Schema(
  {
    layout: {
      type: String,
      enum: Object.values(THEME_HERO_LAYOUT),
      default: THEME_HERO_LAYOUT.SLIDER,
    },
    showHero: { type: Boolean, default: true },
    showSubtitle: { type: Boolean, default: true },
    showPrimaryButton: { type: Boolean, default: true },
    showSecondaryButton: { type: Boolean, default: true },
  },
  { _id: false },
);

const themeSectionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
    layout: { type: String, required: true, trim: true },
    order: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const themeFooterSchema = new Schema(
  {
    layout: {
      type: String,
      enum: Object.values(THEME_FOOTER_LAYOUT),
      default: THEME_FOOTER_LAYOUT.COLUMNS,
    },
    showLogo: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
    showQuickLinks: { type: Boolean, default: true },
  },
  { _id: false },
);

const themeLayoutSchema = new Schema(
  {
    maxWidth: { type: String, default: "1280px", trim: true },
    header: { type: themeHeaderSchema, required: true },
    hero: { type: themeHeroSchema, required: true },
    slider: { type: themeSliderSchema, required: true },
    sections: { type: [themeSectionSchema], default: [] },
    footer: { type: themeFooterSchema, required: true },
  },
  { _id: false },
);

const themeConfigSchema = new Schema(
  {
    colors: { type: themeColorsSchema, required: true },
    typography: { type: themeTypographySchema, required: true },
    layout: { type: themeLayoutSchema, required: true },
  },
  { _id: false },
);

const themeSchema = new Schema<ITheme, ThemeModel>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: { type: String, default: "", trim: true },
    preview: { type: themePreviewSchema, required: true },
    config: { type: themeConfigSchema, required: true },
    isActive: {
      type: Boolean,
      default: THEME_DEFAULTS.IS_ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: THEME_DEFAULTS.IS_DELETED,
    },
  },
  { timestamps: true },
);

themeSchema.index({ isActive: 1, isDeleted: 1 });
themeSchema.index({ name: 1 });

export const Theme = model<ITheme, ThemeModel>("Theme", themeSchema);
