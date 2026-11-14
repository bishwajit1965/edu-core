import type { PublicInstitutionSettings } from "../../features/settings/settingsApi.js";
import type { Theme } from "../theme/themeApi.js";
import AcademicThemeFooter from "./themes/themeFooters/AcademicThemeFooter.js";
import ClassicThemeFooter from "./themes/themeFooters/ClassicThemeFooter.js";
import ModernThemeFooter from "./themes/themeFooters/ModernThemeFooter.js";
import PremiumThemeFooter from "./themes/themeFooters/PremiumThemeFooter.js";
import VibrantThemeFooter from "./themes/themeFooters/VibrantThemeFooter.js";

interface ThemeFooterResolverProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
}

const ThemeFooterResolver = ({
  themes,
  settings,
}: ThemeFooterResolverProps) => {
  switch (settings.website?.theme) {
    case "classic-traditional":
      return <ClassicThemeFooter themes={themes} settings={settings} />;

    case "modern-professional":
      return <ModernThemeFooter themes={themes} settings={settings} />;

    case "academic-editorial":
      return <AcademicThemeFooter themes={themes} settings={settings} />;

    case "vibrant-friendly":
      return <VibrantThemeFooter themes={themes} settings={settings} />;

    case "premium-minimal":
      return <PremiumThemeFooter themes={themes} settings={settings} />;

    default:
      return <ModernThemeFooter themes={themes} settings={settings} />;
  }
};

export default ThemeFooterResolver;
