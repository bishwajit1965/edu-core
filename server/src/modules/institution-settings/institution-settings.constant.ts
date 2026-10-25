export const INSTITUTION_TYPE = {
  SCHOOL: "SCHOOL",
  COLLEGE: "COLLEGE",
  SCHOOL_AND_COLLEGE: "SCHOOL_AND_COLLEGE",
} as const;

export const INSTITUTION_SETTINGS_DEFAULTS = {
  branding: {
    logo: "",
    favicon: "",
    primaryColor: "#2563eb",
  },

  contact: {
    phone: "",
    email: "",
    address: "",
    mapUrl: "",
  },

  social: {
    facebook: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  },

  seo: {
    title: "",
    description: "",
    keywords: [] as string[],
  },

  features: {
    admissions: true,
    notices: true,
    events: true,
    literaryCorner: true,
    studentPortal: false,
    guardianPortal: false,
  },

  system: {
    maintenanceMode: false,
    registrationEnabled: true,
    timezone: "Asia/Dhaka",
    language: "bn",
  },
} as const;

export const INSTITUTION_SETTINGS_ERROR_MESSAGES = {
  NOT_FOUND: "Institution settings have not been configured yet.",
  ALREADY_EXISTS: "Institution settings have already been configured.",
} as const;
