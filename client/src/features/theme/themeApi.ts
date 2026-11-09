import axiosInstance from "../../lib/axios.js";

// Constants
export const THEME_HEADER_LAYOUT = {
  CLASSIC: "classic",
  CENTERED: "centered",
  SPLIT: "split",
} as const;

export const THEME_HERO_LAYOUT = {
  CENTERED: "centered",
  LEFT: "left",
  SPLIT: "split",
  SLIDER: "slider",
} as const;

export const THEME_FOOTER_LAYOUT = {
  SIMPLE: "simple",
  COLUMNS: "columns",
  EXTENDED: "extended",
} as const;

export const THEME_SECTION_KEYS = {
  ABOUT: "about",
  NOTICES: "notices",
  EVENTS: "events",
  FACILITIES: "facilities",
  ACADEMIC: "academic",
  TEACHERS: "teachers",
  GALLERY: "gallery",
  TESTIMONIALS: "testimonials",
  CONTACT: "contact",
} as const;

// Types
export type ThemeHeaderLayout =
  (typeof THEME_HEADER_LAYOUT)[keyof typeof THEME_HEADER_LAYOUT];

export type ThemeHeroLayout =
  (typeof THEME_HERO_LAYOUT)[keyof typeof THEME_HERO_LAYOUT];

export type ThemeFooterLayout =
  (typeof THEME_FOOTER_LAYOUT)[keyof typeof THEME_FOOTER_LAYOUT];

export type ThemeSectionKey =
  (typeof THEME_SECTION_KEYS)[keyof typeof THEME_SECTION_KEYS];

export type ThemeSlideInput = Omit<ThemeSlide, "image"> & {
  image: Pick<ThemeImage, "alt">;
};

export type ThemeConfigInput = Omit<ThemeConfig, "layout"> & {
  layout: Omit<ThemeLayout, "slider"> & {
    slider: Omit<ThemeSlider, "slides"> & {
      slides: ThemeSlideInput[];
    };
  };
};

export interface ThemePreview {
  url: string;
  publicId: string;
  resourceType: "image" | "raw" | "video";
  format: string;
}

export interface ThemeImage {
  url: string;
  publicId: string;
  resourceType: "image";
  format: string;
  alt: string;
}

export interface ThemeSlide {
  _id?: string;
  title: string;
  subtitle: string;
  description?: string;
  image: ThemeImage;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ThemeSlider {
  enabled: boolean;
  autoplay: boolean;
  interval: number;
  slides: ThemeSlide[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
}

export interface ThemeHeader {
  layout: ThemeHeaderLayout;
  sticky: boolean;
  showTopBar: boolean;
  image?: ThemeImage;
  showLogo: boolean;
  showInstitutionName: boolean;
}

export interface ThemeHero {
  layout: ThemeHeroLayout;
  showHero: boolean;
  showSubtitle: boolean;
  showPrimaryButton: boolean;
  showSecondaryButton: boolean;
}

export interface ThemeSection {
  key: ThemeSectionKey;
  title: string;
  enabled: boolean;
  layout: string;
  order: number;
}

export interface ThemeFooter {
  layout: ThemeFooterLayout;
  showLogo: boolean;
  showSocialLinks: boolean;
  showContactInfo: boolean;
  showQuickLinks: boolean;
}

export interface ThemeLayout {
  maxWidth: string;
  header: ThemeHeader;
  hero: ThemeHero;
  slider: ThemeSlider;
  sections: ThemeSection[];
  footer: ThemeFooter;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
}

export interface Theme {
  _id: string;
  name: string;
  slug: string;
  description: string;
  preview: ThemePreview;
  config: ThemeConfig;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateThemePayload {
  name: string;
  slug: string;
  description?: string;
  preview?: Partial<ThemePreview>;
  config: ThemeConfigInput;
  isActive?: boolean;
}

export type UpdateThemePayload = Partial<CreateThemePayload>;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// API endpoint
const THEME_ENDPOINT = "/themes";

// Get active themes
export const getActiveThemes = async (): Promise<Theme[]> => {
  const response = await axiosInstance.get<ApiResponse<Theme[]>>(
    `${THEME_ENDPOINT}/active`,
  );

  return response.data.data;
};

// Get all themes
export const getAllThemes = async (): Promise<Theme[]> => {
  const response =
    await axiosInstance.get<ApiResponse<Theme[]>>(THEME_ENDPOINT);

  return response.data.data;
};

// Get single theme
export const getThemeById = async (id: string): Promise<Theme> => {
  const response = await axiosInstance.get<ApiResponse<Theme>>(
    `${THEME_ENDPOINT}/${id}`,
  );

  return response.data.data;
};

// Get theme by slug
export const getThemeBySlug = async (slug: string): Promise<Theme> => {
  const response = await axiosInstance.get<ApiResponse<Theme>>(
    `${THEME_ENDPOINT}/slug/${slug}`,
  );

  return response.data.data;
};

// FORM DATA HELPER
const buildThemeFormData = (
  payload: CreateThemePayload | UpdateThemePayload,
  previewFile?: File,
  slideFiles: File[] = [],
): FormData => {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload));

  if (previewFile) {
    formData.append("preview", previewFile);
  }

  slideFiles.forEach((file, index) => {
    formData.append(`slides[${index}]`, file);
  });

  return formData;
};

// Create theme
export const createTheme = async (
  payload: CreateThemePayload,
  previewFile?: File,
  slideFiles: File[] = [],
): Promise<Theme> => {
  const hasFiles = Boolean(previewFile) || slideFiles.length > 0;

  const response = await axiosInstance.post<ApiResponse<Theme>>(
    THEME_ENDPOINT,
    hasFiles ? buildThemeFormData(payload, previewFile, slideFiles) : payload,
  );

  return response.data.data;
};

// Update theme
export const updateTheme = async (
  id: string,
  payload: UpdateThemePayload,
  previewFile?: File,
  slideFiles: File[] = [],
): Promise<Theme> => {
  const hasFiles = Boolean(previewFile) || slideFiles.length > 0;

  const response = await axiosInstance.patch<ApiResponse<Theme>>(
    `${THEME_ENDPOINT}/${id}`,
    hasFiles ? buildThemeFormData(payload, previewFile, slideFiles) : payload,
  );

  return response.data.data;
};

// Update theme status
export const updateThemeStatus = async (
  id: string,
  isActive: boolean,
): Promise<Theme> => {
  const response = await axiosInstance.patch<ApiResponse<Theme>>(
    `${THEME_ENDPOINT}/${id}/status`,
    { isActive },
  );

  return response.data.data;
};

// Delete theme
export const deleteTheme = async (id: string): Promise<Theme> => {
  const response = await axiosInstance.delete<ApiResponse<Theme>>(
    `${THEME_ENDPOINT}/${id}`,
  );

  return response.data.data;
};
