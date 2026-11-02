import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Phone,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

interface ModernThemeProps {
  settings: PublicInstitutionSettings;
}

const ModernTheme = ({ settings }: ModernThemeProps) => {
  const { institution, branding, contact, social, features } = settings;

  const primaryColor = branding?.primaryColor || "#123b83";
  // Temporary sample notices. We will connect the Notice module later.
  const notices = [
    {
      day: "28",
      month: "Apr",
      title: "Admissions Open",
      description: "Admission is now open for new students.",
      color: "bg-blue-600",
    },
    {
      day: "25",
      month: "Apr",
      title: "Annual Sports Day",
      description: "Join us for our annual sports celebration.",
      color: "bg-emerald-600",
    },
    {
      day: "20",
      month: "Apr",
      title: "Academic Results",
      description: "Check the latest academic announcements.",
      color: "bg-amber-400",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Top contact bar */}

      <div
        className="hidden text-white md:block"
        style={{ backgroundColor: "#092958" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 text-sm">
          <div className="flex flex-wrap items-center gap-6">
            {contact?.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2"
              >
                <Phone size={16} />
                {contact.phone}
              </a>
            )}

            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2"
              >
                <Mail size={16} />
                {contact.email}
              </a>
            )}
          </div>

          <div className="flex items-center gap-5">
            {features?.notices && <a href="#notices">Notices</a>}
            {features?.events && <a href="#events">Events</a>}
            {features?.literaryCorner && (
              <a href="#literary">Literary Corner</a>
            )}

            <div className="flex items-center gap-3 border-l border-white/20 pl-5">
              {social?.facebook && (
                <a
                  href={social?.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social?.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube size={18} />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social?.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-6">
          <a href="#" className="flex min-w-0 items-center gap-3">
            {branding?.logo ? (
              <img
                src={branding?.logo}
                alt={`${institution.name} logo`}
                className="h-14 w-14 object-contain"
              />
            ) : (
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <GraduationCap size={32} />
              </div>
            )}

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-2xl">
                {institution.name || "Your Institution"}
              </h1>
              <p className="text-xs font-medium tracking-wide text-slate-500 sm:text-sm">
                {institution?.address}
              </p>
              <p className="text-xs font-medium tracking-wide text-slate-500 sm:text-sm">
                Learn · Grow · Excel
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">
            <a
              href="#"
              className="border-b-2 py-2"
              style={{ color: primaryColor, borderColor: primaryColor }}
            >
              Home
            </a>
            <a href="#about" className="transition hover:text-blue-700">
              About
            </a>
            <a href="#academics" className="transition hover:text-blue-700">
              Academics
            </a>
            <a href="#notices" className="transition hover:text-blue-700">
              Noticeboard
            </a>
            <a href="#events" className="transition hover:text-blue-700">
              Events
            </a>
            <a href="#contact" className="transition hover:text-blue-700">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {features?.admissions && (
              <a
                href="#admissions"
                className="hidden items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 sm:flex"
                style={{ backgroundColor: primaryColor }}
              >
                Apply Now <ArrowRight size={17} />
              </a>
            )}
            <button
              type="button"
              className="rounded-lg border border-slate-200 p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex justify-center my-4">
        <h1 className="lg:text-2xl text-xl font-extrabold">Modern Theme</h1>
      </div>

      {/* Hero section */}
      <section className="relative isolate min-h-[540px] overflow-hidden bg-slate-900 rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=85"
          alt="College campus building"
          className="absolute inset-0 -z-20 h-full w-full object-cover rounded-2xl"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-slate-900/10" />

        <div className="mx-auto flex min-h-[540px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Star size={15} className="text-yellow-400" />
              Welcome to our institution
            </p>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Building brighter futures through
              <span className="block text-yellow-400">quality education.</span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
              A place to learn, discover talents, develop values and prepare for
              a brighter tomorrow.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#academics"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-yellow-300"
              >
                Explore Our Programs <ArrowRight size={18} />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-900"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 md:px-6">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/70 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: GraduationCap,
              title: "Quality Education",
              subtitle: "Academic Excellence",
            },
            {
              icon: Trophy,
              title: "Holistic Development",
              subtitle: "Beyond Books",
            },
            {
              icon: Users,
              title: "Supportive Community",
              subtitle: "Together We Grow",
            },
            {
              icon: Star,
              title: "Bright Future",
              subtitle: "Unlimited Possibilities",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`flex items-center gap-5 px-7 py-7 ${
                  index !== 3 ? "lg:border-r lg:border-slate-200" : ""
                }`}
              >
                <Icon size={38} style={{ color: primaryColor }} />
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About and notices */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 md:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div id="about">
              <p
                className="mb-3 text-sm font-bold uppercase tracking-widest"
                style={{ color: primaryColor }}
              >
                Discover our institution
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                About {institution.name}
              </h2>
              <div
                className="mt-4 h-1 w-16 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />

              <p className="mt-6 leading-8 text-slate-600">
                We are committed to providing quality education, encouraging
                innovation and developing responsible citizens for tomorrow.
              </p>

              {institution.establishedYear && (
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Established in {institution.establishedYear}
                </p>
              )}

              <a
                href="#contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                Know More <ArrowRight size={17} />
              </a>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1000&q=85"
                alt="Educational campus"
                className="h-72 w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {features?.notices && (
          <aside
            id="notices"
            className="border-l-0 border-slate-200 pl-0 lg:border-l lg:pl-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">Latest Notices</h2>
              <a
                href="#notices"
                className="flex items-center gap-1 text-sm font-bold"
                style={{ color: primaryColor }}
              >
                View All <ArrowRight size={16} />
              </a>
            </div>

            <div className="space-y-4">
              {notices.map((notice) => (
                <article
                  key={notice.title}
                  className="flex gap-4 border-b border-slate-100 pb-4"
                >
                  <div
                    className={`${notice.color} flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-sm`}
                  >
                    <span className="text-xl font-extrabold leading-none">
                      {notice.day}
                    </span>
                    <span className="mt-1 text-xs">{notice.month}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{notice.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {notice.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}
      </section>

      {/* Academic programs */}
      <section id="academics" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-6">
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: primaryColor }}
          >
            Learning opportunities
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Explore Our Academics
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
            Discover an environment that supports learning, curiosity,
            creativity and personal growth.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              [
                "Academic Learning",
                "Strong foundations for lifelong learning.",
              ],
              [
                "Creative Activities",
                "Opportunities to discover and develop talents.",
              ],
              [
                "Student Development",
                "Building confidence, values and leadership.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-2xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="mb-5 inline-flex rounded-xl p-3 text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <BookOpen size={25} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-slate-500">{description}</p>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold"
                  style={{ color: primaryColor }}
                >
                  Learn More <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions call to action */}
      {features?.admissions && (
        <section id="admissions" className="px-5 py-16 md:px-6">
          <div
            className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl px-8 py-12 text-white md:flex-row md:px-14"
            style={{ backgroundColor: primaryColor }}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                Begin your journey
              </p>
              <h2 className="mt-2 text-3xl font-extrabold">
                Your future starts here.
              </h2>
              <p className="mt-3 text-white/80">
                Take the next step towards your educational goals.
              </p>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-yellow-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-yellow-300"
            >
              Admission Enquiry <ArrowRight size={18} />
            </a>
          </div>
        </section>
      )}

      {/* Contact and footer */}
      <footer id="contact" className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
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
    </main>
  );
};

export default ModernTheme;
