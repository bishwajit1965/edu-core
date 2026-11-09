import { Outlet } from "react-router-dom";
// import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import {
  getPublicInstitutionSettings,
  type PublicInstitutionSettings,
} from "../features/settings/settingsApi";
import { useEffect, useState } from "react";
import ThemeFooterResolver from "../features/website/ThemeFooterResolver";

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PublicInstitutionSettings | null>(
    null,
  );
  console.log("Settings in Main layout", settings);
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

  if (loading) return <div className="">Loading...</div>;

  if (!settings) return <div>Unable to load institution settings.</div>;
  return (
    <div>
      <NavBar settings={settings} />

      <div className="lg:max-w-7xl flex mx-auto lg:min-h-[calc(100vh-100px)] items-centers justify-center lg:py-8 py-4 lg:p-0 px-4">
        <Outlet />
      </div>

      {settings && <ThemeFooterResolver settings={settings} />}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
