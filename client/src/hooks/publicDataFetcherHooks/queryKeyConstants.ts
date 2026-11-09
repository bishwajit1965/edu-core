export const PUBLIC_API_KEYS = {
  NOTICE: ["public", "notices"],
  NOTICE_DETAILS: (noticeId: string) =>
    ["public", "notices", noticeId] as const,

  TEACHER: ["public", "teachers"],
} as const;
