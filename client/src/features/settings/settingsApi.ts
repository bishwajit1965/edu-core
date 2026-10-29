import axiosInstance from "../../lib/axios.js";

export interface InstitutionSettings {
  institution: {
    name: string;
    institutionType: "SCHOOL" | "COLLEGE" | "SCHOOL_AND_COLLEGE";
    eiin?: string;
    code: string;
    establishedYear?: number;
    address: string;
    phone: string;
    email: string;
    website?: string;
    mpoCode?: string;
    nuCode?: string;
  };
  branding: {
    logo: string;
    favicon: string;
    primaryColor: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    mapUrl?: string;
  };
  social: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  features: {
    admissions: boolean;
    notices: boolean;
    events: boolean;
    literaryCorner: boolean;
    studentPortal: boolean;
    guardianPortal: boolean;
  };
  system: {
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    timezone: string;
    language: string;
  };
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const SETTINGS_ENDPOINT = "/institution-settings";

export const getInstitutionSettings =
  async (): Promise<InstitutionSettings> => {
    const response =
      await axiosInstance.get<ApiResponse<InstitutionSettings>>(
        SETTINGS_ENDPOINT,
      );

    return response.data.data;
  };

export const updateInstitutionSettings = async (
  payload: Partial<InstitutionSettings>,
): Promise<InstitutionSettings> => {
  const response = await axiosInstance.patch<ApiResponse<InstitutionSettings>>(
    SETTINGS_ENDPOINT,
    payload,
  );

  return response.data.data;
};
