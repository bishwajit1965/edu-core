import Logo from "../../../components/ui/Logo";
import type { Notice } from "../../notice/noticeApi";
import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { ArrowRight, BookOpen, Users, Award } from "lucide-react";
import type { Theme } from "../../theme/themeApi";

interface AcademicThemeProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
  notices: Notice[];
}

const highlights = [
  {
    title: "Academic Programs",
    description: "Learning opportunities for every student.",
    icon: BookOpen,
  },
  {
    title: "Dedicated Teachers",
    description: "Support from committed educators.",
    icon: Users,
  },
  {
    title: "Student Development",
    description: "Knowledge, skills and confidence.",
    icon: Award,
  },
];

const AcademicTheme = ({ themes, settings }: AcademicThemeProps) => {
  const { institution, branding, features } = settings;
  const primary = branding?.primaryColor || "#155e75";
  console.log("THEME IN ACADEMIC THEME", themes);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo primaryColor={primary} />
            {/* {branding?.logo ? (
              <img
                src={branding.logo}
                alt="Institution logo"
                className="h-14 w-14 object-contain"
              />
            ) : (
              <GraduationCap size={44} style={{ color: primary }} />
            )} */}
            <div>
              <h1
                className="text-xl font-bold md:text-2xl"
                style={{ color: primary }}
              >
                {institution.name}
              </h1>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {institution.institutionType || "Education and Learning"}
              </p>
              <p>{institution.address}</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-5 text-sm font-medium text-slate-600">
            <a href="#home" className="hover:text-cyan-700">
              Home
            </a>
            <a href="#about" className="hover:text-cyan-700">
              Institution
            </a>
            <a href="#programs" className="hover:text-cyan-700">
              Academics
            </a>
            {features?.notices && (
              <a href="#notices" className="hover:text-cyan-700">
                Notices
              </a>
            )}
            <a href="#contact" className="hover:text-cyan-700">
              Contact
            </a>
          </nav>
        </div>
      </header>
      <div className="flex justify-center my-4">
        <h1 className="lg:text-2xl text-xl font-extrabold">Academic Theme</h1>
      </div>

      <section id="home" className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-800">
              Inspiring a lifetime of learning
            </span>
            <h2
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
              style={{ color: primary }}
            >
              Learn Today. Lead Tomorrow.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Welcome to {institution.name}, where academic learning and
              personal development go hand in hand.
            </p>
            <a
              href="#programs"
              className="mt-8 inline-flex items-center gap-2 rounded-md px-6 py-3 font-semibold text-white shadow-md"
              style={{ backgroundColor: primary }}
            >
              Explore Academics <ArrowRight size={18} />
            </a>
          </div>
          <img
            src="https://images.unsplash.com/photo-1592930954854-7d00c87d0cf4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
            alt="Students on campus"
            className="h-72 w-full rounded-xl object-cover shadow-xl md:h-105"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <Icon size={34} style={{ color: primary }} />
            <h3 className="mt-5 text-xl font-bold">{title}</h3>
            <p className="mt-2 leading-7 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section id="about" className="bg-[#f1f7f8] py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-2">
          <div>
            <p className="font-semibold uppercase tracking-widest text-cyan-800">
              Who we are
            </p>
            <h2
              className="mt-3 text-3xl font-bold md:text-4xl"
              style={{ color: primary }}
            >
              A Supportive Environment for Every Learner
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              {institution.name} strives to create an inclusive and engaging
              learning environment that helps students reach their potential.
            </p>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold" style={{ color: primary }}>
              Our Mission
            </h3>
            <p className="mt-4 leading-8 text-slate-600">
              To nurture informed, capable and responsible learners through
              meaningful education and a culture of continuous improvement.
            </p>
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-5 py-16">
        <p className="font-semibold uppercase tracking-widest text-cyan-800">
          Learning pathways
        </p>
        <h2 className="mt-3 text-3xl font-bold" style={{ color: primary }}>
          Academic Environment
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Discover an environment designed to support learning, participation
          and student achievement.
        </p>
      </section>

      {features?.notices && (
        <section id="notices" className="bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="text-3xl font-bold" style={{ color: primary }}>
              Latest Notices
            </h2>
            <p className="mt-3 text-slate-600">
              Institutional announcements will be displayed here.
            </p>
          </div>
        </section>
      )}

      {/* <footer id="contact" className="bg-slate-900 px-5 py-9 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold">{institution.name}</h3>
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

export default AcademicTheme;
