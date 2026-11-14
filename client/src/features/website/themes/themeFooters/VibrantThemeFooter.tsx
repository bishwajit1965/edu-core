import type { PublicInstitutionSettings } from "../../../settings/settingsApi";
import type { Theme } from "../../../theme/themeApi";

interface VibrantThemeFooterProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
}

const VibrantThemeFooter = ({ themes, settings }: VibrantThemeFooterProps) => {
  const { institution, contact } = settings;
  return (
    <footer id="contact" className="bg-slate-950 px-5 py-9 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-5">
        <div>
          <h3 className="text-xl font-extrabold">{institution.name}</h3>
          <p className="mt-2 text-sm text-slate-300">
            {contact?.address || institution.address}
          </p>
        </div>
        <div className="text-sm leading-7 text-slate-300">
          <p>{contact?.phone || institution.phone}</p>
          <p>{contact?.email || institution.email}</p>
        </div>
      </div>
    </footer>
  );
};

export default VibrantThemeFooter;
