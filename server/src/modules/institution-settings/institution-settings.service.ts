import AppError from "../../errors/AppError";
import { IInstitutionSettings } from "./institution-settings.interface";
import { InstitutionSettings } from "./institution-settings.model";
import type { IPublicInstitutionSettings } from "./institution-settings.interface.js";

const getPublicInstitutionSettingsService =
  async (): Promise<IPublicInstitutionSettings> => {
    const settings = await InstitutionSettings.findOne()
      .select(
        "institution.name institution.institutionType institution.address institution.phone institution.email institution.website institution.establishedYear branding contact social seo features.admissions features.notices features.events features.literaryCorner website.theme",
      )
      .lean();

    if (!settings) {
      throw new AppError(
        404,
        "Institution settings have not been configured yet.",
      );
    }

    return settings as unknown as IPublicInstitutionSettings;
  };

const getInstitutionSettingsService = async () => {
  const settings = await InstitutionSettings.findOne();
  if (!settings) {
    throw new AppError(
      404,
      "Institution settings have not been configured yet.",
    );
  }
  return settings;
};

const createInstitutionSettingsService = async (
  payload: IInstitutionSettings,
) => {
  const existingSettings = await InstitutionSettings.findOne();
  if (existingSettings) {
    throw new AppError(
      409,
      "Institution settings have already been configured.",
    );
  }

  const settings = await InstitutionSettings.create(payload);
  return settings;
};

const updateInstitutionSettingsService = async (
  payload: Partial<IInstitutionSettings>,
) => {
  const settings = await InstitutionSettings.findOne();

  if (!settings) {
    throw new AppError(
      404,
      "Institution settings have not been configured yet.",
    );
  }

  const allowedSection = [
    "institution",
    "branding",
    "contact",
    "social",
    "seo",
    "features",
    "system",
    "website",
  ] as const;

  for (const section of allowedSection) {
    const updates = payload[section];
    if (updates) {
      const currentSection = settings[section];
      Object.assign(currentSection, updates);
    }
  }
  await settings.save();

  return settings;
};

export const InstitutionSettingsService = {
  getPublicInstitutionSettingsService,
  getInstitutionSettingsService,
  createInstitutionSettingsService,
  updateInstitutionSettingsService,
};
