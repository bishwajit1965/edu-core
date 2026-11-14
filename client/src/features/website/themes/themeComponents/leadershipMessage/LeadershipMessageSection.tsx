import type {
  PublicInstitutionSettings,
  ILeadershipMessage,
} from "../../../../../features/settings/settingsApi";
import type { Theme } from "../../../../theme/themeApi";

interface LeadershipMessageProps {
  settings: PublicInstitutionSettings | PublicInstitutionSettings[];
  themes: Theme[];
}

const LeaderCard = ({ leader }: { leader: ILeadershipMessage }) => {
  const isChairman = leader.role === "GB_CHAIRMAN";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isChairman
          ? "border-emerald-200 shadow-md"
          : "border-gray-200 shadow-sm"
      }`}
    >
      {/* Portrait */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
        {leader.photo ? (
          <img
            src={leader.photo}
            alt={leader.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl font-bold text-gray-300">
            {leader.name.charAt(0).toUpperCase()}
          </div>
        )}

        {isChairman && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow">
            GB Chairman
          </span>
        )}
      </div>

      {/* Leader information */}
      <div className="flex flex-1 flex-col p-4 sm:p-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          {leader.designation}
        </p>

        <h3 className="mt-2 text-xl font-bold leading-snug text-gray-900">
          {leader.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">{leader.qualification}</p>

        <div className="my-4 h-px w-full bg-gray-100" />

        {/* Message preview */}
        <p className="line-clamp-4 whitespace-pre-line text-sm leading-7 text-gray-600">
          {leader.message}
        </p>

        {/* Expandable full message */}
        {leader.message && (
          <details className="mt-4 border-t border-gray-200 pt-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-emerald-700 hover:text-emerald-900">
              <span className="details-open:hidden">Read full message →</span>
              <span className="hidden details-open:inline">Show less →</span>
            </summary>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {leader.message}
            </p>
          </details>
        )}
      </div>
    </article>
  );
};

const LeadershipMessageSection = ({
  settings,
  themes,
}: LeadershipMessageProps) => {
  // Accept either one settings object or an array containing it.
  const institutionSettings = Array.isArray(settings) ? settings[0] : settings;
  const SettingsPrimaryColor =
    institutionSettings?.branding?.primaryColor ?? "";
  const leadership = institutionSettings?.leadershipMessages;
  const theme = institutionSettings.website.theme;
  console.log("THEME SET IN LEADERSHIP MESSAGE", theme);

  // THEME CHOSEN
  const themeSetting = themes?.find(
    (theme) => theme.slug === "modern-professional",
  );

  // COLORS EXTRACTED FROM MODERN THEME
  const colorConfig = themeSetting?.config?.colors;
  const primaryColor =
    colorConfig?.primary || SettingsPrimaryColor || "#12304A";
  const secondaryColor = colorConfig?.secondary || "#B08D57";
  const colorSurface = colorConfig?.surface || "#FFFFFF";
  const colorText = colorConfig?.text || "#292638";

  console.log("THEME SET IN LEADERSHIP MESSAGE ----->", themeSetting);
  console.log("THEME COLOR CONFIG ----->", colorConfig);
  if (!leadership?.enabled) return null;

  const leaders = [...(leadership.leaders || [])]
    .filter(
      (leader) =>
        leader.isActive && leader.name.trim() && leader.qualification.trim(),
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (!leaders.length) return null;

  return (
    <section className="lg:space-y-10 space-y-5">
      {/* Section heading */}
      <div className="lg:px-0 px-4">
        <div
          className="mx-auto max-w-7xl text-center lg:space-y-6 space-y-4 lg:py-8 py-4 lg:rounded-b-2xl lg:rounded-t-none rounded-2xl shadow-sm"
          style={{ backgroundColor: colorSurface, color: colorText }}
        >
          <div className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 border border-emerald-500">
            Our Leadership
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {leadership.title}
          </h2>

          {leadership.subtitle && (
            <p className="text-sm leading-6 sm:text-base">
              {leadership.subtitle}
            </p>
          )}

          <div className="mx-auto h-1.25 w-16 rounded-full bg-emerald-600" />
        </div>
      </div>

      {/* Unified responsive leadership cards */}
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8 max-w-7xl mx-auto lg:px-0 px-4">
        {leaders.map((leader) => (
          <LeaderCard key={leader.role} leader={leader} />
        ))}
      </div>
    </section>
  );
};

export default LeadershipMessageSection;
