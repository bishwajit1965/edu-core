import Logo from "../../../components/ui/Logo";
import type { Notice } from "../../notice/noticeApi";
import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";
import NoticesSection from "../components/NoticesSection";
import type { Theme } from "../../theme/themeApi";
import InstitutionalHeader from "./themeComponents/institutionHeader/InstitutionalHeader";
interface ClassicThemeProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
  notices: Notice[];
}

const ClassicTheme = ({ settings, themes, notices }: ClassicThemeProps) => {
  const { institution, branding, contact, features } = settings;
  const primary = branding?.primaryColor || "#17365d";
  console.log("THEME IN CLASSIC THEME", themes);
  return (
    <main className="min-h-screen bg-[#f8f6f0] text-slate-800">
      <section
        className="bg-sky-400s mx-auto"
        style={
          {
            // backgroundColor: accentColor || "#123b83",
            // color: textColor || "yellow",
            // maxWidth: layout?.maxWidth || "1280px",
          }
        }
      >
        <InstitutionalHeader settings={settings} themes={themes} />
      </section>

      <div className="bg-[#142b49] px-5 py-2 text-sm text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2">
          <span>
            {contact?.phone || institution.phone || "Contact the institution"}
          </span>
          <span>{contact?.email || institution.email || ""}</span>
        </div>
      </div>

      <header className="border-b-4 border-[#c49a45] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5">
          <div className="flex items-center gap-4">
            <Logo primaryColor={primary} />
            {/* {branding?.logo ? (
              <img
                src={branding.logo}
                alt="Institution logo"
                className="h-16 w-16 object-contain"
              />
            ) : (
              <GraduationCap size={48} style={{ color: primary }} />
            )} */}
            <div>
              <h1
                className="font-serif text-2xl font-bold md:text-3xl"
                style={{ color: primary }}
              >
                {institution.name}
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {institution.institutionType || "Educational Institution"}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-5 text-sm font-semibold">
            <a href="#home" className="hover:text-amber-700">
              Home
            </a>
            <a href="#about" className="hover:text-amber-700">
              About
            </a>
            <a href="#academics" className="hover:text-amber-700">
              Academics
            </a>
            {features?.notices && (
              <a href="#notices" className="hover:text-amber-700">
                Notices
              </a>
            )}
            <a href="#contact" className="hover:text-amber-700">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <div className="flex justify-center my-4">
        <h1 className="lg:text-2xl text-xl font-extrabold">Classic Theme</h1>
      </div>

      <section id="home" className="relative bg-[#17365d] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-[#e7c77e]">
              Welcome to our institution
            </p>
            <h2 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Education for Knowledge, Character and Life
            </h2>
            <p className="mt-6 max-w-xl leading-7 text-blue-100">
              Building a strong foundation through quality education, discipline
              and a commitment to lifelong learning.
            </p>
            <a
              href="#about"
              className="mt-8 inline-flex items-center gap-2 bg-[#c49a45] px-6 py-3 font-semibold text-[#142b49] hover:bg-[#e0bd70]"
            >
              Discover More <ArrowRight size={18} />
            </a>
          </div>
          <div className="overflow-hidden border-8 border-white/15 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1100&q=85"
              alt="Educational campus"
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8dfcc] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3">
          {[
            ["Academic Excellence", "A commitment to quality learning."],
            ["Experienced Faculty", "Guidance from dedicated educators."],
            ["Bright Future", "Preparing learners for tomorrow."],
          ].map(([title, description]) => (
            <div key={title} className="border-l-4 border-[#c49a45] pl-5">
              <h3
                className="font-serif text-xl font-bold"
                style={{ color: primary }}
              >
                {title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2"
      >
        <div>
          <p className="font-semibold uppercase tracking-widest text-amber-700">
            About us
          </p>
          <h2
            className="mt-3 font-serif text-3xl font-bold"
            style={{ color: primary }}
          >
            A Tradition of Learning and Achievement
          </h2>
          <p className="mt-5 leading-8 text-slate-600">
            {institution.name} is dedicated to providing an encouraging
            environment where students can develop knowledge, values and
            confidence for the future.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <MapPin size={17} /> {contact?.address || institution.address}
          </p>
        </div>
        <div className="bg-[#eee7d8] p-8">
          <BookOpen size={40} style={{ color: primary }} />
          <h3 className="mt-4 font-serif text-2xl font-bold">
            Our Educational Commitment
          </h3>
          <p className="mt-3 leading-7 text-slate-600">
            We encourage curiosity, responsibility, creativity and respect
            through a balanced educational experience.
          </p>
        </div>
      </section>

      {features?.notices && (
        <section id="notices" className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-5">
            <h2
              className="font-serif text-3xl font-bold"
              style={{ color: primary }}
            >
              Notice Board
            </h2>
            <p className="mt-3 text-slate-600">
              Important institutional announcements will appear here.
            </p>

            <div className="">
              <NoticesSection notices={notices} />
              {/* {notices.map((n) => (
                <div key={n._id} className="">
                  <h1 className="lg:text-2xl text-xl font-semibold">
                    {n.title}
                  </h1>
                  <p>{n.content}</p>
                </div>
              ))} */}
            </div>
          </div>
        </section>
      )}

      {/* <footer id="contact" className="bg-[#142b49] px-5 py-8 text-white">
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
      </footer> */}
    </main>
  );
};

export default ClassicTheme;
