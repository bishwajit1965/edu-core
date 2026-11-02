import type { PublicInstitutionSettings } from "../settings/settingsApi";
import AcademicTheme from "./themes/AcademicTheme";
import ClassicTheme from "./themes/ClassicTheme";
import ModernTheme from "./themes/ModernTheme";
import PremiumTheme from "./themes/PremiumTheme";
import VibrantTheme from "./themes/VibrantTheme";

interface ThemeResolverProps {
  settings: PublicInstitutionSettings;
}

const ThemeResolver = ({ settings }: ThemeResolverProps) => {
  console.log("Selected theme:", settings.website?.theme);
  switch (settings.website?.theme) {
    case "classic":
      return <ClassicTheme settings={settings} />;
    case "modern":
      return <ModernTheme settings={settings} />;

    case "academic":
      return <AcademicTheme settings={settings} />;

    case "vibrant":
      return <VibrantTheme settings={settings} />;

    case "premium":
      return <PremiumTheme settings={settings} />;

    default:
      return <ModernTheme settings={settings} />;
  }
};

export default ThemeResolver;
