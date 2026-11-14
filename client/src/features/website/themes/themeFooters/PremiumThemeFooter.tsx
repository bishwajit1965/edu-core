import type { PublicInstitutionSettings } from "../../../settings/settingsApi";
import type { Theme } from "../../../theme/themeApi";

interface PremiumThemeFooterProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
}

const PremiumThemeFooter = ({ themes, settings }: PremiumThemeFooterProps) => {
  const { institution, contact } = settings;
  return (
    <footer id="contact" className="bg-[#111f29] px-5 py-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8">
        <div>
          <h3 className="font-serif text-2xl">{institution.name}</h3>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
            {contact?.address || institution.address}
          </p>
        </div>
        <div className="text-sm leading-8 text-slate-300">
          <p>{contact?.phone || institution.phone}</p>
          <p>{contact?.email || institution.email}</p>
          {contact?.mapUrl && (
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#d8bd83]"
            >
              View location
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-400">
        © {new Date().getFullYear()} {institution.name}. All rights reserved.
      </div>
    </footer>
  );
};

export default PremiumThemeFooter;
