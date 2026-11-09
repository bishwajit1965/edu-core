import { Phone } from "lucide-react";
import type { PublicInstitutionSettings } from "../../../settings/settingsApi";

interface ClassicThemeFooterProps {
  settings: PublicInstitutionSettings;
}

const ClassicThemeFooter = ({ settings }: ClassicThemeFooterProps) => {
  const { institution, contact } = settings;
  return (
    <footer id="contact" className="bg-[#142b49] px-5 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-5">
        <div>
          <h3 className="font-serif text-xl font-bold">{institution.name}</h3>
          <p className="mt-2 text-sm text-blue-100">
            {contact?.address || institution.address}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Phone size={15} /> {contact?.phone || institution.phone}
          </p>
          <p>{contact?.email || institution.email}</p>
        </div>
      </div>
    </footer>
  );
};

export default ClassicThemeFooter;
