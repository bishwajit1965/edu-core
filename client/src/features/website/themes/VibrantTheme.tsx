import Logo from "../../../components/ui/Logo";
import type { Notice } from "../../notice/noticeApi";
import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { ArrowRight, BookOpen, Heart, Sparkles, Users } from "lucide-react";
import type { Theme } from "../../theme/themeApi";

interface VibrantThemeProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
  notices: Notice[];
}
const VibrantTheme = ({ themes, settings }: VibrantThemeProps) => {
  const { institution, branding, features } = settings;
  const primary = branding?.primaryColor || "#7c3aed";

  console.log("THEME IN VIBRANT THEME", themes);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf8] text-slate-800">
      <header className="relative z-10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5">
          <div className="flex items-center gap-3">
            {/* {branding?.logo ? (
              <img
                src={branding.logo}
                alt="Institution logo"
                className="h-14 w-14 object-contain"
              />
            ) : (
              <div
                className="rounded-2xl p-3 text-white"
                style={{ backgroundColor: primary }}
              >
                <Sparkles size={28} />
              </div>
            )} */}
            <Logo primaryColor={primary} />
            <div>
              <h1
                className="text-xl font-extrabold md:text-2xl"
                style={{ color: primary }}
              >
                {institution.name}
              </h1>
              <p className="text-xs font-medium text-slate-500">
                {institution.institutionType || "Learn • Grow • Shine"}
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold">
            <a href="#home" className="hover:text-purple-700">
              Home
            </a>
            <a href="#about" className="hover:text-purple-700">
              About
            </a>
            <a href="#activities" className="hover:text-purple-700">
              Activities
            </a>
            {features?.notices && (
              <a href="#notices" className="hover:text-purple-700">
                Notices
              </a>
            )}
            <a href="#contact" className="hover:text-purple-700">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <div className="flex justify-center my-4">
        <h1 className="lg:text-2xl text-xl font-extrabold">Vibrant Theme</h1>
      </div>

      <section id="home" className="relative">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(120deg, ${primary}, #ec4899)` }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 text-white md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              <Sparkles size={16} /> A place to discover your potential
            </span>
            <h2 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              Big Dreams Begin with Great Learning!
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/90">
              Welcome to {institution.name}. Explore, create, make friends and
              build the skills to shape your future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold shadow-lg"
                style={{ color: primary }}
              >
                Explore More <ArrowRight size={18} />
              </a>
              {features?.admissions && (
                <a
                  href="#admissions"
                  className="rounded-full border-2 border-white px-6 py-3 font-bold text-white hover:bg-white/10"
                >
                  Admissions
                </a>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-5 -top-5 h-24 w-24 rounded-full bg-yellow-300" />
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1100&q=85"
              alt="Students learning together"
              className="relative h-72 w-full rounded-[2rem] border-8 border-white/30 object-cover shadow-2xl md:h-96"
            />
            <div className="absolute -bottom-5 -right-3 rounded-2xl bg-yellow-300 px-5 py-3 font-extrabold text-slate-900 shadow-lg">
              Learn • Create • Achieve
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:grid-cols-3">
        {[
          {
            title: "Learn Together",
            text: "Discover ideas and develop knowledge.",
            icon: BookOpen,
            color: "bg-sky-100 text-sky-700",
          },
          {
            title: "Grow Together",
            text: "Build confidence and lasting friendships.",
            icon: Users,
            color: "bg-pink-100 text-pink-700",
          },
          {
            title: "Care Together",
            text: "Create a positive learning community.",
            icon: Heart,
            color: "bg-amber-100 text-amber-700",
          },
        ].map(({ title, text, icon: Icon, color }) => (
          <article
            key={title}
            className="rounded-3xl bg-white p-7 shadow-lg shadow-slate-200/60"
          >
            <div className={`inline-flex rounded-2xl p-4 ${color}`}>
              <Icon size={30} />
            </div>
            <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
            <p className="mt-2 leading-7 text-slate-600">{text}</p>
          </article>
        ))}
      </section>

      <section id="about" className="bg-[#f4efff] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p
            className="font-bold uppercase tracking-widest"
            style={{ color: primary }}
          >
            Our story
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black md:text-4xl">
            Learning Should Be Inspiring, Engaging and Full of Possibilities.
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {institution.name} encourages students to explore their interests,
            develop their abilities and become thoughtful members of society.
          </p>
        </div>
      </section>

      <section id="activities" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl font-black" style={{ color: primary }}>
          Life Beyond the Classroom
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Learning also happens through creativity, teamwork, sports and
          cultural participation.
        </p>
      </section>

      {features?.notices && (
        <section id="notices" className="bg-white px-5 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-black" style={{ color: primary }}>
              What's Happening?
            </h2>
            <p className="mt-3 text-slate-600">
              Latest notices and announcements will appear here.
            </p>
          </div>
        </section>
      )}

      {features?.admissions && (
        <section
          id="admissions"
          className="px-5 py-12 text-center text-white"
          style={{ backgroundColor: primary }}
        >
          <h2 className="text-3xl font-black">Your Journey Starts Here!</h2>
          <p className="mt-3 text-white/90">
            Contact us to learn about admission opportunities.
          </p>
        </section>
      )}

      {/* <footer id="contact" className="bg-slate-950 px-5 py-9 text-white">
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
      </footer> */}
    </main>
  );
};

export default VibrantTheme;
