import Logo from "../../../components/ui/Logo";
import type { Notice } from "../../notice/noticeApi";
import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { ArrowRight, BookOpen, MoveUpRight } from "lucide-react";
interface PremiumThemeProps {
  settings: PublicInstitutionSettings;
  notices: Notice[];
}

const PremiumTheme = ({ settings }: PremiumThemeProps) => {
  const { institution, branding, features } = settings;
  const primary = branding?.primaryColor || "#172b3a";
  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#202a30]">
      <header className="bg-[#111f29] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-6">
          <div className="flex items-center gap-4">
            {/* {branding?.logo ? (
              <img
                src={branding.logo}
                alt="Institution logo"
                className="h-14 w-14 object-contain"
              />
            ) : (
              <GraduationCap size={44} className="text-[#c9ad72]" />
            )} */}

            <Logo primaryColor={primary} />
            <div>
              <h1 className="font-serif text-xl font-semibold tracking-wide md:text-2xl">
                {institution.name}
              </h1>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#c9ad72]">
                {institution.institutionType || "Excellence in Education"}
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-5 text-xs uppercase tracking-widest text-slate-200">
            <a href="#home" className="hover:text-[#c9ad72]">
              Home
            </a>
            <a href="#about" className="hover:text-[#c9ad72]">
              Our Story
            </a>
            <a href="#academics" className="hover:text-[#c9ad72]">
              Academics
            </a>
            {features?.notices && (
              <a href="#notices" className="hover:text-[#c9ad72]">
                News
              </a>
            )}
            <a href="#contact" className="hover:text-[#c9ad72]">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <div className="flex justify-center my-4">
        <h1 className="lg:text-2xl text-xl font-extrabold">Premium Theme</h1>
      </div>

      <section id="home" className="relative `min-h-145` bg-[#142630]">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=90"
          alt="Institution campus"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 `bg-gradient-to-r` from-[#101e27] via-[#101e27]/80 to-transparent" />
        <div className="relative mx-auto flex `min-h-145` max-w-7xl items-center px-5 py-20">
          <div className="max-w-3xl text-white">
            <p className="text-xs uppercase tracking-[0.35em] text-[#d8bd83]">
              A distinguished place of learning
            </p>
            <h2 className="mt-7 font-serif text-5xl font-medium leading-tight md:text-7xl">
              Shaping Minds.
              <br />
              <span className="italic text-[#d8bd83]">Inspiring Futures.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-200">
              At {institution.name}, we believe education is a journey of
              discovery, personal growth and meaningful achievement.
            </p>
            <a
              href="#about"
              className="mt-9 inline-flex items-center gap-3 border border-[#d8bd83] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0dcae] transition hover:bg-[#d8bd83] hover:text-[#172630]"
            >
              Discover Our Institution <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e7e1d5] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-3">
          {[
            ["01", "Academic Excellence", "A thoughtful approach to learning."],
            ["02", "Personal Development", "Nurturing talent and character."],
            ["03", "A Lasting Foundation", "Preparing students for tomorrow."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-5">
              <span className="font-serif text-3xl text-[#b69a62]">
                {number}
              </span>
              <div>
                <h3 className="font-serif text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a88a4f]">
            The institution
          </p>
          <h2
            className="mt-5 font-serif text-4xl leading-tight md:text-5xl"
            style={{ color: primary }}
          >
            Education with Purpose and Vision
          </h2>
          <p className="mt-6 leading-8 text-slate-600">
            {institution.name} is committed to creating a learning environment
            where academic achievement, integrity and individual potential are
            valued.
          </p>
          <p className="mt-4 leading-8 text-slate-600">
            Our aim is to help students become knowledgeable, confident and
            responsible citizens.
          </p>
          <a
            href="#academics"
            className="mt-7 inline-flex items-center gap-2 border-b border-[#b69a62] pb-2 text-sm font-semibold"
          >
            Explore our approach <MoveUpRight size={16} />
          </a>
        </div>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=85"
          alt="Students studying together"
          className="h-80 w-full object-cover `md:h-107.5`"
        />
      </section>

      <section id="academics" className="bg-[#172b36] px-5 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d8bd83]">
            Learning experience
          </p>
          <h2 className="mt-4 font-serif text-4xl">
            A Foundation for Lifelong Achievement
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              [
                "Academic Learning",
                "Encouraging curiosity, understanding and independent thinking.",
              ],
              [
                "Character Building",
                "Developing integrity, responsibility and respect.",
              ],
              [
                "Future Readiness",
                "Building confidence and skills for a changing world.",
              ],
            ].map(([title, description]) => (
              <article key={title} className="border-t border-[#9d895f] pt-6">
                <BookOpen className="text-[#d8bd83]" size={28} />
                <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {features?.notices && (
        <section id="notices" className="mx-auto max-w-7xl px-5 py-16">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a88a4f]">
            Stay informed
          </p>
          <h2 className="mt-3 font-serif text-4xl" style={{ color: primary }}>
            Institutional News & Notices
          </h2>
          <p className="mt-4 text-slate-600">
            Official announcements will be published here.
          </p>
        </section>
      )}

      {/* <footer id="contact" className="bg-[#111f29] px-5 py-12 text-white">
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
      </footer> */}
    </main>
  );
};

export default PremiumTheme;
