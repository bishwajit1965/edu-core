import { useEffect, useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  getInstitutionSettings,
  updateInstitutionSettings,
  type InstitutionSettings,
} from "../../features/settings/settingsApi";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import { LucideLoaderCircle, LucideSave } from "lucide-react";
import Checkbox from "../../components/ui/Checkbox";
import { showSuccess, showError } from "../../utils/alert.js";

const SettingsPage = () => {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<InstitutionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [keywordsText, setKeywordsText] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getInstitutionSettings();
        setSettings(data);
        setKeywordsText(data.seo.keywords.join(", "));
      } catch {
        setLoadError("Failed to load institution settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleInstitutionChange = (
    field: keyof InstitutionSettings["institution"],
    value: string,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            institution: {
              ...previous.institution,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleBrandingChange = (
    field: keyof InstitutionSettings["branding"],
    value: string,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            branding: {
              ...previous.branding,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleSeoChange = (
    field: keyof InstitutionSettings["seo"],
    value: string | string[],
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            seo: {
              ...previous.seo,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleContactChange = (
    field: keyof InstitutionSettings["contact"],
    value: string,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            contact: {
              ...previous.contact,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleSocialChange = (
    field: keyof InstitutionSettings["social"],
    value: string,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            social: {
              ...previous.social,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleFeatureChange = (
    field: keyof InstitutionSettings["features"],
    value: boolean,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            features: {
              ...previous.features,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleSystemChange = (
    field: keyof InstitutionSettings["system"],
    value: boolean | string,
  ) => {
    setSettings((previous) =>
      previous
        ? {
            ...previous,
            system: {
              ...previous.system,
              [field]: value,
            },
          }
        : previous,
    );
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);

    try {
      const updatedSettings = await updateInstitutionSettings({
        institution: settings.institution,
        branding: settings.branding,
        seo: settings.seo,
        contact: settings.contact,
        social: settings.social,
        features: settings.features,
        system: settings.system,
      });

      setSettings((previous) =>
        previous
          ? {
              ...previous,
              ...updatedSettings,
            }
          : updatedSettings,
      );
      if (updatedSettings) {
        showSuccess("Institution settings saved!");
      }
    } catch (error) {
      console.error("Failed to save institution settings:", error);
      showError("Woops! settings update failed!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading institution settings...</p>;
  }

  if (loadError) {
    return <p className="p-6 text-red-600">{loadError}</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Settings"
        description="Manage your institution's information and preferences."
        actions={
          <Button
            onClick={handleSave}
            loading={saving}
            icon={saving ? LucideLoaderCircle : LucideSave}
            className="cursor-pointer"
          >
            {saving ? "Saving Settings..." : "Save Settings"}
          </Button>
        }
      />

      {/* Institution Info Section */}
      <Card
        title="Institution Information"
        description="Basic details about your school or college."
        className=""
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Institution Name"
            name="name"
            placeholder="Enter institution name"
            value={settings?.institution.name ?? ""}
            onChange={(event) =>
              handleInstitutionChange("name", event.target.value)
            }
            required
          />

          <Select
            label="Institution Type"
            name="type"
            value={settings?.institution.institutionType ?? ""}
            onChange={(event) =>
              handleInstitutionChange("institutionType", event.target.value)
            }
            options={[
              { label: "School", value: "SCHOOL" },
              { label: "College", value: "COLLEGE" },
              { label: "School & College", value: "SCHOOL_AND_COLLEGE" },
            ]}
            placeholder="Select institution type"
            required
          />

          <Input
            label="EIIN"
            name="eiin"
            placeholder="Enter EIIN"
            value={settings?.institution.eiin ?? ""}
            onChange={(event) =>
              handleInstitutionChange("eiin", event.target.value)
            }
          />

          <Input
            label="Institution Code"
            name="code"
            placeholder="Enter institution code"
            value={settings?.institution.code ?? ""}
            onChange={(event) =>
              handleInstitutionChange("code", event.target.value)
            }
            required
          />

          <Input
            label="Phone"
            name="phone"
            placeholder="Enter phone number"
            value={settings?.institution.phone ?? ""}
            onChange={(event) =>
              handleInstitutionChange("phone", event.target.value)
            }
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={settings?.institution.email ?? ""}
            onChange={(event) =>
              handleInstitutionChange("email", event.target.value)
            }
          />

          <Input
            label="Address"
            name="address"
            placeholder="Enter institution address"
            value={settings?.institution.address ?? ""}
            onChange={(event) =>
              handleInstitutionChange("address", event.target.value)
            }
          />

          <Input
            label="Website"
            name="website"
            type="url"
            placeholder="https://example.com"
            value={settings?.institution.website ?? ""}
            onChange={(event) =>
              handleInstitutionChange("website", event.target.value)
            }
          />
        </div>
      </Card>

      {/* Branding Section */}
      <Card
        title="Branding"
        description="Customize your institution's visual identity."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Primary Color"
            name="primaryColor"
            type="color"
            value={settings?.branding.primaryColor ?? "#198754"}
            onChange={(event) =>
              handleBrandingChange("primaryColor", event.target.value)
            }
            className="h-6"
          />

          <Input
            label="Logo URL"
            name="logo"
            type="url"
            placeholder="https://example.com/logo.png"
            value={settings?.branding.logo ?? ""}
            onChange={(event) =>
              handleBrandingChange("logo", event.target.value)
            }
          />

          <Input
            label="Favicon URL"
            name="favicon"
            type="url"
            placeholder="https://example.com/favicon.ico"
            value={settings?.branding.favicon ?? ""}
            onChange={(event) =>
              handleBrandingChange("favicon", event.target.value)
            }
          />
        </div>
      </Card>

      {/* SEO section */}
      <Card
        title="SEO Settings"
        description="Configure default search-engine metadata for your institution."
      >
        <div className="space-y-4">
          <Input
            label="SEO Title"
            name="seoTitle"
            value={settings?.seo.title ?? ""}
            onChange={(event) => handleSeoChange("title", event.target.value)}
            placeholder="Enter SEO title"
          />

          <Textarea
            label="SEO Description"
            name="seoDescription"
            value={settings?.seo.description ?? ""}
            onChange={(event) =>
              handleSeoChange("description", event.target.value)
            }
            placeholder="Enter a short description"
            rows={3}
            maxLength={160}
          />

          <Input
            label="SEO Keywords"
            name="seoKeywords"
            value={keywordsText}
            onChange={(event) => {
              const text = event.target.value;
              setKeywordsText(text);

              handleSeoChange(
                "keywords",
                text
                  .split(",")
                  .map((keyword) => keyword.trim())
                  .filter(Boolean),
              );
            }}
            placeholder="school, college, education"
          />
        </div>
      </Card>

      {/* Contact Section */}

      <Card
        title="Contact Information"
        description="Manage the public contact details for your institution."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Contact Phone"
            name="contactPhone"
            value={settings?.contact.phone ?? ""}
            onChange={(event) =>
              handleContactChange("phone", event.target.value)
            }
            placeholder="Enter contact phone"
          />

          <Input
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={settings?.contact.email ?? ""}
            onChange={(event) =>
              handleContactChange("email", event.target.value)
            }
            placeholder="office@example.com"
          />

          <Input
            label="Contact Address"
            name="contactAddress"
            value={settings?.contact.address ?? ""}
            onChange={(event) =>
              handleContactChange("address", event.target.value)
            }
            placeholder="Enter contact address"
          />

          <Input
            label="Google Maps URL"
            name="mapUrl"
            type="url"
            value={settings?.contact.mapUrl ?? ""}
            onChange={(event) =>
              handleContactChange("mapUrl", event.target.value)
            }
            placeholder="https://maps.google.com/..."
          />
        </div>
      </Card>

      {/* Social Media Card */}

      <Card
        title="Social Media"
        description="Add your institution's official social media links."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Facebook"
            name="facebook"
            type="url"
            placeholder="https://facebook.com/..."
            value={settings?.social.facebook ?? ""}
            onChange={(event) =>
              handleSocialChange("facebook", event.target.value)
            }
          />

          <Input
            label="YouTube"
            name="youtube"
            type="url"
            placeholder="https://youtube.com/..."
            value={settings?.social.youtube ?? ""}
            onChange={(event) =>
              handleSocialChange("youtube", event.target.value)
            }
          />

          <Input
            label="Instagram"
            name="instagram"
            type="url"
            placeholder="https://instagram.com/..."
            value={settings?.social.instagram ?? ""}
            onChange={(event) =>
              handleSocialChange("instagram", event.target.value)
            }
          />

          <Input
            label="LinkedIn"
            name="linkedin"
            type="url"
            placeholder="https://linkedin.com/..."
            value={settings?.social.linkedin ?? ""}
            onChange={(event) =>
              handleSocialChange("linkedin", event.target.value)
            }
          />
        </div>
      </Card>

      {/* Feature card section */}

      <Card
        title="Feature Settings"
        description="Enable or disable features available on your institution website."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Checkbox
            label="Admissions"
            name="admissions"
            checked={settings?.features.admissions ?? false}
            onChange={(event) =>
              handleFeatureChange("admissions", event.target.checked)
            }
          />

          <Checkbox
            label="Notices"
            name="notices"
            checked={settings?.features.notices ?? false}
            onChange={(event) =>
              handleFeatureChange("notices", event.target.checked)
            }
          />

          <Checkbox
            label="Events"
            name="events"
            checked={settings?.features.events ?? false}
            onChange={(event) =>
              handleFeatureChange("events", event.target.checked)
            }
          />

          <Checkbox
            label="Literary Corner"
            name="literaryCorner"
            checked={settings?.features.literaryCorner ?? false}
            onChange={(event) =>
              handleFeatureChange("literaryCorner", event.target.checked)
            }
          />

          <Checkbox
            label="Student Portal"
            name="studentPortal"
            checked={settings?.features.studentPortal ?? false}
            onChange={(event) =>
              handleFeatureChange("studentPortal", event.target.checked)
            }
          />

          <Checkbox
            label="Guardian Portal"
            name="guardianPortal"
            checked={settings?.features.guardianPortal ?? false}
            onChange={(event) =>
              handleFeatureChange("guardianPortal", event.target.checked)
            }
          />
        </div>
      </Card>

      {/* System Settings Section */}

      <Card
        title="System Settings"
        description="Configure maintenance, registration, and localization."
      >
        <div className="space-y-5">
          <Checkbox
            label="Maintenance Mode"
            description="Indicate that the institution website is under maintenance."
            name="maintenanceMode"
            checked={settings?.system.maintenanceMode ?? false}
            onChange={(event) =>
              handleSystemChange("maintenanceMode", event.target.checked)
            }
          />

          <Checkbox
            label="Registration Enabled"
            description="Allow registration where supported by the application."
            name="registrationEnabled"
            checked={settings?.system.registrationEnabled ?? false}
            onChange={(event) =>
              handleSystemChange("registrationEnabled", event.target.checked)
            }
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Timezone"
              name="timezone"
              value={settings?.system.timezone ?? "Asia/Dhaka"}
              onChange={(event) =>
                handleSystemChange("timezone", event.target.value)
              }
              placeholder="Asia/Dhaka"
            />

            <Select
              label="Language"
              name="language"
              value={settings?.system.language ?? "bn"}
              onChange={(event) =>
                handleSystemChange("language", event.target.value)
              }
              options={[
                { label: "বাংলা", value: "bn" },
                { label: "English", value: "en" },
              ]}
              placeholder="Select language"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
