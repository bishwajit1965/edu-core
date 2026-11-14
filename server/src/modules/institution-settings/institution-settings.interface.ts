import { Model } from "mongoose";

export type LeadershipRole = "GB_CHAIRMAN" | "PRINCIPAL" | "VICE_PRINCIPAL";
export interface ILeadershipMessage {
  role: LeadershipRole;
  name: string;
  qualification: string;
  designation: string;
  photo: string;
  message: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ILeadershipMessages {
  enabled: boolean;
  title: string;
  subtitle: string;
  leaders: ILeadershipMessage[];
}
export interface IInstitution {
  name: string;
  institutionType: string;
  eiin?: string;
  code: string;
  establishedYear?: number;
  address: string;
  phone: string;
  email: string;
  website?: string;
  mpoCode?: string;
  nuCode?: string;
}

export interface IBranding {
  logo: string;
  favicon: string;
  primaryColor: string;
}

export interface IContact {
  phone: string;
  email: string;
  address: string;
  mapUrl?: string;
}

export interface ISocial {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
}

export interface ISEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface IFeatures {
  admissions: boolean;
  notices: boolean;
  events: boolean;
  literaryCorner: boolean;
  studentPortal: boolean;
  guardianPortal: boolean;
}

export interface ISystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  timezone: string;
  language: string;
}
export interface IWebsiteSettings {
  theme: string;
}

export interface IPublicInstitutionSettings {
  institution: Pick<
    IInstitution,
    | "name"
    | "institutionType"
    | "address"
    | "phone"
    | "email"
    | "website"
    | "establishedYear"
  >;
  branding: IBranding;
  contact: IContact;
  leadershipMessages: ILeadershipMessages;
  social: ISocial;
  seo: ISEO;
  features: Pick<
    IFeatures,
    "admissions" | "notices" | "events" | "literaryCorner"
  >;
  website: IWebsiteSettings;
}

export interface IInstitutionSettings {
  institution: IInstitution;
  branding: IBranding;
  contact: IContact;
  leadershipMessages: ILeadershipMessages;
  social: ISocial;
  seo: ISEO;
  features: IFeatures;
  system: ISystemSettings;
  website: IWebsiteSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InstitutionSettingsModel extends Model<IInstitutionSettings> {}
