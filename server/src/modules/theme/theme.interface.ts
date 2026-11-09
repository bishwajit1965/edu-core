import { Model } from "mongoose";

export interface IThemeHeader {
  layout: "classic" | "centered" | "split";
  sticky: boolean;
  showTopBar: boolean;
  showLogo: boolean;
  showInstitutionName: boolean;
}

export interface IThemeHero {
  layout: "centered" | "left" | "split" | "slider";
  showHero: boolean;
  showSubtitle: boolean;
  showPrimaryButton: boolean;
  showSecondaryButton: boolean;
}

export interface IThemeImage {
  url: string;
  publicId: string;
  resourceType: "image";
  format: string;
  alt: string;
}

export interface IThemeSlide {
  _id?: string;
  title: string;
  subtitle: string;
  description?: string;
  image: IThemeImage;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  order: number;
  isActive: boolean;
}

export interface IThemeSlider {
  enabled: boolean;
  autoplay: boolean;
  interval: number;
  slides: IThemeSlide[];
}

export interface IThemeSection {
  key: string;
  title: string;
  enabled: boolean;
  layout: string;
  order: number;
}

export interface IThemeFooter {
  layout: "simple" | "columns" | "extended";
  showLogo: boolean;
  showSocialLinks: boolean;
  showContactInfo: boolean;
  showQuickLinks: boolean;
}

export interface IThemeLayout {
  maxWidth: string;
  header: IThemeHeader;
  hero: IThemeHero;
  slider: IThemeSlider;
  sections: IThemeSection[];
  footer: IThemeFooter;
}

export interface IThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export interface IThemeTypography {
  headingFont: string;
  bodyFont: string;
}

export interface IThemeConfig {
  colors: IThemeColors;
  typography: IThemeTypography;
  layout: IThemeLayout;
}

export interface IThemePreview {
  url: string;
  publicId: string;
  resourceType: string;
  format: string;
}

export interface ITheme {
  name: string;
  slug: string;
  description: string;
  preview: IThemePreview;
  config: IThemeConfig;
  isActive: boolean;
  isDeleted: boolean;
}

export interface ThemeModel extends Model<ITheme> {}
