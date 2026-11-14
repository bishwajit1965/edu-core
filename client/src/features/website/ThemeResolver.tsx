import type { Notice } from "../notice/noticeApi";
import type { PublicInstitutionSettings } from "../settings/settingsApi";
import type { Theme } from "../theme/themeApi";
import AcademicTheme from "./themes/AcademicTheme";
import ClassicTheme from "./themes/ClassicTheme";
import ModernTheme from "./themes/ModernTheme";
import PremiumTheme from "./themes/PremiumTheme";
import VibrantTheme from "./themes/VibrantTheme";

interface ThemeResolverProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
  notices: Notice[];
}

const ThemeResolver = ({ settings, notices, themes }: ThemeResolverProps) => {
  switch (settings.website?.theme) {
    case "classic-traditional":
      return (
        <ClassicTheme settings={settings} themes={themes} notices={notices} />
      );

    case "modern-professional":
      return (
        <ModernTheme settings={settings} themes={themes} notices={notices} />
      );

    case "academic-editorial":
      return (
        <AcademicTheme settings={settings} themes={themes} notices={notices} />
      );

    case "vibrant-friendly":
      return (
        <VibrantTheme settings={settings} themes={themes} notices={notices} />
      );

    case "premium-minimal":
      return (
        <PremiumTheme settings={settings} themes={themes} notices={notices} />
      );

    default:
      return (
        <ModernTheme settings={settings} themes={themes} notices={notices} />
      );
  }
};

export default ThemeResolver;
