import { IThemeSlide } from "./theme.interface.js";

export const generateThemeSlug = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const normalizeThemeSlug = (slug: string): string => {
  return slug.trim().toLowerCase();
};

export const sortThemeSlides = (slides: IThemeSlide[]): IThemeSlide[] => {
  return [...slides].sort((a, b) => a.order - b.order);
};

export const getActiveThemeSlides = (slides: IThemeSlide[]): IThemeSlide[] => {
  return sortThemeSlides(slides.filter((slide) => slide.isActive));
};
