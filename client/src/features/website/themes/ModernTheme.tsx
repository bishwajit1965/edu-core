import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Compass,
  GraduationCap,
  Mail,
  Phone,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import type { PublicInstitutionSettings } from "../../settings/settingsApi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import type { Notice } from "../../notice/noticeApi";
import NoticesSection from "../components/NoticesSection";
import { LucideIcon } from "../../../components/ui/LucideIcons";
import type { Theme } from "../../theme/themeApi";
import { useEffect, useState } from "react";
import LeadershipMessageSection from "./themeComponents/leadershipMessage/LeadershipMessageSection";
import InstitutionalHeader from "./themeComponents/institutionHeader/InstitutionalHeader";

interface ModernThemeProps {
  settings: PublicInstitutionSettings;
  themes: Theme[];
  notices: Notice[];
}

const ModernTheme = ({ settings, themes, notices }: ModernThemeProps) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const { institution, branding, contact, social, features } = settings;

  console.log("THEMES in Modern Theme", themes);
  // const primaryColor = branding?.primaryColor || "#123b83";
  const theme = themes.find((theme) => theme?.slug === "modern-professional");
  console.log("Modern & Professional", theme);

  const themeConfig = theme?.config;
  const colors = themeConfig?.colors;
  const typography = themeConfig?.typography;
  const layout = themeConfig?.layout;

  // Config color
  const primaryColor = colors?.primary || branding?.primaryColor || "#123b83";
  const secondaryColor = colors?.secondary || "#0D9488";
  const accentColor = colors?.accent || "#CCFBF1";
  const backgroundColor = colors?.background || "#F8FAFC";
  const surfaceColor = colors?.surface || "#FFFFFF";
  const textColor = colors?.text || "#1E293B";
  const mutedColor = colors?.muted || "#64748B";

  // Header configuration
  const headerConfig = layout?.header;

  // Hero slider configuration
  const heroConfig = layout?.hero;
  const sliderConfig = layout?.slider;

  const slides = [...(sliderConfig?.slides ?? [])]
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order);

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (
      !sliderConfig?.enabled ||
      !sliderConfig?.autoplay ||
      slides.length < 2
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, sliderConfig.interval || 5000);

    return () => window.clearInterval(timer);
  }, [
    sliderConfig?.enabled,
    sliderConfig?.autoplay,
    sliderConfig?.interval,
    slides.length,
  ]);

  const currentSlide = slides[activeSlide];

  // Section configuration
  const sectionConfig = [...(layout?.sections ?? [])]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const isSectionEnabled = (key: string) =>
    sectionConfig.some((section) => section.key === key);

  // FEATURE PANEL NAVIGATION OPTIONS LIST
  const navigationGroups = [
    {
      title: "Admissions & People",
      description: "Explore admission and our institutional community.",
      icon: LucideIcon.GraduationCap,
      links: [
        {
          label: "Admission Enquiry",
          href: "/student-admissions",
          enabled: Boolean(features?.admissions),
        },
        { label: "Students", enabled: false },
        { label: "Teachers", enabled: false },
        { label: "Staff", enabled: false },
      ],
    },
    {
      title: "Academics",
      description: "Discover academic programmes and activities.",
      icon: LucideIcon.BookOpen,
      links: [
        {
          label: "Academic Overview",
          href: "#academics",
          enabled: isSectionEnabled("academic"),
        },
        { label: "Class Routine", enabled: false },
        { label: "Examinations", enabled: false },
        { label: "Results", enabled: false },
      ],
    },
    {
      title: "Institution",
      description: "Learn about the institution and its leadership.",
      icon: LucideIcon.Users,
      links: [
        {
          label: "About Us",
          href: "#about",
          enabled: isSectionEnabled("about"),
        },
        { label: "Governing Body", enabled: false },
        { label: "Facilities", enabled: false },
        { label: "Affiliation", enabled: false },
      ],
    },
    {
      title: "News & Activities",
      description: "Stay connected with institutional updates.",
      icon: LucideIcon.Newspaper,
      links: [
        {
          label: "Notices",
          href: "/notices",
          enabled: isSectionEnabled("notices"),
        },
        { label: "Events", enabled: false },
        { label: "Photo Gallery", enabled: false },
        { label: "Downloads", enabled: false },
      ],
    },
  ];

  return (
    <main
      className="w-full min-h-screen lg:space-y-24 space-y-8 lg:py-16 py-8"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: typography?.bodyFont || "Inter",
      }}
    >
      {/*=====================================
      |* TOP INSTITUTIONAL HEADER SECTION
      |* =====================================*/}
      <section
        className="bg-sky-400s mx-auto"
        style={{
          background: `linear-gradient(125deg, ${primaryColor}, ${secondaryColor})`,
          // backgroundColor: accentColor || "#123b83",
          // color: textColor || "yellow",
          // maxWidth: layout?.maxWidth || "1280px",
        }}
      >
        <InstitutionalHeader settings={settings} themes={themes} />
      </section>

      {/*=====================================
      |* TOP CONTACT BAR SECTION
      |* =====================================*/}
      <section className="">
        {headerConfig?.showTopBar !== false && (
          <div
            className="hidden text-white md:block mx-auto rounded-t-2xl border-b"
            style={{
              backgroundColor: primaryColor || "#123b83",
              maxWidth: layout?.maxWidth || "1280px",
            }}
          >
            <div className="flex items-center justify-between lg:px-6 py-3 text-sm">
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
        )}

        {/*=====================================
        |* LEADERSHIP MESSAGE BANNER
        |* =====================================*/}

        <header className="">
          <LeadershipMessageSection settings={settings} themes={themes ?? []} />
        </header>
      </section>
      {/*=====================================
      |* HERO SECTION
      |* ==================================s===*/}
      {heroConfig?.showHero && currentSlide && (
        <section className="bg-yellow-500s borders">
          <div
            className="relative mx-auto isolate min-h-130 overflow-hidden rounded-2xl bg-slate-900"
            style={{
              backgroundColor: secondaryColor,
              color: "#FFFFFF",
              maxWidth: layout?.maxWidth || "1280px",
            }}
          >
            {slides.map((slide, index) => (
              <img
                key={slide._id || slide.image.publicId || index}
                src={slide.image.url}
                alt={slide.image.alt}
                className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                  index === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/95 via-slate-900/75 to-slate-900/10" />

            <div className="flex min-h-125 items-center py-6 lg:py-20">
              <div
                key={currentSlide._id || activeSlide}
                className="max-w-4xl animate-[fadeIn_0.8s_ease-in-out] lg:p-16 p-8 text-white"
              >
                {heroConfig.showSubtitle && (
                  <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                    <Star size={15} className="text-yellow-400" />
                    {currentSlide.subtitle}
                  </p>
                )}

                <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {currentSlide.title}
                </h2>

                {currentSlide.description && (
                  <p className="mt-6 max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                    {currentSlide.description}
                  </p>
                )}

                <div className="mt-9 flex flex-wrap gap-4">
                  {heroConfig.showPrimaryButton &&
                    currentSlide.primaryButtonText &&
                    currentSlide.primaryButtonLink && (
                      <a
                        href={currentSlide.primaryButtonLink}
                        className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-7 py-4 font-bold text-slate-950 transition hover:bg-yellow-300"
                      >
                        {currentSlide.primaryButtonText}
                        <ArrowRight size={18} />
                      </a>
                    )}

                  {heroConfig.showSecondaryButton &&
                    currentSlide.secondaryButtonText &&
                    currentSlide.secondaryButtonLink && (
                      <a
                        href={currentSlide.secondaryButtonLink}
                        className="inline-flex items-center gap-2 rounded-full border border-white/70 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-900"
                      >
                        {currentSlide.secondaryButtonText}
                      </a>
                    )}
                </div>
              </div>
            </div>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (current) =>
                        (current - 1 + slides.length) % slides.length,
                    )
                  }
                  className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white shadow-lg backdrop-blur transition hover:bg-black/80"
                  aria-label="Previous slide"
                >
                  &#8592;
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((current) => (current + 1) % slides.length)
                  }
                  className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white shadow-lg backdrop-blur transition hover:bg-black/80"
                  aria-label="Next slide"
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* Feature strip overlapping a part of Hero bottom*/}
      <section className="relative z-10 mx-auto lg:-mt-36 -mt-16 max-w-7xl px-5 lg:px-6">
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
                className={`flex items-center gap-5 px-7 lg:py-7 py-3 ${
                  index !== 3 ? "lg:border-r lg:border-slate-200" : ""
                }`}
              >
                <Icon size={38} style={{ color: primaryColor }} />
                <div>
                  <h3 className="font-extrabold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/*=====================================
      |* FEATURE NAVIGATION PANEL
      |* =====================================*/}
      <section
        className="relative z-20 mx-auto w-full px-4 lg:px-0"
        style={{ maxWidth: layout?.maxWidth || "1280px" }}
      >
        <div className="overflow-hidden rounded-2xl">
          {/* Navigate Button */}
          <button
            type="button"
            onClick={() => setIsNavigationOpen((previous) => !previous)}
            aria-expanded={isNavigationOpen}
            aria-controls="institution-navigation"
            className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-6 text-left text-white shadow-lg transition hover:opacity-95 sm:px-8"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="space-y-4">
              <div className="">
                <h2 className="flex items-center gap-2 lg:text-xl text-amber-400 font-extrabold sm:text-2xl">
                  <Compass size={28} className="text-amber-400" /> NAVIGATE &
                  EXPLORE ALL{" "}
                  <span className="hidden lg:flex">INSTITUTIONAL DETAILS </span>
                </h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-normal font-extrabold sm:text-2xl">
                  Everything About Our Institution, Just One Click Away!
                </h3>
                <p className="mt-1 text-sm text-white/80 max-w-4xl">
                  Explore admission information, academic programmes, student
                  services, institutional leadership, notices, events and campus
                  activities — all organized in one convenient place.
                </p>
              </div>
            </div>

            <div className="bg-amber-400 px-3 py-3 rounded-full cursor-pointer">
              <ChevronDown
                size={30}
                className={`shrink-0 transition-transform duration-300 ${
                  isNavigationOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Expandable Cards */}
          <div
            id="institution-navigation"
            className={`grid transition-all duration-500 ease-in-out ${
              isNavigationOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div
                className="grid gap-5 py-6 sm:grid-cols-2 lg:grid-cols-4"
                style={{ backgroundColor: backgroundColor }}
              >
                {navigationGroups.map((group) => {
                  const Icon = group.icon;

                  return (
                    <article
                      key={group.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className="mb-4 inline-flex rounded-xl p-3 text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Icon size={25} />
                      </div>

                      <h3 className="text-lg font-extrabold">{group.title}</h3>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                        {group.description}
                      </p>

                      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                        {group.links.map((link) => (
                          <div key={link.label}>
                            {link.enabled && link.href ? (
                              <a
                                href={link.href}
                                className="flex items-center justify-between gap-2 text-sm font-semibold transition hover:translate-x-1"
                                style={{ color: primaryColor }}
                              >
                                {link.label}
                                <ArrowRight size={15} />
                              </a>
                            ) : (
                              <div className="flex items-center justify-between gap-2 text-sm text-slate-400">
                                <span>{link.label}</span>
                                <span className="text-xs">Coming soon</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*=====================================
      |* ABOUT & NOTICE SECTION
      |* =====================================*/}
      {(isSectionEnabled("about") || isSectionEnabled("notices")) && (
        <div className="">
          <section
            className="grid mx-auto grid-cols-1 gap-10 rounded-3xl lg:grid-cols-3 lg:py- py- lg:px-0 px-4"
            style={{
              // backgroundColor: surfaceColor,
              color: textColor,
              maxWidth: layout?.maxWidth || "1280px",
            }}
          >
            <div
              className={
                isSectionEnabled("about") ? "lg:col-span-2" : "lg:col-span-3"
              }
            >
              {isSectionEnabled("about") && (
                <div className="grid items-center lg:gap-8 gap-4 md:grid-cols-2">
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
                      We are committed to providing quality education,
                      encouraging innovation and developing responsible citizens
                      for tomorrow. Moral values preponderates here on all
                      prejudices and shortcomings. Making a real human being is
                      our motto.
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
                      className="h-80 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>

            {isSectionEnabled("notices") && (
              <aside
                id="notices"
                className="border-l-0 border-slate-200 pl-0 lg:border-l lg:pl-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold">Latest Notices</h2>
                  <a
                    href="/notices"
                    className="flex items-center gap-1 text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    View All <ArrowRight size={16} />
                  </a>
                </div>

                <div className="">
                  <NoticesSection notices={notices} />
                </div>
              </aside>
            )}
          </section>
        </div>
      )}
      {/*=====================================
      |* ACADEMIC PROGRESS SECTION
      |* =====================================*/}
      {isSectionEnabled("academic") && (
        <section className="">
          <div
            id="academics"
            className="lg:rounded-none rounded-3xl mx-auto lg:px-0 px-4"
            style={{
              maxWidth: layout?.maxWidth || "1280px",
            }}
          >
            <div className="mx-auto max-w-7xl text-center">
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
                    BookOpen,
                  ],
                  [
                    "Creative Activities",
                    "Opportunities to discover and develop talents.",
                    Trophy,
                  ],
                  [
                    "Student Development",
                    "Building confidence, values and leadership.",
                    Users,
                  ],
                ].map(([title, description, Icon]) => (
                  <article
                    key={String(title)}
                    className="rounded-2xl bg-white lg:p-8 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className="mb-5 inline-flex rounded-xl p-3 text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Icon size={25} />
                    </div>
                    <h3 className="text-xl font-bold">{String(title)}</h3>
                    <p className="mt-3 leading-7 text-slate-500">
                      {String(description)}
                    </p>
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
          </div>
        </section>
      )}
      {/*=====================================
      |* ADMISSION CALL TO ACTION SECTION
      |* =====================================*/}
      {features?.admissions && (
        <section className="bg-emerald-500s">
          <div
            id="admissions"
            className="mx-auto"
            style={{
              // backgroundColor: secondaryColor,
              // color: "#FFFFFF",
              maxWidth: layout?.maxWidth || "1280px",
            }}
          >
            <div
              className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl lg:px-8 px-4 lg:py-12 py-6 text-white md:flex-row md:px-14"
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
          </div>
        </section>
      )}
    </main>
  );
};

export default ModernTheme;
