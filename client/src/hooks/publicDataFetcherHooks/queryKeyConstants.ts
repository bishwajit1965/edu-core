export const PUBLIC_API_KEYS = {
  ABOUT: ["public", "about"],

  NOTICE: ["public", "notices"],

  NOTICE_DETAILS: (noticeId: string) =>
    ["public", "notices", noticeId] as const,

  SETTING: ["public", "settings"],

  THEME: ["public", "themes"],

  TEACHER: ["public", "teachers"],
} as const;
