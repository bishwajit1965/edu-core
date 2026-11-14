import { Outlet, useLocation, useMatches } from "react-router-dom";
// import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import {
  getPublicInstitutionSettings,
  type PublicInstitutionSettings,
} from "../features/settings/settingsApi";
import { useEffect, useState } from "react";
import ThemeFooterResolver from "../features/website/ThemeFooterResolver";
import { usePublicApiQuery } from "../hooks/publicDataFetcherHooks/usePublicApiQuery";
import { PUBLIC_API_KEYS } from "../hooks/publicDataFetcherHooks/queryKeyConstants";
import { getActiveThemes } from "../features/theme/themeApi";
import { LucideIcon } from "../components/ui/LucideIcons";
import DynamicDocumentHead from "../helpers/DynamicDocumentHead";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PublicInstitutionSettings | null>(
    null,
  );

  const location = useLocation();
  const pathName = location?.pathname;
  const isHomePage = pathName === "/";
  const matches = useMatches();

  const currentPageTitle = matches
    .map((match) => match.handle as { title?: string } | undefined)
    .filter((handle) => handle?.title)
    .at(-1)?.title;

  const { data: themes } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.THEME],
    queryFn: getActiveThemes,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicInstitutionSettings();
        setSettings(data);
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        console.log("Status", status);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center gap-2">
        Loading...
        <LucideIcon.Loader size={20} className="animate-spin" />
      </div>
    );

  if (!settings)
    return (
      <div className="min-h-screen flex items-center justify-center gap-2">
        <p className="flex items-center gap-2 text-red-500 lg:text-sm text-xs">
          <LucideIcon.AlertCircle size={20} />
          SORRY ! Unable to load institution settings.
        </p>
      </div>
    );

  return (
    <div>
      {/* DYNAMIC FAVICON + TITLE */}
      <DynamicDocumentHead
        favicon={settings?.branding?.favicon}
        siteTitle={settings?.seo?.title || settings?.institution?.name}
        pageTitle={currentPageTitle}
      />

      {/* NAVBAR */}
      <NavBar settings={settings} themes={themes ?? []} />

      {/* PAGE CONTENT WIDTH CONDITIONALLY */}
      {isHomePage ? (
        <div className="min-h-screen w-full">
          <Outlet />
        </div>
      ) : (
        <div
          className={`mx-auto w-full ${
            isHomePage ? "max-w-none" : "max-w-7xl"
          }`}
        >
          <Outlet />
        </div>
      )}

      {/* <DYNAMIC THEME FOOTER /> */}
      {settings && (
        <ThemeFooterResolver themes={themes ?? []} settings={settings} />
      )}
    </div>
  );
};

export default MainLayout;
