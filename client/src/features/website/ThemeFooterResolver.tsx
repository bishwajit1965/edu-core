import type { PublicInstitutionSettings } from "../../features/settings/settingsApi.js";
import AcademicThemeFooter from "./themes/themeFooters/AcademicThemeFooter.js";
import ClassicThemeFooter from "./themes/themeFooters/ClassicThemeFooter.js";
import ModernThemeFooter from "./themes/themeFooters/ModernThemeFooter.js";
import PremiumThemeFooter from "./themes/themeFooters/PremiumThemeFooter.js";
import VibrantThemeFooter from "./themes/themeFooters/VibrantThemeFooter.js";

interface ThemeFooterResolverProps {
  settings: PublicInstitutionSettings;
}

const ThemeFooterResolver = ({ settings }: ThemeFooterResolverProps) => {
  switch (settings.website?.theme) {
    case "classic":
      return <ClassicThemeFooter settings={settings} />;

    case "modern":
      return <ModernThemeFooter settings={settings} />;

    case "academic":
      return <AcademicThemeFooter settings={settings} />;

    case "vibrant":
      return <VibrantThemeFooter settings={settings} />;

    case "premium":
      return <PremiumThemeFooter settings={settings} />;

    default:
      return <ModernThemeFooter settings={settings} />;
  }
};

export default ThemeFooterResolver;
