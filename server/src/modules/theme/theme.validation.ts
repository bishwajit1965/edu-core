import { z } from "zod";

import {
  THEME_FOOTER_LAYOUT,
  THEME_HEADER_LAYOUT,
  THEME_HERO_LAYOUT,
  THEME_SLIDER_DEFAULTS,
} from "./theme.constant.js";

const themePreviewValidationSchema = z.object({
  url: z.string().url().optional(),
  publicId: z.string().min(1).optional(),
  resourceType: z.enum(["image", "raw", "video"]).optional(),
  format: z.string().min(1).optional(),
});

const themeImageValidationSchema = z.object({
  url: z.string().url().optional(),
  publicId: z.string().min(1).optional(),
  resourceType: z.literal("image").optional(),
  format: z.string().min(1).optional(),
  alt: z.string().min(1, "Image alt text is required."),
});

const themeSlideValidationSchema = z.object({
  title: z.string().min(1).max(150),
  subtitle: z.string().max(250).default(""),
  description: z.string().max(1000).optional(),
  image: themeImageValidationSchema,
  primaryButtonText: z.string().max(50).optional(),
  primaryButtonLink: z.string().max(500).optional(),
  secondaryButtonText: z.string().max(50).optional(),
  secondaryButtonLink: z.string().max(500).optional(),
  order: z.number().int().min(0),
  isActive: z.boolean().default(true),
});

const themeSliderValidationSchema = z
  .object({
    enabled: z.boolean().default(true),
    autoplay: z.boolean().default(true),
    interval: z.number().int().min(1000).default(5000),
    slides: z
      .array(themeSlideValidationSchema)
      .max(THEME_SLIDER_DEFAULTS.MAX_SLIDES),
  })
  .superRefine((slider, ctx) => {
    if (slider.enabled && slider.slides.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["slides"],
        message: "At least one slide is required when the slider is enabled.",
      });
    }
  });

const themeColorsValidationSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1),
  accent: z.string().min(1),
  background: z.string().min(1),
  surface: z.string().min(1),
  text: z.string().min(1),
  muted: z.string().min(1),
});

const themeTypographyValidationSchema = z.object({
  headingFont: z.string().min(1),
  bodyFont: z.string().min(1),
});

const themeHeaderValidationSchema = z.object({
  layout: z.enum(Object.values(THEME_HEADER_LAYOUT) as [string, ...string[]]),
  sticky: z.boolean(),
  showTopBar: z.boolean(),
  showLogo: z.boolean(),
  showInstitutionName: z.boolean(),
});

const themeHeroValidationSchema = z.object({
  layout: z.enum(Object.values(THEME_HERO_LAYOUT) as [string, ...string[]]),
  showHero: z.boolean(),
  showSubtitle: z.boolean(),
  showPrimaryButton: z.boolean(),
  showSecondaryButton: z.boolean(),
});

const themeSectionValidationSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  enabled: z.boolean(),
  layout: z.string().min(1),
  order: z.number().int().min(0),
});

const themeFooterValidationSchema = z.object({
  layout: z.enum(Object.values(THEME_FOOTER_LAYOUT) as [string, ...string[]]),
  showLogo: z.boolean(),
  showSocialLinks: z.boolean(),
  showContactInfo: z.boolean(),
  showQuickLinks: z.boolean(),
});

const themeLayoutValidationSchema = z.object({
  maxWidth: z.string().min(1),
  header: themeHeaderValidationSchema,
  hero: themeHeroValidationSchema,
  slider: themeSliderValidationSchema,
  sections: z.array(themeSectionValidationSchema),
  footer: themeFooterValidationSchema,
});

const themeConfigValidationSchema = z.object({
  colors: themeColorsValidationSchema,
  typography: themeTypographyValidationSchema,
  layout: themeLayoutValidationSchema,
});

export const createThemeValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers, and hyphens only.",
      ),
    description: z.string().max(1000).optional(),
    preview: themePreviewValidationSchema,
    config: themeConfigValidationSchema,
    isActive: z.boolean().optional(),
  }),
});

export const updateThemeValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      slug: z
        .string()
        .min(2)
        .max(100)
        .regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Slug must contain lowercase letters, numbers, and hyphens only.",
        )
        .optional(),
      description: z.string().max(1000).optional(),
      preview: themePreviewValidationSchema.optional(),
      config: themeConfigValidationSchema.optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field is required for update.",
    ),
});

export const ThemeValidation = {
  createThemeValidationSchema,
  updateThemeValidationSchema,
};
