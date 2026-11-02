import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getPublicInstitutionSettings,
  type PublicInstitutionSettings,
} from "../../features/settings/settingsApi.js";
// import { showError } from "../../utils/alert.js";
import ThemeResolver from "../../features/website/ThemeResolver.js";

const Home = () => {
  const [settings, setSettings] = useState<PublicInstitutionSettings | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const { user } = useAuth() as {
    user?: {
      name?: string;
      email?: string;
      role?: "ADMIN" | "USER" | string;
    } | null;
  };
  console.log("Settings in home page", settings);
  const userLabel = user
    ? `Logged in as ${user.name || user.email}`
    : "Not logged in";

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
      {/* <h1 className="lg:text-2xl text-xl font-bold">Home Page</h1>
      <p>{userLabel}</p>

      <p>
        {user && user.role === "ADMIN"
          ? "You are an admin"
          : "You are not an admin"}
      </p>
      <p>
        {user ? (
          <span>Logged in with access to additional features.</span>
        ) : (
          <span>Please log in to access more features.</span>
        )}
      </p> */}

      <ThemeResolver settings={settings} />
    </div>
  );
};

export default Home;
