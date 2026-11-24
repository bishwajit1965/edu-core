export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  PRINCIPAL: "PRINCIPAL",
  VICE_PRINCIPAL: "VICE_PRINCIPAL",
  TEACHER: "TEACHER",
  STAFF: "STAFF",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export const OTP_EXPIRES_IN = 300;

export const MAX_LOGIN_ATTEMPTS = 5;
