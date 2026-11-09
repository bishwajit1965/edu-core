import { Mail, MapPin, Phone } from "lucide-react";
import type { PublicInstitutionSettings } from "../../../settings/settingsApi";

interface ModernThemeFooterProps {
  settings: PublicInstitutionSettings;
}
const ModernThemeFooter = ({ settings }: ModernThemeFooterProps) => {
  const { institution, contact, features } = settings;
  return (
    <footer id="contact" className="bg-slate-950 text-white">
      <div className="mx-auto grid lg:max-w-7xl lg:gap-10 px-6 lg:py-16 py-8 lg:grid-cols-3">
        <div>
          <h2 className="text-2xl font-extrabold">{institution.name}</h2>
          <p className="mt-4 max-w-sm leading-7 text-slate-400">
            Learn · Grow · Excel. Supporting students in their journey towards
            knowledge and a brighter future.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold">Contact Information</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-400">
            {(contact?.address || institution.address) && (
              <p className="flex gap-3">
                <MapPin size={18} className="shrink-0" />
                {contact?.address || institution.address}
              </p>
            )}
            {(contact?.phone || institution.phone) && (
              <p className="flex gap-3">
                <Phone size={18} className="shrink-0" />
                {contact?.phone || institution.phone}
              </p>
            )}
            {(contact?.email || institution.email) && (
              <p className="flex gap-3">
                <Mail size={18} className="shrink-0" />
                {contact?.email || institution.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">Explore</h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
            <a href="#about" className="hover:text-white">
              About Us
            </a>
            <a href="#academics" className="hover:text-white">
              Academics
            </a>
            {features?.notices && (
              <a href="#notices" className="hover:text-white">
                Notices
              </a>
            )}
            {features?.events && (
              <a href="#events" className="hover:text-white">
                Events
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-slate-300 bg-gray-800">
        © {new Date().getFullYear()} {institution.name}. All rights reserved.
        <span className="mx-2">|</span>
        Powered by Edu Core
      </div>
    </footer>
  );
};

export default ModernThemeFooter;
