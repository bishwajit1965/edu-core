export const PUBLIC_API_KEYS = {
  ABOUT: ["public", "about"],

  NOTICE: ["public", "notices"],

  NOTICE_DETAILS: (noticeId: string) =>
    ["public", "notices", noticeId] as const,

  // PUBLIC STUDENT DASHBOARD PROFILE
  ME: ["public", "me"],

  // SCIENCE SUBJECT CONFIGURATION
  SCIENCE_SUBJECTS_COMBINATION: ["public", "science-subjects-combination"],

  // BUSINESS STUDIES SUBJECTS CONFIGURATION
  BUSINESS_STUDIES_SUBJECTS_COMBINATION: [
    "public",
    "business-studies-subjects-combination",
  ],

  // HUMANITIES SUBJECTS CONFIGURATION
  HUMANITIES_SUBJECTS_COMBINATION: [
    "public",
    "humanities-subjects-combination",
  ],

  SETTING: ["public", "settings"],

  THEME: ["public", "themes"],

  TEACHER: ["public", "teachers"],

  // ADMIN PANEL RELATED KEYS
  ROLE: ["admin", "roles"],
  PERMISSION: ["admin", "permissions"],
} as const;
