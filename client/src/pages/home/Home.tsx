import { useEffect, useState } from "react";
import {
  getPublicInstitutionSettings,
  type PublicInstitutionSettings,
} from "../../features/settings/settingsApi.js";

import ThemeResolver from "../../features/website/ThemeResolver.js";
import {
  getPublicNotices,
  type Notice,
} from "../../features/notice/noticeApi.js";

import { usePublicApiQuery } from "../../hooks/publicDataFetcherHooks/usePublicApiQuery.js";
import { PUBLIC_API_KEYS } from "../../hooks/publicDataFetcherHooks/queryKeyConstants.js";
import { getActiveThemes } from "../../features/theme/themeApi.js";

const Home = () => {
  const [settings, setSettings] = useState<PublicInstitutionSettings | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Notice related data state
  const [notices, setNotices] = useState<Notice[]>([]);

  console.log("Notices in home page", notices);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const data = await getPublicInstitutionSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load website settings:", error);
        // showError("Unable to load the institution website.");
        setError("Unable to load the institution website.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Publicly visible notices fetched
  useEffect(() => {
    const loadNotices = async () => {
      setLoading(true);
      try {
        const data = await getPublicNotices();
        setNotices(data);
      } catch (error) {
        console.error("Failed to load website settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadNotices();
  }, []);

  const { data: themes } = usePublicApiQuery({
    key: [...PUBLIC_API_KEYS.THEME],
    queryFn: getActiveThemes,
  });

  console.log("Settings in home page", settings);

  if (loading) {
    return <div className="p-8 text-center">Loading website...</div>;
  }

  if (error || !settings) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || "Institution settings are unavailable."}
      </div>
    );
  }

  return (
    <div className="">
      <ThemeResolver
        settings={settings}
        themes={themes ?? []}
        notices={notices}
      />
    </div>
  );
};

export default Home;
