import type { Notice } from "../notice/noticeApi";
import type { PublicInstitutionSettings } from "../settings/settingsApi";
import AcademicTheme from "./themes/AcademicTheme";
import ClassicTheme from "./themes/ClassicTheme";
import ModernTheme from "./themes/ModernTheme";
import PremiumTheme from "./themes/PremiumTheme";
import VibrantTheme from "./themes/VibrantTheme";

interface ThemeResolverProps {
  settings: PublicInstitutionSettings;
  notices: Notice[];
}

const ThemeResolver = ({ settings, notices }: ThemeResolverProps) => {
  console.log("Selected theme:", settings.website?.theme);
  switch (settings.website?.theme) {
    case "classic":
      return <ClassicTheme settings={settings} notices={notices} />;
    case "modern":
      return <ModernTheme settings={settings} notices={notices} />;

    case "academic":
      return <AcademicTheme settings={settings} notices={notices} />;

    case "vibrant":
      return <VibrantTheme settings={settings} notices={notices} />;

    case "premium":
      return <PremiumTheme settings={settings} notices={notices} />;

    default:
      return <ModernTheme settings={settings} notices={notices} />;
  }
};

export default ThemeResolver;
